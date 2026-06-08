import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, fontSize, spacing } from '../src/theme';
import { validateRegisterForm } from '../src/utils/validation';
import { findUserByUsername, findUserByEmail, addUser, setCurrentUserId } from '../src/utils/storage';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const error = validateRegisterForm(email, username, password);
    if (error) { Alert.alert('Error', error); return; }

    setLoading(true);
    try {
      const [existingUser, existingEmail] = await Promise.all([
        findUserByUsername(username.trim()),
        findUserByEmail(email.trim()),
      ]);
      if (existingUser) { Alert.alert('Error', 'Username is already taken'); return; }
      if (existingEmail) { Alert.alert('Error', 'Email is already registered'); return; }

      const newUser = {
        id: Date.now().toString(),
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password: password,
      };
      await addUser(newUser);
      await setCurrentUserId(newUser.id);
      router.replace('/(tabs)/');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Sign In</Text>

      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input}
        placeholder="name@example.com"
        placeholderTextColor={theme.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={s.label}>Username</Text>
      <TextInput
        style={s.input}
        placeholder="name"
        placeholderTextColor={theme.textMuted}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={s.label}>Password</Text>
      <View style={s.passwordRow}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="••••••••••••"
          placeholderTextColor={theme.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          />
        <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPass(v => !v)}
>
          <Text style={s.eyeText}>{showPass ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}
>
        {loading
          ? <ActivityIndicator color={theme.black} />
          : <Text style={s.btnText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}
>
        <Text style={s.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: theme.background },
  container:   { padding: spacing.xl, paddingTop: 80, alignItems: 'center' },
  title:       { fontSize: fontSize.title, color: theme.primary, fontWeight: 'bold', marginBottom: spacing.lg, alignSelf: 'flex-start' },
  label:       { fontSize: fontSize.label, color: theme.primary, fontWeight: 'bold', marginBottom: spacing.xs, alignSelf: 'flex-start', width: '100%' },
  input:       { width: '100%', backgroundColor: theme.surface, color: theme.text, fontSize: fontSize.body, borderRadius: 8, padding: spacing.md, borderWidth: 1, borderColor: theme.primary, marginBottom: spacing.md },
  passwordRow: { flexDirection: 'row', width: '100%', marginBottom: spacing.md, alignItems: 'center' },
  eyeBtn:      { position: 'absolute', right: 12, top: 12, padding: 4 },
  eyeText:     { fontSize: 18 },
  btn:         { width: '100%', backgroundColor: theme.primary, borderRadius: 8, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.sm },
  btnText:     { fontSize: fontSize.body, fontWeight: 'bold', color: theme.black },
  link:        { fontSize: fontSize.body, color: theme.textSecondary, marginTop: spacing.sm, padding: spacing.sm },
});
