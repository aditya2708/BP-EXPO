import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';
import ErrorMessage from '../../../../common/components/ErrorMessage';
import EmptyState from '../../../../common/components/EmptyState';

const BaseListScreen = ({
  data = [],
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
  onRetry,
  onLoadMore,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
  emptyStateProps = {},
  style,
  contentContainerStyle
}) => {
  const defaultEmptyStateProps = {
    icon: 'folder-open-outline',
    title: 'Tidak ada data',
    message: 'Data belum tersedia saat ini',
    ...emptyStateProps
  };

  if (loading && !refreshing && data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <LoadingSpinner fullScreen message="Memuat data..." />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <ErrorMessage 
          message={error} 
          onRetry={onRetry || onRefresh}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007bff']}
              tintColor="#007bff"
            />
          ) : undefined
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={
          !loading ? (
            <EmptyState 
              {...defaultEmptyStateProps}
              onRetry={onRetry || onRefresh}
            />
          ) : null
        }
        contentContainerStyle={[
          styles.contentContainer,
          contentContainerStyle,
          data.length === 0 && !loading && { flex: 1 }
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    paddingVertical: 8
  }
});

export default BaseListScreen;