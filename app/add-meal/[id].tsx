import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fontSize, spacing } from '../../src/theme';
import { getRestaurantById } from '../../src/utils/seedData';
import { getCurrentUserId, addMeal, calculateAverageScore } from '../../src/utils/storage';
import { validateScore } from '../../src/utils/validation';
import { MealItem } from '../../src/types';
import AppModal from '../../src/components/AppModal';

interface DishState {
  name: string;
  checked: boolean;
  flavor: string;
  price: string;
}

interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  mode: 'info' | 'confirm' | 'success';
}

export default function AddMealScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const restaurant = getRestaurantById(id ?? '');

  const [dishes, setDishes] = useState<DishState[]>(
    (restaurant?.dishes ?? []).map((name) => ({ name, checked: false, flavor: '', price: '' }))
  );
  const [date, setDate]             = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [modal, setModal]           = useState<ModalState>({
    visible: false, title: '', message: '', mode: 'info',
  });

  const dateString = date.toISOString().slice(0, 10);

  const toggleDish = (i: number) =>
    setDishes((prev) => prev.map((d, idx) => idx === i ? { ...d, checked: !d.checked } : d));
  const setFlavor = (i: number, v: string) =>
    setDishes((prev) => prev.map((d, idx) => idx === i ? { ...d, flavor: v } : d));
  const setPrice  = (i: number, v: string) =>
    setDishes((prev) => prev.map((d, idx) => idx === i ? { ...d, price: v } : d));

  const showInfo = (title: string, message: string) =>
    setModal({ visible: true, title, message, mode: 'info' });

  const handleSave = () => {
    const selected = dishes.filter((d) => d.checked);
    if (selected.length === 0) {
      showInfo('No dishes selected', 'Please select at least one dish before saving.');
      return;
    }
    const invalid = selected.find(
      (d) => !validateScore(d.flavor).valid || !validateScore(d.price).valid
    );
    if (invalid) {
      showInfo(
        'Invalid scores',
        `"${invalid.name}" needs valid Flavor and Price scores between 0.0 and 5.0.`
      );
      return;
    }

    const summary = selected
      .map((d) => `• ${d.name}   Flavor: ${d.flavor}   Price: ${d.price}`)
      .join('\n');
    setModal({ visible: true, title: 'Save this meal?', message: summary, mode: 'confirm' });
  };

  const confirmSave = async () => {
    setModal((m) => ({ ...m, visible: false }));
    const userId = await getCurrentUserId();
    if (!userId) { router.replace('/login'); return; }
    const selected = dishes.filter((d) => d.checked);
    const items: MealItem[] = selected.map((d) => ({
      dishName:    d.name,
      flavorScore: parseFloat(d.flavor),
      priceScore:  parseFloat(d.price),
    }));
    const meal = {
      id:           Date.now().toString(),
      restaurantId: id ?? '',
      userId,
      date:         dateString,
      items,
      averageScore: calculateAverageScore(items),
    };
    await addMeal(meal);
    setModal({ visible: true, title: 'Meal saved!', message: 'Your meal has been recorded successfully.', mode: 'success' });
  };

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.title}>Add Meal</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        <Text style={s.sectionLabel}>Day</Text>
        <TouchableOpacity style={s.dateBtn} onPress={() => setShowPicker(true)}
          accessibilityLabel="Open date picker">
          <Ionicons name="calendar" size={20} color={theme.primary} />
          <Text style={s.dateText}>{dateString}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, d) => { setShowPicker(false); if (d) setDate(d); }}
          />
        )}

        <View style={s.columnHeader}>
          <Text style={[s.colLabel, { flex: 1 }]}>Dish</Text>
          <Text style={s.colLabel}>Flavor</Text>
          <Text style={s.colLabel}>Price</Text>
        </View>

        {dishes.map((dish, i) => (
          <View key={i} style={s.dishRow}>
            <TouchableOpacity style={s.checkRow} onPress={() => toggleDish(i)}
>
              <View style={[s.checkbox, dish.checked && s.checkboxChecked]}>
                {dish.checked && <Ionicons name="checkmark" size={14} color={theme.black} />}
              </View>
              <Text style={[s.dishName, dish.checked && s.dishNameActive]}>{dish.name}</Text>
            </TouchableOpacity>

            {dish.checked && (
              <View style={s.scoresRow}>
                <TextInput
                  style={s.scoreInput}
                  value={dish.flavor}
                  onChangeText={(v) => setFlavor(i, v)}
                  keyboardType="decimal-pad"
                  placeholder="0–5"
                  placeholderTextColor={theme.textMuted}
                />
                <TextInput
                  style={s.scoreInput}
                  value={dish.price}
                  onChangeText={(v) => setPrice(i, v)}
                  keyboardType="decimal-pad"
                  placeholder="0–5"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            )}
          </View>
        ))}

        <View style={s.btnRow}>
          <TouchableOpacity style={s.saveBtn} onPress={handleSave}
            accessibilityLabel="Save meal entry">
            <Text style={s.saveBtnText}>Save Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} onPress={() => router.back()}
            accessibilityLabel="Cancel and discard changes">
            <Text style={s.cancelBtnText}>Cancel Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {modal.mode === 'info' && (
        <AppModal
          visible={modal.visible}
          title={modal.title}
          message={modal.message}
          buttons={[{
            text: 'OK',
            variant: 'primary',
            onPress: () => setModal((m) => ({ ...m, visible: false })),
          }]}
        />
      )}

      {modal.mode === 'confirm' && (
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
              text: 'Save Entry',
              variant: 'primary',
              onPress: confirmSave,
            },
          ]}
        />
      )}

      {modal.mode === 'success' && (
        <AppModal
          visible={modal.visible}
          title={modal.title}
          message={modal.message}
          buttons={[{
            text: 'OK',
            variant: 'primary',
            onPress: () => { setModal((m) => ({ ...m, visible: false })); router.back(); },
          }]}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: theme.background },
  header:          { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingTop: 52, gap: spacing.md },
  title:           { fontSize: fontSize.title, color: theme.primary, fontWeight: 'bold' },
  body:            { padding: spacing.md, paddingBottom: 40 },
  sectionLabel:    { fontSize: fontSize.label, color: theme.primary, fontWeight: 'bold', marginBottom: 6 },
  dateBtn:         { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 8, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  dateText:        { fontSize: fontSize.body, color: theme.text },
  columnHeader:    { flexDirection: 'row', marginBottom: spacing.xs },
  colLabel:        { width: 72, fontSize: 13, color: theme.textSecondary, fontWeight: 'bold', textAlign: 'center' },
  dishRow:         { marginBottom: spacing.sm },
  checkRow:        { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkbox:        { width: 22, height: 22, borderWidth: 2, borderColor: theme.primary, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: theme.primary },
  dishName:        { flex: 1, fontSize: fontSize.body, color: theme.textSecondary },
  dishNameActive:  { color: theme.text, fontWeight: '600' },
  scoresRow:       { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.xs, paddingLeft: 32 },
  scoreInput:      { width: 68, backgroundColor: theme.surface, borderRadius: 6, padding: 8, fontSize: fontSize.body, color: theme.text, textAlign: 'center', borderWidth: 1, borderColor: theme.divider },
  btnRow:          { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  saveBtn:         { flex: 1, backgroundColor: theme.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center' },
  saveBtnText:     { fontSize: fontSize.body, fontWeight: 'bold', color: theme.black },
  cancelBtn:       { flex: 1, borderWidth: 1, borderColor: theme.textSecondary, borderRadius: 8, padding: spacing.md, alignItems: 'center' },
  cancelBtnText:   { fontSize: fontSize.body, color: theme.text },
});
