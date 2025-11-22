import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import Button from './Button';

export default function EmptyState({
  icon = '📭',
  title,
  message,
  buttonTitle,
  onButtonPress,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      {title && <Text style={styles.title}>{title}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    minHeight: 200,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});

