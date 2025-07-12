import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FormToggle = ({
  label,
  value,
  onToggle,
  disabled = false,
  error,
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={[styles.label, disabled && styles.disabled]}>
          {label}
        </Text>
        <TouchableOpacity
          style={[
            styles.toggle,
            value && styles.toggleActive,
            disabled && styles.toggleDisabled,
          ]}
          onPress={disabled ? null : () => onToggle(!value)}
          disabled={disabled}
        >
          <View
            style={[
              styles.thumb,
              value && styles.thumbActive,
            ]}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  disabled: {
    color: '#bdc3c7',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#3498db',
  },
  toggleDisabled: {
    backgroundColor: '#f8f9fa',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 4,
  },
});

export default FormToggle;