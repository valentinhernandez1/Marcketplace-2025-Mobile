import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../context/AppProvider';
import { createPackApi, updatePackApi } from '../shared/api/insumosApi';
import { calculatePackPrice } from '../shared/logic/calculatePackPrice';
import { generateId } from '../shared/utils/generateId';

export default function CreatePackScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;
  const packId = route.params?.packId;
  const packExistente = packId ? state.supplyOffers.find((p) => p.id === packId) : null;
  const isEditing = !!packExistente;

  const [serviceId, setServiceId] = useState(packExistente?.serviceId || '');
  const [items, setItems] = useState(
    packExistente?.items?.map((item) => ({
      ...item,
      cantidad: item.cantidad?.toString() || '1',
      precioUnit: item.precioUnit?.toString() || '0',
    })) || []
  );
  const [total, setTotal] = useState(
    packExistente?.precioTotal || 
    (packExistente?.items ? calculatePackPrice(packExistente.items) : 0)
  );
  const [loading, setLoading] = useState(false);

  // Recalcular total cuando cambian los items
  useEffect(() => {
    const itemsNumericos = items.map((item) => ({
      cantidad: Number(item.cantidad) || 0,
      precioUnit: Number(item.precioUnit) || 0,
    }));
    setTotal(calculatePackPrice(itemsNumericos));
  }, [items]);

  const serviciosConInsumos = state.services.filter(
    (s) => s.insumosRequeridos && s.insumosRequeridos.length > 0
  );
  const misInsumos = state.supplies.filter((s) => s.vendedorId === user.id);
  const servicioSeleccionado = state.services.find((s) => s.id === serviceId);

  const agregarDesdeInsumo = (insumo) => {
    const yaAgregado = items.some((item) => item.insumoId === insumo.id);
    if (yaAgregado) {
      Alert.alert('Error', 'Este insumo ya está en el pack.');
      return;
    }

    if (insumo.stock <= 0) {
      Alert.alert('Error', 'Este insumo no tiene stock disponible.');
      return;
    }

    const nuevoItem = {
      nombre: insumo.nombre,
      cantidad: 1,
      precioUnit: insumo.precioUnit,
      unidad: insumo.unidad,
      insumoId: insumo.id,
      stockDisponible: insumo.stock,
      tipo: 'publicado',
    };

    const nuevosItems = [...items, nuevoItem];
    setItems(nuevosItems);
    setTotal(calculatePackPrice(nuevosItems));
  };

  const eliminar = (index) => {
    const nuevosItems = items.filter((_, i) => i !== index);
    setItems(nuevosItems);
    setTotal(calculatePackPrice(nuevosItems));
  };

  const cambiar = (i, campo, valor) => {
    const copia = [...items];
    const item = copia[i];
    
    if (campo === 'cantidad') {
      const cantidad = Number(valor) || 0;
      const stockDisponible = item.stockDisponible || 999;
      if (cantidad > stockDisponible) {
        Alert.alert('Error', `No hay suficiente stock. Disponible: ${stockDisponible}`);
        return;
      }
      item.cantidad = cantidad;
    } else if (campo === 'precioUnit') {
      const precio = Number(valor) || 0;
      if (precio < 0) {
        Alert.alert('Error', 'El precio no puede ser negativo.');
        return;
      }
      item.precioUnit = precio;
    } else {
      item[campo] = valor;
    }
    
    setItems(copia);
    setTotal(calculatePackPrice(copia));
  };

  const handleSubmit = async () => {
    if (!serviceId) {
      Alert.alert('Error', 'Debés seleccionar un servicio.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Debés agregar al menos un insumo al pack.');
      return;
    }

    // Validar que todos los items tengan datos válidos
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.nombre || item.nombre.trim().length === 0) {
        Alert.alert('Error', `El insumo #${i + 1} debe tener un nombre.`);
        return;
      }
      if (!item.cantidad || item.cantidad <= 0) {
        Alert.alert('Error', `El insumo #${i + 1} debe tener una cantidad mayor a 0.`);
        return;
      }
      if (!item.precioUnit || item.precioUnit <= 0) {
        Alert.alert('Error', `El insumo #${i + 1} debe tener un precio mayor a 0.`);
        return;
      }
      // Validar stock si es un insumo publicado
      if (item.insumoId && item.stockDisponible !== undefined) {
        if (item.cantidad > item.stockDisponible) {
          Alert.alert('Error', `No hay suficiente stock de "${item.nombre}". Disponible: ${item.stockDisponible}`);
          return;
        }
      }
    }

    if (total <= 0) {
      Alert.alert('Error', 'El precio total debe ser mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Editar pack existente
        const pack = {
          serviceId,
          items: items.map((item) => ({
            nombre: item.nombre.trim(),
            cantidad: Number(item.cantidad),
            precioUnit: Number(item.precioUnit),
          })),
          precioTotal: total,
        };

        const actualizado = await updatePackApi(packId, pack);
        dispatch({ type: 'UPDATE_SUPPLY_OFFER', payload: { id: packId, ...actualizado } });

        Alert.alert('Éxito', 'Pack actualizado exitosamente', [
          { text: 'OK', onPress: () => navigation.navigate('Supplies') },
        ]);
      } else {
        // Crear nuevo pack
        const pack = {
          id: generateId(),
          vendedorId: user.id,
          serviceId,
          items: items.map((item) => ({
            nombre: item.nombre.trim(),
            cantidad: Number(item.cantidad),
            precioUnit: Number(item.precioUnit),
          })),
          precioTotal: total,
          createdAt: new Date().toISOString(),
        };

        const nuevo = await createPackApi(pack);
        dispatch({ type: 'ADD_SUPPLY_OFFER', payload: nuevo });

        Alert.alert('Éxito', 'Pack de insumos creado exitosamente', [
          { text: 'OK', onPress: () => navigation.navigate('Supplies') },
        ]);
      }
    } catch (_error) {
      Alert.alert('Error', isEditing ? 'No se pudo actualizar el pack' : 'No se pudo crear el pack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>🏠 Inicio</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Pack' : 'Crear Pack'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Seleccionar servicio *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {serviciosConInsumos.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.serviceButton,
                serviceId === s.id && styles.serviceButtonActive,
              ]}
              onPress={() => setServiceId(s.id)}
            >
              <Text
                style={[
                  styles.serviceText,
                  serviceId === s.id && styles.serviceTextActive,
                ]}
              >
                {s.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {servicioSeleccionado?.insumosRequeridos && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Insumos requeridos:</Text>
            {servicioSeleccionado.insumosRequeridos.map((req, idx) => (
              <Text key={idx} style={styles.infoText}>
                • {req.nombre} — {req.cantidad}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.label}>Agregar desde mis insumos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {misInsumos.map((insumo) => {
            const yaAgregado = items.some((item) => item.insumoId === insumo.id);
            return (
              <TouchableOpacity
                key={insumo.id}
                style={[
                  styles.insumoButton,
                  yaAgregado && styles.insumoButtonDisabled,
                ]}
                onPress={() => !yaAgregado && agregarDesdeInsumo(insumo)}
                disabled={yaAgregado}
              >
                <Text style={styles.insumoName}>{insumo.nombre}</Text>
                <Text style={styles.insumoPrice}>${insumo.precioUnit}</Text>
                {yaAgregado && <Text style={styles.addedText}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Insumos del pack ({items.length})</Text>
        {items.map((item, i) => (
          <View key={i} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNumber}>#{i + 1}</Text>
              <TouchableOpacity onPress={() => eliminar(i)}>
                <Text style={styles.deleteButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={item.nombre}
              onChangeText={(text) => cambiar(i, 'nombre', text)}
            />
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cantidad</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={String(item.cantidad || '')}
                  onChangeText={(text) => cambiar(i, 'cantidad', text)}
                />
                {item.stockDisponible !== undefined && (
                  <Text style={styles.stockHint}>
                    Stock: {item.stockDisponible}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Precio unit.</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={String(item.precioUnit || '')}
                  onChangeText={(text) => cambiar(i, 'precioUnit', text)}
                />
              </View>
            </View>
            <Text style={styles.itemTotal}>
              Subtotal: ${((item.cantidad || 0) * (item.precioUnit || 0)).toLocaleString()}
            </Text>
          </View>
        ))}

        {total > 0 && (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Precio total</Text>
            <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || items.length === 0 || !serviceId}
        >
          <Text style={styles.buttonText}>
            {loading
              ? isEditing
                ? 'Actualizando...'
                : 'Creando...'
              : isEditing
                ? '💾 Guardar cambios'
                : '✅ Crear pack'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  serviceButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  serviceButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  serviceText: {
    fontSize: 14,
    color: '#666',
  },
  serviceTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  insumoButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  insumoButtonDisabled: {
    opacity: 0.5,
    borderColor: '#28a745',
  },
  insumoName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  insumoPrice: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  addedText: {
    color: '#28a745',
    fontWeight: 'bold',
  marginTop: 4,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemNumber: {
    fontWeight: '600',
    color: '#007bff',
  },
  deleteButton: {
    color: '#dc3545',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  inputSmall: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  stockHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    marginTop: 4,
  },
  totalBox: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


