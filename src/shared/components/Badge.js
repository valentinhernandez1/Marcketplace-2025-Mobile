import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) {
  return (
    <View style={[styles.badge, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  warning: {
    backgroundColor: theme.colors.warning,
  },
  info: {
    backgroundColor: theme.colors.info,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  size_sm: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  size_md: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  text_primary: {
    color: theme.colors.white,
  },
  text_success: {
    color: theme.colors.white,
  },
  text_danger: {
    color: theme.colors.white,
  },
  text_warning: {
    color: theme.colors.dark,
  },
  text_info: {
    color: theme.colors.white,
  },
  text_secondary: {
    color: theme.colors.white,
  },
});

