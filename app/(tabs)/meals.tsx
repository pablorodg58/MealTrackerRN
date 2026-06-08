import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fontSize, spacing } from '../../src/theme';
import { getCurrentUserId, getMealsByUser, clearSession } from '../../src/utils/storage';
import { getRestaurantById } from '../../src/utils/seedData';
import { Meal } from '../../src/types';
import AppModal from '../../src/components/AppModal';

export default function MealListScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);

  const [modal, setModal] = useState<{
    visible: boolean; title: string; message: string;
  }>({ visible: false, title: '', message: '' });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const userId = await getCurrentUserId();
        if (!userId) { router.replace('/login'); return; }
        const data = await getMealsByUser(userId);
        setMeals(data);
      })();
    }, [])
  );

  const handleLogout = () => {
    setModal({
      visible: true,
      title: 'Do you want to logout?',
      message: "Are you sure you want to log out? Tap 'Confirm' to end your session or 'Cancel' to stay logged in.",
    });
  };

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>List of Meals</Text>
        <TouchableOpacity onPress={handleLogout} accessibilityLabel="Logout from account" style={s.logoutBtn}>
          <Ionicons name="log-out-outline" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {meals.length === 0 ? (
        <View style={s.emptyContainer}>
          <Text style={s.emptyText}>
            No meals recorded yet.{'\n'}Visit a restaurant to add your first meal!
          </Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => {
            const restaurant = getRestaurantById(item.restaurantId);
            return (
              <TouchableOpacity
                style={s.card}
                onPress={() => router.push(`/meal/${item.id}`)}
              >
                <Text style={s.cardName}>{restaurant?.name ?? 'Unknown Restaurant'}</Text>
                <Text style={s.cardDate}>{item.date}</Text>
                <Text style={s.cardScore}>Average Score: ⭐ {item.averageScore.toFixed(1)}</Text>
                <View style={s.divider} />
              </TouchableOpacity>
            );
          }}
        />
      )}

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        buttons={[
          {
            text: 'Cancel',
            variant: 'cancel',
            onPress: () => setModal((m) => ({ ...m, visible: false })),
          },
          {
            text: 'Confirm',
            variant: 'primary',
            onPress: async () => {
              setModal((m) => ({ ...m, visible: false }));
              await clearSession();
              router.replace('/login');
            },
          },
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: theme.background },
  header:         { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingTop: 52 },
  title:          { flex: 1, fontSize: fontSize.title, color: theme.primary, fontWeight: 'bold' },
  logoutBtn:      { padding: spacing.xs },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText:      { fontSize: fontSize.body, color: theme.textSecondary, textAlign: 'center', lineHeight: 24 },
  card:           { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  cardName:       { fontSize: fontSize.heading, color: theme.primary, fontWeight: 'bold' },
  cardDate:       { fontSize: fontSize.body, color: theme.textSecondary, marginTop: 4 },
  cardScore:      { fontSize: fontSize.body, color: theme.primary, fontWeight: '600', marginTop: 4 },
  divider:        { height: 1, backgroundColor: theme.divider, marginTop: spacing.md },
});
