import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Header({
  title,
  leftAction,
  rightAction,
  variant = 'primary',
  gradient = true,
}) {
  const HeaderContent = (
    <>
      <View style={styles.left}>
        {leftAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={leftAction.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>{leftAction.icon || '←'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={[styles.title, styles[`title_${variant}`]]}>{title}</Text>
      </View>
      <View style={styles.right}>
        {rightAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>{rightAction.icon || '+'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  if (gradient && variant === 'primary') {
    return (
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, styles[`header_${variant}`]]}
      >
        {HeaderContent}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.header, styles[`header_${variant}`]]}>
      {HeaderContent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header_primary: {
    backgroundColor: theme.colors.primary,
  },
  header_secondary: {
    backgroundColor: theme.colors.secondary,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.white,
  },
  title_primary: {
    color: theme.colors.white,
  },
  title_secondary: {
    color: theme.colors.white,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  actionText: {
    fontSize: 20,
    color: theme.colors.white,
  },
});

