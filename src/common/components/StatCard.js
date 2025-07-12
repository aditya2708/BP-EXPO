
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatCard = ({ 
  label, 
  value, 
  icon, 
  color = '#3498db', 
  onPress, 
  disabled = false,
  suffix = '',
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const cardStyle = size === 'small' ? styles.smallCard : 
                   size === 'large' ? styles.largeCard : styles.card;
  const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
  
  const CardComponent = onPress && !disabled ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[cardStyle, disabled && styles.disabled]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={iconSize} color="#fff" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.value}>
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </Text>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </View>
      
      {onPress && !disabled && (
        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={16} color="#adb5bd" />
        </View>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: '48%',
    flex: 1,
  },
  smallCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    minWidth: '45%',
  },
  largeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 8,
  },
});

export default StatCard;