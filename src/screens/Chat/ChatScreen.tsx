import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import Input from '../../components/Input';

// ─── Mock chatbot responses ────────────────────────────────────────────────────

const getBotResponse = (userMsg: string): string => {
  const msg = userMsg.toLowerCase();
  if (msg.includes('frein') || msg.includes('bruit')) {
    return '⚠️ Des bruits au freinage peuvent indiquer des plaquettes usées ou des disques rayés. Je vous recommande de faire inspecter votre système de freinage dès que possible chez un mécanicien qualifié.';
  }
  if (msg.includes('chauf') || msg.includes('température')) {
    return '🌡️ Si votre moteur chauffe, vérifiez immédiatement le niveau de liquide de refroidissement. Si le voyant reste allumé, arrêtez le véhicule et appelez une assistance. Ne continuez pas à conduire avec un moteur en surchauffe.';
  }
  if (msg.includes('huile') || msg.includes('vidang')) {
    return '🛢️ La vidange doit être effectuée tous les 10 000 à 15 000 km selon votre véhicule. Je vois que votre kilométrage actuel suggère une vidange prochaine. Utilisez de l\'huile 5W30 recommandée par le constructeur.';
  }
  if (msg.includes('pneum') || msg.includes('pneu')) {
    return '🔄 Vérifiez la pression de vos pneus régulièrement (tous les mois). Une pression incorrecte peut augmenter la consommation de carburant et réduire l\'adhérence. La pression recommandée est généralement indiquée sur la portière conducteur.';
  }
  if (msg.includes('batterie') || msg.includes('démarr')) {
    return '🔋 Des difficultés au démarrage peuvent indiquer une batterie faible ou des bornes oxydées. Une batterie dure en moyenne 3 à 5 ans. Testez votre batterie gratuitement dans n\'importe quel centre auto.';
  }
  if (msg.includes('consomm')) {
    return '⛽ Une consommation excessive peut être due à : filtre à air bouché, pneus sous-gonflés, conduite agressive, ou problème d\'injection. Je vous recommande une révision complète.';
  }
  return '🤖 Je comprends votre problème. Pourriez-vous me décrire plus précisément les symptômes ? Par exemple : quand le problème survient-il ? y a-t-il des voyants allumés ? Cela m\'aidera à vous donner un meilleur diagnostic.';
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    text: '👋 Bonjour ! Je suis votre assistant de diagnostic automobile SmartSOS. Décrivez-moi les symptômes de votre véhicule et je vous aiderai à identifier le problème.',
    isUser: false,
    timestamp: new Date(),
  },
];

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const suggestions = ['Bruit au freinage', 'Moteur qui chauffe', 'Voyant huile allumé', 'Batterie faible'];

  const sendMessage = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgRow, item.isUser ? styles.msgRowUser : styles.msgRowBot]}>
      {!item.isUser && (
        <View style={styles.avatar}>
          <Text style={{ fontSize: 16 }}>🤖</Text>
        </View>
      )}
      <View style={[styles.bubble, item.isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, item.isUser && styles.bubbleTextUser]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, item.isUser && { color: 'rgba(255,255,255,0.6)' }]}>
          {item.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.botInfo}>
          <View style={styles.botAvatar}>
            <Text style={{ fontSize: 22 }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.botName}>SmartSOS AI</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Diagnostic automobile</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingRow}>
              <View style={styles.avatar}>
                <Text style={{ fontSize: 16 }}>🤖</Text>
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>En train d'analyser...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsLabel}>Suggestions :</Text>
          <View style={styles.suggestionChips}>
            {suggestions.map(s => (
              <TouchableOpacity key={s} style={styles.chip} onPress={() => sendMessage(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputRow}>
        <Input
          placeholder="Décrivez votre problème..."
          value={input}
          onChangeText={setInput}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || isTyping}
        >
          <Ionicons name="send" size={18} color={colors.textInverse} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  botInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: { fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  onlineText: { fontSize: typography.xs, color: colors.textSecondary },
  messages: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.base },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowBot: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: { fontSize: typography.sm, color: colors.textPrimary, lineHeight: 20 },
  bubbleTextUser: { color: colors.textInverse },
  timestamp: { fontSize: 10, color: colors.textTertiary, marginTop: 4, alignSelf: 'flex-end' },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  typingText: { fontSize: typography.sm, color: colors.textSecondary },
  suggestions: { paddingHorizontal: spacing.base, paddingBottom: spacing.sm },
  suggestionsLabel: { fontSize: typography.xs, color: colors.textTertiary, marginBottom: spacing.xs },
  suggestionChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  chipText: { fontSize: typography.xs, color: colors.primary, fontWeight: typography.medium },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    paddingTop: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.textTertiary },
});

export default ChatScreen;
