import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fontSize, spacing } from '../../src/theme';
import { getMealById } from '../../src/utils/storage';
import { getRestaurantById } from '../../src/utils/seedData';
import { Meal } from '../../src/types';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (id) getMealById(id).then(setMeal);
  }, [id]);

  if (!meal) {
    return (
      <View style={s.screen}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.errorText}>Meal not found.</Text>
      </View>
    );
  }

  const restaurant = getRestaurantById(meal.restaurantId);

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.title}>List of Meals</Text>
      </View>

      <View style={s.body}>
        <Text style={s.restaurantName}>{restaurant?.name ?? 'Unknown Restaurant'}</Text>
        <Text style={s.date}>{meal.date}</Text>
        <Text style={s.score}>Average Score: ⭐ {meal.averageScore.toFixed(1)}</Text>

        <View style={s.tableHeader}>
          <Text style={[s.colHead, { flex: 1 }]}>Dish</Text>
          <Text style={s.colHead}>Flavor</Text>
          <Text style={s.colHead}>Price</Text>
        </View>
        <View style={s.divider} />

        {meal.items.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.cellDish, { flex: 1 }]}>{item.dishName}</Text>
            <Text style={s.cellScore}>{item.flavorScore.toFixed(1)}</Text>
            <Text style={s.cellScore}>{item.priceScore.toFixed(1)}</Text>
          </View>
        ))}

        <View style={s.btnRow}>
          <TouchableOpacity
            style={s.visitBtn}
            onPress={() => router.push(`/restaurant/${meal.restaurantId}`)}
          >
            <Text style={s.visitBtnText}>Visit Restaurant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.backListBtn}
            onPress={() => router.back()}
          >
            <Text style={s.backListBtnText}>Back List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: theme.background },
  header:         { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingTop: 52, gap: spacing.md },
  title:          { fontSize: fontSize.title, color: theme.primary, fontWeight: 'bold' },
  body:           { padding: spacing.md },
  restaurantName: { fontSize: fontSize.heading, color: theme.text, fontWeight: 'bold', marginBottom: 4 },
  date:           { fontSize: fontSize.body, color: theme.textSecondary, marginBottom: 4 },
  score:          { fontSize: fontSize.body, color: theme.primary, fontWeight: 'bold', marginBottom: spacing.lg },
  tableHeader:    { flexDirection: 'row', marginBottom: spacing.xs },
  colHead:        { width: 72, fontSize: fontSize.body, color: theme.primary, fontWeight: 'bold', textAlign: 'center' },
  divider:        { height: 1, backgroundColor: theme.divider, marginBottom: spacing.sm },
  tableRow:       { flexDirection: 'row', paddingVertical: 8 },
  cellDish:       { fontSize: fontSize.body, color: theme.text },
  cellScore:      { width: 72, fontSize: fontSize.body, color: theme.textSecondary, textAlign: 'center' },
  btnRow:         { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  visitBtn:       { flex: 1, backgroundColor: theme.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center' },
  visitBtnText:   { fontSize: fontSize.body, fontWeight: 'bold', color: theme.black },
  backListBtn:    { flex: 1, borderWidth: 1, borderColor: theme.textSecondary, borderRadius: 8, padding: spacing.md, alignItems: 'center' },
  backListBtnText:{ fontSize: fontSize.body, color: theme.text },
  backBtn:        { margin: spacing.md },
  backText:       { fontSize: fontSize.body, color: theme.primary },
  errorText:      { fontSize: fontSize.body, color: theme.error, margin: spacing.md },
});
