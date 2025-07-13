
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MasterDataCard = ({
  title,
  count = 0,
  icon,
  color = '#3498db',
  description,
  onPress,
  onAddPress,
  loading = false,
  showQuickAdd = true,
  customAction
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, loading && styles.cardDisabled]} 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon} size={28} color="#fff" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.count}>
              {loading ? '...' : count.toLocaleString()} data
            </Text>
          </View>
        </View>

        {description && (
          <Text style={styles.description}>{description}</Text>
        )}

        <View style={styles.footer}>
          <View style={styles.actionContainer}>
            {customAction ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.customAction]}
                onPress={customAction.onPress}
              >
                <Ionicons name={customAction.icon} size={16} color={color} />
                <Text style={[styles.actionText, { color }]}>
                  {customAction.title}
                </Text>
              </TouchableOpacity>
            ) : showQuickAdd && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.addAction]}
                onPress={onAddPress}
              >
                <Ionicons name="add-circle" size={16} color={color} />
                <Text style={[styles.actionText, { color }]}>
                  Tambah
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#adb5bd" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  count: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addAction: {
    // Default styling for add action
  },
  customAction: {
    // Custom action styling
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chevronContainer: {
    padding: 4,
  },
});

export default MasterDataCard;