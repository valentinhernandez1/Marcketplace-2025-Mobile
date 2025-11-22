import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function DatePickerComponent({ value, onChange, placeholder = 'Seleccionar fecha' }) {
  const [showPicker, setShowPicker] = useState(false);
  
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    // Si viene en formato YYYY-MM-DD
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    // Si viene como otra cosa, intentar parsear
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const [selectedDate, setSelectedDate] = useState(value ? parseDate(value) : new Date());

  // Actualizar selectedDate cuando cambie el value externo
  useEffect(() => {
    if (value) {
      setSelectedDate(parseDate(value));
    }
  }, [value]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Si viene en formato YYYY-MM-DD, parsearlo
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    // Si viene como Date object
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'dismissed') {
        return; // Usuario canceló
      }
    }
    
    if (date) {
      setSelectedDate(date);
      // Formatear como YYYY-MM-DD para guardar (formato estándar)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      onChange(formatted);
    }
  };

  const displayValue = value ? formatDate(value) : '';

  return (
    <View>
      <TouchableOpacity
        style={[styles.dateButton, !value && styles.dateButtonEmpty]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.dateButtonText, !value && styles.dateButtonTextEmpty]}>
          {displayValue || placeholder}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {showPicker && (
        <>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.iosPickerButton}
                >
                  <Text style={styles.iosPickerButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleDateChange(null, selectedDate);
                    setShowPicker(false);
                  }}
                  style={styles.iosPickerButton}
                >
                  <Text style={[styles.iosPickerButtonText, styles.iosPickerButtonTextConfirm]}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setSelectedDate(date);
                }}
                minimumDate={new Date()}
                locale="es-ES"
              />
            </View>
          )}

          {Platform.OS === 'android' && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
              locale="es-ES"
            />
          )}
        </>
      )}

      {value && (
        <Text style={styles.datePreview}>
          Fecha seleccionada: {formatDate(value)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  dateButtonEmpty: {
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    fontWeight: '500',
  },
  dateButtonTextEmpty: {
    color: '#999',
  },
  calendarIcon: {
    fontSize: 20,
  },
  datePreview: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#e7f3ff',
    borderRadius: 6,
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  iosPickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iosPickerButton: {
    padding: 8,
  },
  iosPickerButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  iosPickerButtonTextConfirm: {
    fontWeight: '600',
  },
});

