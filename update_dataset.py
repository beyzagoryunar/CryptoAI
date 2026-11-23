# -*- coding: utf-8 -*-
"""
CryptoAI Otomatik Veri Seti Güncelleme Boru Hattı (MLOps Continuous Ingestion)
Bu betik:
1. 'crypto_macro_dataset.csv' içindeki en son zaman damgasını (timestamp) okur.
2. Binance Public REST API'sinden o andan bugüne kadarki eksik saatlik BTCUSDT ve ETHUSDT mumlarını çeker.
3. Alternative.me API'sinden Kripto Korku ve Açgözlülük Endeksini (Fear & Greed) alır.
4. Yahoo Finance API'sinden S&P 500 Endeksini çeker ve tatil/hafta sonu için doldurur.
5. Teknik indikatörleri (RSI 14, MACD 12-26-9) kesintisiz birleşik seride hesaplar.
6. Hedef değişkenleri (target_price_1h, target_return_1h, target_direction_1h) oluşturur.
7. Güncellenen yeni satırları veri setine ekleyip kaydeder.
"""

import os
import time
import datetime
import requests
import numpy as np
import pandas as pd
import yfinance as yf

DATASET_PATH = "crypto_macro_dataset.csv"

def calculate_rsi(series, period=14):
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(com=period - 1, min_periods=period).mean()
    avg_loss = loss.ewm(com=period - 1, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)

def calculate_macd(series, fast=12, slow=26, signal=9):
    fast_ema = series.ewm(span=fast, adjust=False).mean()
    slow_ema = series.ewm(span=slow, adjust=False).mean()
    macd = fast_ema - slow_ema
    macd_signal = macd.ewm(span=signal, adjust=False).mean()
    macd_hist = macd - macd_signal
    return macd, macd_signal, macd_hist

def fetch_binance_klines(symbol, start_time_ms):
    url = "https://api.binance.com/api/v3/klines"
    headers = {"User-Agent": "Mozilla/5.0"}
    all_data = []
    cur_start = start_time_ms
    now_ms = int(time.time() * 1000)

    while cur_start < now_ms:
        params = {
            "symbol": symbol,
            "interval": "1h",
            "startTime": cur_start,
            "limit": 1000
        }
        try:
            r = requests.get(url, params=params, headers=headers, timeout=15)
            if r.status_code != 200:
                print(f"⚠️ Binance API hatası ({symbol}): {r.status_code}")
                break
            klines = r.json()
            if not klines or len(klines) == 0:
                break
            all_data.extend(klines)
            last_kline_open = klines[-1][0]
            if last_kline_open == cur_start:
                break
            cur_start = last_kline_open + 3600000  # 1 saat sonrasından devam et
            if len(klines) < 1000:
                break
            time.sleep(0.3)
        except Exception as e:
            print(f"⚠️ Binance istek hatası ({symbol}): {e}")
            break

    return all_data

def fetch_fear_greed():
    try:
        url = "https://api.alternative.me/fng/?limit=60"
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json().get("data", [])
            fng_dict = {}
            for item in data:
                # Tarih gün bazında: YYYY-MM-DD
                dt = datetime.datetime.utcfromtimestamp(int(item["timestamp"])).strftime("%Y-%m-%d")
                fng_dict[dt] = float(item["value"])
            return fng_dict
    except Exception as e:
        print(f"⚠️ Fear & Greed çekme hatası: {e}")
    return {}

def fetch_sp500():
    try:
        # Son 10 günlük S&P 500 saatlik verisi
        sp = yf.download("^GSPC", period="15d", interval="1h", progress=False)
        if not sp.empty:
            close_col = sp["Close"].squeeze()
            sp_df = pd.DataFrame({"sp500_close": close_col})
            sp_df.index = pd.to_datetime(sp_df.index, utc=True)
            return sp_df
    except Exception as e:
        print(f"⚠️ S&P 500 çekme hatası: {e}")
    return pd.DataFrame()

