import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="add-meal/[id]" />
      <Stack.Screen name="meal/[id]" />
    </Stack>
  );
}
