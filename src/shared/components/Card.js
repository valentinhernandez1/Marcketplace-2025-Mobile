import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Card({ children, onPress, style, variant = 'default', gradient = false }) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[
        styles.card,
        !gradient && styles[variant],
        gradient && styles.cardGradient,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.md,
  },
  cardGradient: {
    backgroundColor: theme.colors.background.primary,
  },
  default: {
    backgroundColor: theme.colors.background.primary,
  },
  primary: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  light: {
    backgroundColor: theme.colors.background.light,
  },
  secondary: {
    backgroundColor: theme.colors.secondaryLight,
    borderColor: theme.colors.secondary,
  },
});

