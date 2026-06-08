import { useState, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fontSize, spacing } from '../../src/theme';
import { getRestaurantById } from '../../src/utils/seedData';
import { getCurrentUserId, getMealsByRestaurant, getUsers } from '../../src/utils/storage';
import { Meal, User } from '../../src/types';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const restaurant = getRestaurantById(id ?? '');
  const [lastMeals, setLastMeals] = useState<Meal[]>([]);
  const [usersMap, setUsersMap]   = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!id) return;
        const [meals, users] = await Promise.all([
          getMealsByRestaurant(id),
          getUsers(),
        ]);
        const map: Record<string, string> = {};
        users.forEach((u: User) => { map[u.id] = u.username; });
        setUsersMap(map);
        setLastMeals(meals);
      })();
    }, [id])
  );

  if (!restaurant) {
    return (
      <View style={s.screen}>
        <Text style={s.errorText}>Restaurant not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={s.heroImage}
        accessibilityLabel={`${restaurant.name} restaurant photo`}
      />

      <TouchableOpacity style={s.backOverlay} onPress={() => router.back()}
>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <View style={s.body}>
        <Text style={s.name}>{restaurant.name}</Text>
        <Text style={s.location}>📍 {restaurant.location}</Text>
        <Text style={s.description}>{restaurant.description}</Text>

        <Text style={s.sectionTitle}>Menu</Text>
        {restaurant.dishes.map((dish, i) => (
          <Text key={i} style={s.menuItem}>• {dish}</Text>
        ))}

        <Text style={s.sectionTitle}>Last meals</Text>
        {lastMeals.length === 0 ? (
          <Text style={s.noMeals}>No previous meals recorded here.</Text>
        ) : (
          lastMeals.map((m) => (
            <Text key={m.id} style={s.lastMealRow}>
              {m.date}  ⭐ {m.averageScore.toFixed(1)}
              {'  '}<Text style={s.lastMealUser}>@{usersMap[m.userId] ?? 'unknown'}</Text>
            </Text>
          ))
        )}

        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push(`/add-meal/${restaurant.id}`)}
        >
          <Text style={s.addBtnText}>Add Food</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: theme.background },
  heroImage:    { width: '100%', height: 220 },
  backOverlay:  { position: 'absolute', top: 48, left: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  body:         { padding: spacing.md },
  name:         { fontSize: fontSize.title, color: theme.primary, fontWeight: 'bold', marginBottom: 4 },
  location:     { fontSize: fontSize.body, color: theme.textSecondary, marginBottom: spacing.md },
  description:  { fontSize: fontSize.body, color: theme.text, lineHeight: 24, marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.heading, color: theme.primary, fontWeight: 'bold', marginBottom: spacing.sm, marginTop: spacing.sm },
  menuItem:     { fontSize: fontSize.body, color: theme.text, lineHeight: 28 },
  noMeals:      { fontSize: fontSize.body, color: theme.textMuted, fontStyle: 'italic' },
  lastMealRow:  { fontSize: fontSize.body, color: theme.textSecondary, lineHeight: 28 },
  lastMealUser: { fontSize: fontSize.body, color: theme.primary, fontWeight: '600' },
  addBtn:       { backgroundColor: theme.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  addBtnText:   { fontSize: fontSize.body, fontWeight: 'bold', color: theme.black },
  backBtn:      { margin: spacing.md },
  backText:     { fontSize: fontSize.body, color: theme.primary },
  errorText:    { fontSize: fontSize.body, color: theme.error, margin: spacing.md },
});