def main():
    print("=" * 70)
    print("🚀 CryptoAI Otomatik Veri Seti Güncelleme Başlatılıyor...")
    print("=" * 70)

    if not os.path.exists(DATASET_PATH):
        print(f"❌ '{DATASET_PATH}' dosyası bulunamadı!")
        return

    df_old = pd.read_csv(DATASET_PATH)
    df_old["timestamp"] = pd.to_datetime(df_old["timestamp"], utc=True)
    last_dt = df_old["timestamp"].max()
    print(f"📅 Veri Setindeki En Son Saat: {last_dt}")
    print(f"📊 Mevcut Toplam Satır Sayısı: {len(df_old):,}")

    start_ms = int(last_dt.timestamp() * 1000) + 3600000
    now_ms = int(time.time() * 1000)

    if start_ms >= now_ms:
        print("✅ Veri seti zaten güncel! Yeni eklenecek saat bulunmamaktadır.")
        return

    print("🌐 Binance üzerinden en yeni BTCUSDT ve ETHUSDT mumları çekiliyor...")
    btc_klines = fetch_binance_klines("BTCUSDT", start_ms)
    eth_klines = fetch_binance_klines("ETHUSDT", start_ms)

    if not btc_klines:
        print("ℹ️ Çekilecek yeni BTC mum verisi bulunamadı veya borsa henüz yeni bar açmadı.")
        return

    print(f"📥 {len(btc_klines)} yeni saatlik Bitcoin mumu alındı.")

    # Kline formatı: [open_time, open, high, low, close, volume, ...]
    btc_df = pd.DataFrame(btc_klines, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "quote_volume", "trades", "taker_base", "taker_quote", "ignore"
    ])
    btc_df["timestamp"] = pd.to_datetime(btc_df["open_time"], unit="ms", utc=True)
    btc_df["btc_open"] = btc_df["open"].astype(float)
    btc_df["btc_high"] = btc_df["high"].astype(float)
    btc_df["btc_low"] = btc_df["low"].astype(float)
    btc_df["btc_close"] = btc_df["close"].astype(float)
    btc_df["btc_volume"] = btc_df["volume"].astype(float)

    # ETH Eşleştirme
    eth_dict_close = {}
    eth_dict_vol = {}
    if eth_klines:
        for k in eth_klines:
            t = pd.to_datetime(k[0], unit="ms", utc=True)
            eth_dict_close[t] = float(k[4])
            eth_dict_vol[t] = float(k[5])

    btc_df["eth_close"] = btc_df["timestamp"].map(eth_dict_close)
    btc_df["eth_volume"] = btc_df["timestamp"].map(eth_dict_vol)
    # Eksik ETH varsa son değerle doldur
    last_eth = df_old["eth_close"].iloc[-1]
    last_eth_vol = df_old["eth_volume"].iloc[-1]
    btc_df["eth_close"] = btc_df["eth_close"].fillna(last_eth)
    btc_df["eth_volume"] = btc_df["eth_volume"].fillna(last_eth_vol)

    # Fear & Greed Eşleştirme
    print("🧠 Korku ve Açgözlülük Endeksi güncelleniyor...")
    fng_dict = fetch_fear_greed()
    last_fng = df_old["fear_greed_score"].iloc[-1]
    btc_df["date_str"] = btc_df["timestamp"].dt.strftime("%Y-%m-%d")
    btc_df["fear_greed_score"] = btc_df["date_str"].map(fng_dict).fillna(last_fng)

    # S&P 500 Eşleştirme
    print("📈 S&P 500 Endeksi güncelleniyor...")
    sp_df = fetch_sp500()
    last_sp = df_old["sp500_close"].iloc[-1]
    if not sp_df.empty:
        # Yakın eşleştirme / merge
        btc_df = pd.merge_asof(
            btc_df.sort_values("timestamp"),
            sp_df.sort_values(sp_df.index.name or "index"),
            left_on="timestamp",
            right_index=True,
            direction="backward"
        )
        btc_df["sp500_close"] = btc_df["sp500_close"].fillna(last_sp)
    else:
        btc_df["sp500_close"] = last_sp

    # Teknik indikatörler için eski son 100 satırla birleştir
    overlap = 100
    sub_old = df_old[["timestamp", "btc_close"]].tail(overlap)
    sub_new = btc_df[["timestamp", "btc_close"]]
    combined_btc = pd.concat([sub_old, sub_new], ignore_index=True)

    # Kesintisiz RSI ve MACD
    rsi_all = calculate_rsi(combined_btc["btc_close"])
    macd_all, sig_all, hist_all = calculate_macd(combined_btc["btc_close"])

    # Yeni satırlara aktar
    new_len = len(btc_df)
    btc_df["btc_rsi"] = rsi_all.tail(new_len).values
    btc_df["btc_macd"] = macd_all.tail(new_len).values
    btc_df["btc_macd_signal"] = sig_all.tail(new_len).values
    btc_df["btc_macd_hist"] = hist_all.tail(new_len).values

    # Eski veri ile yeni veriyi birleştir
    cols_to_keep = [
        "timestamp", "btc_open", "btc_high", "btc_low", "btc_close", "btc_volume",
        "eth_close", "eth_volume", "sp500_close", "fear_greed_score",
        "btc_rsi", "btc_macd", "btc_macd_signal", "btc_macd_hist"
    ]
    df_new_slice = btc_df[cols_to_keep].copy()
    
    # Tüm tabloyu birleştir
    df_combined = pd.concat([df_old[cols_to_keep], df_new_slice], ignore_index=True)
    df_combined = df_combined.drop_duplicates(subset=["timestamp"]).sort_values("timestamp").reset_index(drop=True)

    # Hedef Değişkenleri (Targets) Baştan Sona Hesapla
    df_combined["target_price_1h"] = df_combined["btc_close"].shift(-1)
    df_combined["target_return_1h"] = (df_combined["target_price_1h"] - df_combined["btc_close"]) / df_combined["btc_close"]
    df_combined["target_direction_1h"] = (df_combined["target_return_1h"] > 0).astype(int)

    # Son satırın target'ı henüz oluşmadığı için son satırı düşürmek yerine önceki değerle doldur
    df_combined["target_price_1h"] = df_combined["target_price_1h"].fillna(df_combined["btc_close"])
    df_combined["target_return_1h"] = df_combined["target_return_1h"].fillna(0.0)

    # Kaydet
    df_combined.to_csv(DATASET_PATH, index=False)
    
    added_count = len(df_combined) - len(df_old)
    print("=" * 70)
    print(f"🎉 GÜNCELLEME TAMAMLANDI!")
    print(f"➕ Eklenen Yeni Saat Sayısı: {added_count:,}")
    print(f"📈 Yeni Toplam Satır Sayısı: {len(df_combined):,}")
    print(f"🕒 Yeni En Son Zaman Damgası: {df_combined['timestamp'].max()}")
    print("=" * 70)

if __name__ == "__main__":
    main()
