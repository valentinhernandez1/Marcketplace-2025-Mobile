import * as SecureStore from 'expo-secure-store';
import React, { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { loginApi } from '../shared/api/authApi';
import Button from '../shared/components/Button';
import Card from '../shared/components/Card';
import Input from '../shared/components/Input';
import { theme } from '../shared/styles/theme';

export default function LoginScreen({ navigation }) {
  const { dispatch } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresá un email válido.');
      return;
    }

    if (!password || password.length < 3) {
      Alert.alert('Error', 'La contraseña debe tener al menos 3 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const user = await loginApi(email.trim(), password);
      
      dispatch({ type: 'LOGIN', payload: user });
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      // Navegar según rol
      if (user.rol === 'SOLICITANTE') {
        navigation.replace('Services');
      } else if (user.rol === 'PROVEEDOR_SERVICIO') {
        navigation.replace('Quotes');
      } else if (user.rol === 'PROVEEDOR_INSUMOS') {
        navigation.replace('Supplies');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🛒</Text>
          </View>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
        </View>

        <Card style={styles.form}>
          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Button
            title={loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            onPress={handleLogin}
            disabled={loading}
            fullWidth
            style={styles.button}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>👤 Usuarios de prueba:</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Solicitante:</Text>
              <Text style={styles.infoText}>solicitante@mail.com / 123</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Proveedor Servicio:</Text>
              <Text style={styles.infoText}>servicio@mail.com / 123</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Proveedor Insumos:</Text>
              <Text style={styles.infoText}>insumos@mail.com / 123</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  form: {
    padding: theme.spacing.xl,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
  infoBox: {
    backgroundColor: theme.colors.background.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  infoTitle: {
    ...theme.typography.h4,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  infoItem: {
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    ...theme.typography.small,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 13,
  },
});


