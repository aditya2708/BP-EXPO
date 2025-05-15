import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Custom TextInput Component
 * A reusable text input component with various features
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Input label
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChangeText] - Text change handler
 * @param {string} [props.placeholder] - Input placeholder
 * @param {boolean} [props.secureTextEntry=false] - Whether input is for password
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.helperText] - Helper text to display
 * @param {Object} [props.style] - Additional styles for the input container
 * @param {Object} [props.inputStyle] - Additional styles for the input field
 * @param {Object} [props.labelStyle] - Additional styles for the label
 * @param {string} [props.mode='outlined'] - Input mode (outlined, flat, underlined)
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {ReactNode} [props.rightIcon] - Icon to display on the right
 * @param {boolean} [props.multiline=false] - Whether input is multiline
 * @param {Object} [props.inputProps] - Additional props for the TextInput component
 */
const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  helperText,
  style,
  inputStyle,
  labelStyle,
  mode = 'outlined',
  disabled = false,
  leftIcon,
  rightIcon,
  multiline = false,
  inputProps = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine container style based on mode and state
  const containerStyle = [
    styles.container,
    styles[mode],
    isFocused && styles[`${mode}Focused`],
    error && styles.error,
    disabled && styles.disabled,
    style
  ];

  // Handle secure text entry toggle
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine actual secure text entry value
  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.inputContainer}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, error && styles.errorLabel, labelStyle]}>
          {label}
        </Text>
      )}

      {/* Input Field */}
      <View style={containerStyle}>
        {/* Left Icon */}
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        {/* Text Input */}
        <RNTextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={actualSecureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          placeholderTextColor="#9e9e9e"
          {...inputProps}
        />

        {/* Password visibility toggle for secure text entry */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#757575"
            />
          </TouchableOpacity>
        )}

        {/* Right Icon (if not secure text entry) */}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {/* Helper Text or Error Message */}
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    backgroundColor: 'white',
  },
  // Input mode styles
  outlined: {
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  outlinedFocused: {
    borderColor: '#3498db',
    borderWidth: 2,
  },
  flat: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  flatFocused: {
    backgroundColor: '#e3f2fd',
  },
  underlined: {
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
    borderRadius: 0,
  },
  underlinedFocused: {
    borderBottomColor: '#3498db',
    borderBottomWidth: 2,
  },
  // Input styles
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#212121',
  },
  inputWithLeftIcon: {
    paddingLeft: 4,
  },
  inputWithRightIcon: {
    paddingRight: 4,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  // Label styles
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: '#616161',
  },
  // Icon container styles
  leftIconContainer: {
    paddingLeft: 12,
  },
  rightIconContainer: {
    paddingRight: 12,
  },
  // Helper and error text styles
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  errorText: {
    color: '#e53935',
  },
  errorLabel: {
    color: '#e53935',
  },
  // State styles
  error: {
    borderColor: '#e53935',
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
});

export default TextInput;