import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropdownSelector from './DropdownSelector';

const CascadeDropdown = ({
  cascadeData,
  parentKey = 'jenjang',
  childKey = 'kelas',
  parentValue,
  childValue,
  onParentChange,
  onChildChange,
  parentLabel = 'Jenjang',
  childLabel = 'Kelas',
  parentPlaceholder = 'Pilih jenjang',
  childPlaceholder = 'Pilih kelas',
  parentDisplayKey = 'nama_jenjang',
  childDisplayKey = 'nama_kelas',
  parentValueKey = 'id_jenjang',
  childValueKey = 'id_kelas',
  error,
  disabled = false,
  required = false
}) => {
  const [childOptions, setChildOptions] = useState([]);
  const [childLoading, setChildLoading] = useState(false);

  const parentOptions = cascadeData?.[parentKey] || [];

  useEffect(() => {
    if (parentValue && cascadeData?.[`${childKey}_by_${parentKey}`]) {
      setChildLoading(true);
      
      const childData = cascadeData[`${childKey}_by_${parentKey}`][parentValue] || [];
      setChildOptions(childData);
      
      // Reset child value if current selection is not valid
      if (childValue && !childData.find(item => item[childValueKey] === childValue)) {
        onChildChange?.(null);
      }
      
      setChildLoading(false);
    } else {
      setChildOptions([]);
      if (childValue) {
        onChildChange?.(null);
      }
    }
  }, [parentValue, cascadeData, childKey, parentKey, childValueKey, childValue, onChildChange]);

  const handleParentChange = (value) => {
    onParentChange?.(value);
    // Child will be reset by useEffect
  };

  const getDisplayValue = (item, displayKey) => {
    if (typeof displayKey === 'function') {
      return displayKey(item);
    }
    return item[displayKey] || '';
  };

  return (
    <View style={styles.container}>
      <DropdownSelector
        label={parentLabel}
        value={parentValue}
        onSelect={handleParentChange}
        options={[
          { label: `Semua ${parentLabel}`, value: '' },
          ...parentOptions.map(item => ({
            label: getDisplayValue(item, parentDisplayKey),
            value: item[parentValueKey]
          }))
        ]}
        placeholder={parentPlaceholder}
        error={error?.parent}
        disabled={disabled}
        required={required}
      />

      {childLabel && (
        <DropdownSelector
          label={childLabel}
          value={childValue}
          onSelect={onChildChange}
          options={childOptions.map(item => ({
            label: getDisplayValue(item, childDisplayKey),
            value: item[childValueKey]
          }))}
          placeholder={childPlaceholder}
          error={error?.child}
          disabled={disabled || !parentValue || childLoading}
          loading={childLoading}
          required={required}
          style={styles.childDropdown}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16
  },
  childDropdown: {
    marginTop: 0
  }
});

export default CascadeDropdown;