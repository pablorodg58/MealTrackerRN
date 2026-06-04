import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fontSize } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.divider,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Restaurants',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size + 2} color={color} />
          ),
          tabBarAccessibilityLabel: 'Navigate to restaurants list',
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'My Meals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size + 2} color={color} />
          ),
          tabBarAccessibilityLabel: 'Navigate to your meals list',
        }}
      />
    </Tabs>
  );
}
