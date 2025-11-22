import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) {
  const hasGradient = ['primary', 'secondary', 'success'].includes(variant);
  
  const ButtonContent = (
    <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
      {title}
    </Text>
  );

  if (hasGradient && !disabled) {
    const gradientColors = 
      variant === 'primary' ? theme.gradients.primary :
      variant === 'secondary' ? theme.gradients.secondary :
      theme.gradients.success;

    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles[`size_${size}`],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, styles[`size_${size}`]]}
        >
          {ButtonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {ButtonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  size_sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  size_md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  size_lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  text_primary: {
    color: theme.colors.white,
  },
  text_secondary: {
    color: theme.colors.white,
  },
  text_success: {
    color: theme.colors.white,
  },
  text_danger: {
    color: theme.colors.white,
  },
  text_outline: {
    color: theme.colors.primary,
  },
});

