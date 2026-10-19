import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { RootNavigator } from './navigation/RootNavigator';
import { colors } from './shared/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Uygulama Yüklenirken Bir Hata Oluştu</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Bilinmeyen hata'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeAreaProvider
      initialMetrics={
        initialWindowMetrics || {
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
          frame: { x: 0, y: 0, width: 400, height: 800 },
        }
      }
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent
      />
      <ErrorBoundary>
        <AuthProvider>
          <AppProvider>
            <View style={styles.container}>
              <RootNavigator />
            </View>
          </AppProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#090D14',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#8E9BAE',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
