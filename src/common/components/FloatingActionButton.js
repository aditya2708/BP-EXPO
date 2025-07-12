
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FloatingActionButton = ({
  icon = 'add',
  onPress,
  color = '#2ecc71',
  size = 56,
  iconSize = 28,
  style = {},
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { 
          backgroundColor: disabled ? '#bdc3c7' : color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style
      ]}
      onPress={disabled ? null : onPress}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      <Ionicons name={icon} size={iconSize} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FloatingActionButton;