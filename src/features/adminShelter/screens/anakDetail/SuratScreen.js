import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const SuratScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { childId, childName } = route.params;

  useEffect(() => {
    // Navigate directly to SuratList screen
    navigation.replace('SuratList', { childId, childName });
  }, [navigation, childId, childName]);

  return null;
};

export default SuratScreen;