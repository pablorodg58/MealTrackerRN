import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, fontSize, spacing } from '../theme';

export interface ModalButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'cancel';
}

interface AppModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: ModalButton[];
}

export default function AppModal({ visible, title, message, buttons }: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.accentBar} />

          <View style={s.content}>
            <Text style={s.title}>{title}</Text>
            {message ? <Text style={s.message}>{message}</Text> : null}

            <View style={[s.btnRow, buttons.length === 1 && s.btnRowCenter]}>
              {buttons.map((btn, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.btn, btn.variant === 'cancel' ? s.btnCancel : s.btnPrimary]}
                  onPress={btn.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={btn.text}
                >
                  <Text style={[s.btnText, btn.variant === 'cancel' ? s.btnTextCancel : s.btnTextPrimary]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: theme.surface,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  accentBar: {
    height: 5,
    backgroundColor: theme.primary,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.heading,
    color: theme.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.body,
    color: theme.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  btnRowCenter: {
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: theme.primary,
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: theme.textSecondary,
    backgroundColor: 'transparent',
  },
  btnText: {
    fontSize: fontSize.body,
    fontWeight: '700',
  },
  btnTextPrimary: {
    color: theme.black,
  },
  btnTextCancel: {
    color: theme.text,
  },
});
