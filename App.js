import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { AppContext, AppProvider } from './src/context/AppProvider';
import AvailableServicesScreen from './src/screens/AvailableServicesScreen';
import CompareScreen from './src/screens/CompareScreen';
import CreatePackScreen from './src/screens/CreatePackScreen';
import CreateQuoteScreen from './src/screens/CreateQuoteScreen';
import CreateServiceScreen from './src/screens/CreateServiceScreen';
import CreateSupplyScreen from './src/screens/CreateSupplyScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PackDetailScreen from './src/screens/PackDetailScreen';
import QuotesScreen from './src/screens/QuotesScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import SuppliesScreen from './src/screens/SuppliesScreen';
import SupplyDetailScreen from './src/screens/SupplyDetailScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { state } = useContext(AppContext);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
            <Stack.Screen name="CreateService" component={CreateServiceScreen} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <Stack.Screen name="AvailableServices" component={AvailableServicesScreen} />
            <Stack.Screen name="Quotes" component={QuotesScreen} />
            <Stack.Screen name="CreateQuote" component={CreateQuoteScreen} />
            <Stack.Screen name="Supplies" component={SuppliesScreen} />
            <Stack.Screen name="CreateSupply" component={CreateSupplyScreen} />
            <Stack.Screen name="SupplyDetail" component={SupplyDetailScreen} />
            <Stack.Screen name="CreatePack" component={CreatePackScreen} />
            <Stack.Screen name="PackDetail" component={PackDetailScreen} />
            <Stack.Screen name="Compare" component={CompareScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

