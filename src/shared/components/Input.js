import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  error,
  style,
  inputStyle,
  editable = true,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.inputMultiline,
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray[500]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        color={theme.colors.text.primary}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.small,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1.5,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    minHeight: 50,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
});

