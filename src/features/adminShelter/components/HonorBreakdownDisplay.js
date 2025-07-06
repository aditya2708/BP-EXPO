import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getBreakdownStructure, 
  getPaymentSystemName, 
  formatBreakdownComponent 
} from '../utils/paymentSystemUtils';

const HonorBreakdownDisplay = ({ 
  breakdown, 
  paymentSystem, 
  showTitle = true,
  compact = false 
}) => {
  if (!breakdown || !paymentSystem) {
    return null;
  }

  const expectedComponents = getBreakdownStructure(paymentSystem);
  const components = breakdown.components || {};

  const getComponentIcon = (componentKey) => {
    const icons = {
      cpb: 'people',
      pb: 'people',
      npb: 'people',
      session: 'calendar',
      hour: 'time',
      base: 'card',
      monthly: 'calendar',
      student: 'people'
    };
    return icons[componentKey] || 'calculator';
  };

  const getComponentColor = (componentKey) => {
    const colors = {
      cpb: '#e74c3c',
      pb: '#f39c12', 
      npb: '#2ecc71',
      session: '#3498db',
      hour: '#9b59b6',
      base: '#34495e',
      monthly: '#27ae60',
      student: '#3498db'
    };
    return colors[componentKey] || '#666';
  };

  const renderComponent = (componentKey) => {
    const component = components[componentKey];
    if (!component) return null;

    const formattedComponent = formatBreakdownComponent(component, componentKey);
    const icon = getComponentIcon(componentKey);
    const color = getComponentColor(componentKey);

    if (compact) {
      return (
        <View key={componentKey} style={styles.compactItem}>
          <Ionicons name={icon} size={16} color={color} />
          <Text style={styles.compactText}>
            {formattedComponent.formatted_amount}
          </Text>
        </View>
      );
    }

    return (
      <View key={componentKey} style={styles.componentItem}>
        <View style={styles.componentHeader}>
          <View style={styles.componentIcon}>
            <Ionicons name={icon} size={18} color={color} />
          </View>
          <View style={styles.componentContent}>
            <Text style={styles.componentLabel}>
              {getComponentLabel(componentKey)}
            </Text>
            <Text style={styles.componentDescription}>
              {formattedComponent.formatted_description}
            </Text>
          </View>
          <Text style={[styles.componentAmount, { color }]}>
            {formattedComponent.formatted_amount}
          </Text>
        </View>
      </View>
    );
  };

  const getComponentLabel = (componentKey) => {
    const labels = {
      cpb: 'Siswa CPB',
      pb: 'Siswa PB', 
      npb: 'Siswa NPB',
      session: 'Honor Sesi',
      hour: 'Honor Jam',
      base: 'Honor Dasar',
      monthly: 'Honor Bulanan',
      student: 'Honor Siswa'
    };
    return labels[componentKey] || componentKey.toUpperCase();
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {expectedComponents.map(renderComponent)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={styles.title}>Rincian Honor</Text>
          <Text style={styles.subtitle}>
            {getPaymentSystemName(paymentSystem)}
          </Text>
        </View>
      )}

      <View style={styles.componentsContainer}>
        {expectedComponents.map(renderComponent)}
      </View>

      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Honor</Text>
          <Text style={styles.totalAmount}>
            {breakdown.formatted_total || `Rp ${Number(breakdown.total_amount || 0).toLocaleString('id-ID')}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500'
  },
  componentsContainer: {
    gap: 12
  },
  componentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db'
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  componentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  componentContent: {
    flex: 1
  },
  componentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  componentDescription: {
    fontSize: 12,
    color: '#666'
  },
  componentAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71'
  },
  compactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  compactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  compactText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  }
});

export default HonorBreakdownDisplay;