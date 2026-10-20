import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing, borderRadius } from '../../../shared/theme';
import { Card } from '../../../shared/components';
import { useApp } from '../../../context/AppContext';
import { useTheme } from '../../../context/ThemeContext';

export const LlmAnalysisCard: React.FC = () => {
  const { portfolio } = useApp();
  const { colors, isDark } = useTheme();

  return (
    <Card
      style={[
        styles.analysisCard,
        {
          backgroundColor: isDark ? '#0E1724' : '#F0F9FF',
          borderColor: isDark ? '#1D2A3D' : '#BAE6FD',
        },
      ]}
    >
      <View style={styles.analysisHeader}>
        <View
          style={[
            styles.emojiBox,
            { backgroundColor: isDark ? '#152233' : '#E0F2FE' },
          ]}
        >
          <Text style={styles.analysisEmoji}>🤖</Text>
        </View>
        <Text style={[styles.analysisTitle, { color: colors.primary }]}>
          LLM Portföy Analizi
        </Text>
      </View>

      <Text
        style={[
          styles.analysisBody,
          { color: isDark ? '#B0C0D4' : '#334155' },
        ]}
      >
        {portfolio.llmAnalysisText}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  analysisCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 8,
  },
  emojiBox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisEmoji: {
    fontSize: 16,
  },
  analysisTitle: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  analysisBody: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 20,
  },
});
