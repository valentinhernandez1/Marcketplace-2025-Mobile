import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function GradientView({
  children,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  variant = 'primary',
}) {
  const gradientColors = colors || theme.gradients[variant] || theme.gradients.primary;

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

