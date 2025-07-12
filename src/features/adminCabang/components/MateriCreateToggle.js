import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const MateriCreateToggle = ({ 
  value, 
  onValueChange, 
  disabled = false,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.toggleRow}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, disabled && styles.labelDisabled]}>
            Buat materi baru
          </Text>
          <Text style={[styles.helpText, disabled && styles.helpTextDisabled]}>
            {value ? 'Mode: Buat materi baru' : 'Mode: Pilih materi existing'}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ 
            false: '#e9ecef', 
            true: '#007bff' 
          }}
          thumbColor={value ? '#fff' : '#adb5bd'}
          ios_backgroundColor="#e9ecef"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  labelContainer: {
    flex: 1,
    marginRight: 12
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 2
  },
  labelDisabled: {
    color: '#adb5bd'
  },
  helpText: {
    fontSize: 12,
    color: '#6c757d'
  },
  helpTextDisabled: {
    color: '#adb5bd'
  }
});

export default MateriCreateToggle;