import * as SecureStore from 'expo-secure-store';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../context/AppProvider';
import Button from '../shared/components/Button';
import Card from '../shared/components/Card';
import GradientView from '../shared/components/GradientView';
import { theme } from '../shared/styles/theme';

export default function HomeScreen({ navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('user');
    dispatch({ type: 'LOGOUT' });
  };

  const getRoleName = (rol) => {
    const roles = {
      SOLICITANTE: 'Solicitante',
      PROVEEDOR_SERVICIO: 'Proveedor de Servicios',
      PROVEEDOR_INSUMOS: 'Proveedor de Insumos',
    };
    return roles[rol] || rol;
  };

  return (
    <View style={styles.container}>
      <GradientView variant="primary" style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.welcome}>¡Hola, {user?.nombre}!</Text>
            <Text style={styles.role}>{getRoleName(user?.rol)}</Text>
          </View>
        </View>
      </GradientView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {user?.rol === 'SOLICITANTE' && (
            <>
              <Card 
                onPress={() => navigation.navigate('Services')}
                variant="primary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Text style={styles.cardIcon}>📋</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Mis Servicios</Text>
                    <Text style={styles.cardSubtitle}>Gestioná tus servicios publicados</Text>
                  </View>
                </View>
              </Card>

              <Card 
                onPress={() => navigation.navigate('CreateService')}
                variant="secondary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.secondaryLight }]}>
                    <Text style={styles.cardIcon}>➕</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Publicar Servicio</Text>
                    <Text style={styles.cardSubtitle}>Crear un nuevo servicio</Text>
                  </View>
                </View>
              </Card>
            </>
          )}

          {user?.rol === 'PROVEEDOR_SERVICIO' && (
            <>
              <Card 
                onPress={() => navigation.navigate('AvailableServices')}
                variant="primary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Text style={styles.cardIcon}>🔍</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Servicios Disponibles</Text>
                    <Text style={styles.cardSubtitle}>Ver servicios para cotizar</Text>
                  </View>
                </View>
              </Card>

              <Card 
                onPress={() => navigation.navigate('Quotes')}
                variant="secondary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.secondaryLight }]}>
                    <Text style={styles.cardIcon}>💰</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Mis Cotizaciones</Text>
                    <Text style={styles.cardSubtitle}>Ver tus cotizaciones enviadas</Text>
                  </View>
                </View>
              </Card>
            </>
          )}

          {user?.rol === 'PROVEEDOR_INSUMOS' && (
            <>
              <Card 
                onPress={() => navigation.navigate('Supplies')}
                variant="primary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Text style={styles.cardIcon}>📦</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Mis Insumos</Text>
                    <Text style={styles.cardSubtitle}>Gestioná tus insumos</Text>
                  </View>
                </View>
              </Card>

              <Card 
                onPress={() => navigation.navigate('CreateSupply')}
                variant="secondary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.secondaryLight }]}>
                    <Text style={styles.cardIcon}>➕</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Publicar Insumo</Text>
                    <Text style={styles.cardSubtitle}>Agregar nuevo insumo</Text>
                  </View>
                </View>
              </Card>

              <Card 
                onPress={() => navigation.navigate('CreatePack')}
                variant="primary"
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Text style={styles.cardIcon}>📋</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Crear Pack</Text>
                    <Text style={styles.cardSubtitle}>Crear pack de insumos</Text>
                  </View>
                </View>
              </Card>
            </>
          )}

          <Button
            title="Cerrar sesión"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: 'column',
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  welcome: {
    ...theme.typography.h2,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  role: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.95,
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  content: {
    padding: theme.spacing.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  cardSubtitle: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    fontSize: 13,
  },
  logoutButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
});


