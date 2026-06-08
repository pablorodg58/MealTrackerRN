import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fontSize, spacing } from '../../src/theme';
import { RESTAURANTS } from '../../src/utils/seedData';
import { clearSession } from '../../src/utils/storage';
import { Restaurant } from '../../src/types';
import AppModal from '../../src/components/AppModal';

const PAGE_SIZE = 4;

export default function RestaurantsScreen() {
  const router = useRouter();
  const [query, setQuery]     = useState('');
  const [page, setPage]       = useState(0);
  const [logoutModal, setLogoutModal] = useState(false);

  const filtered = RESTAURANTS.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.location.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages - 1);
  const paged      = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const handleSearch = (text: string) => { setQuery(text); setPage(0); };

  const handleLogout = () => setLogoutModal(true);

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={s.cardImage}
      />
      <View style={s.cardBody}>
        <Text style={s.cardName}>{item.name}</Text>
        <Text style={s.cardLocation}>📍 {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>Restaurants</Text>
        <TouchableOpacity onPress={handleLogout} accessibilityLabel="Logout from account" style={s.logoutBtn}>
          <Ionicons name="log-out-outline" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={s.searchRow}>
        <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={paged}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 8 }}
      />

      <AppModal
        visible={logoutModal}
        title="Do you want to logout?"
        message="Are you sure you want to log out? Tap 'Confirm' to end your session or 'Cancel' to stay logged in."
        buttons={[
          { text: 'Cancel',  variant: 'cancel',  onPress: () => setLogoutModal(false) },
          { text: 'Confirm', variant: 'primary',  onPress: async () => { setLogoutModal(false); await clearSession(); router.replace('/login'); } },
        ]}
      />

      <View style={s.pagination}>
        <TouchableOpacity
          style={[s.pageBtn, safePage === 0 && s.pageBtnDisabled]}
          onPress={() => setPage((p) => Math.max(0, p - 1))}
          disabled={safePage === 0}
        >
          <Text style={s.pageBtnText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={s.pageIndicator}>
          {safePage + 1} / {totalPages}
        </Text>

        <TouchableOpacity
          style={[s.pageBtn, safePage >= totalPages - 1 && s.pageBtnDisabled]}
          onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={safePage >= totalPages - 1}
        >
          <Text style={s.pageBtnText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: theme.background },
  header:         { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingTop: 52 },
  title:          { flex: 1, fontSize: fontSize.title, color: theme.primary, fontWeight: 'bold' },
  logoutBtn:      { padding: spacing.xs },
  searchRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  searchInput:    { flex: 1, fontSize: fontSize.body, color: theme.text },
  card:           { flexDirection: 'row', backgroundColor: theme.surface, margin: spacing.sm, borderRadius: 12, overflow: 'hidden' },
  cardImage:      { width: 80, height: 80 },
  cardBody:       { flex: 1, padding: spacing.md, justifyContent: 'center' },
  cardName:       { fontSize: fontSize.heading, color: theme.primary, fontWeight: 'bold' },
  cardLocation:   { fontSize: fontSize.body, color: theme.textSecondary, marginTop: 4 },
  pagination:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  pageBtn:        { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.textSecondary, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  pageBtnDisabled:{ opacity: 0.3 },
  pageBtnText:    { fontSize: fontSize.heading, color: theme.text, fontWeight: 'bold' },
  pageIndicator:  { fontSize: fontSize.body, color: theme.text, marginHorizontal: spacing.md },
});
