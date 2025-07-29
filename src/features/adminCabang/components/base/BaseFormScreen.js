import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';

const BaseFormScreen = ({
  children,
  loading = false,
  error = null,
  onRetry,
  style,
  contentContainerStyle,
  scrollEnabled = true
}) => {
  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <LoadingSpinner fullScreen message="Memuat form..." />
      </View>
    );
  }

  const ContentWrapper = scrollEnabled ? ScrollView : View;
  const contentProps = scrollEnabled ? {
    contentContainerStyle: [styles.scrollContent, contentContainerStyle],
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled'
  } : {
    style: [styles.content, contentContainerStyle]
  };

  return (
    <SafeAreaView style={[styles.container, style]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={onRetry}
            style={styles.errorMessage}
          />
        )}
        
        <ContentWrapper {...contentProps}>
          {children}
        </ContentWrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16
  },
  content: {
    flex: 1,
    padding: 16
  },
  errorMessage: {
    marginHorizontal: 16,
    marginTop: 8
  }
});

export default BaseFormScreen;