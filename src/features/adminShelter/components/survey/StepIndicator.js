// file: src/features/adminShelter/components/survey/StepIndicator.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StepIndicator = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <View style={styles.stepIndicatorContainer}>
      {steps.map((step, index) => (
        <TouchableOpacity
          key={step.id}
          style={[
            styles.stepIndicator,
            currentStep === index && styles.currentStepIndicator,
            currentStep > index && styles.completedStepIndicator
          ]}
          onPress={() => currentStep > index && setCurrentStep(index)}
          disabled={currentStep <= index}
        >
          {currentStep > index ? (
            <Ionicons name="checkmark" size={16} color="#fff" />
          ) : (
            <Text style={[
              styles.stepIndicatorText,
              currentStep === index && styles.currentStepIndicatorText
            ]}>{index + 1}</Text>
          )}
        </TouchableOpacity>
      ))}
      <View style={styles.stepConnector} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 24,
    marginTop: 8,
  },
  stepConnector: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: 2,
    backgroundColor: '#dddddd',
    zIndex: -1,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dddddd',
    zIndex: 1,
  },
  currentStepIndicator: {
    backgroundColor: '#ffffff',
    borderColor: '#e74c3c',
  },
  completedStepIndicator: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  stepIndicatorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777777',
  },
  currentStepIndicatorText: {
    color: '#e74c3c',
  },
});

export default StepIndicator;