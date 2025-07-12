
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeAreaWrapper = ({ 
  children, 
  style, 
  edges = ['top', 'bottom'], 
  backgroundColor = '#fff',
  paddingHorizontal = 0 
}) => {
  const insets = useSafeAreaInsets();
  
  const dynamicStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left + paddingHorizontal : paddingHorizontal,
    paddingRight: edges.includes('right') ? insets.right + paddingHorizontal : paddingHorizontal,
  };

  return (
    <View style={[dynamicStyle, style]}>
      {children}
    </View>
  );
};

export default SafeAreaWrapper;