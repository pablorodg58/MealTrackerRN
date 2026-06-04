import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getCurrentUserId } from '../src/utils/storage';
import { theme } from '../src/theme';

export default function Index() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  if (userId === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  return userId ? <Redirect href="/(tabs)/" /> : <Redirect href="/login" />;
}
