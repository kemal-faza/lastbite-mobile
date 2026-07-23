import { type ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Logo } from './Logo';
import { colors } from '@/theme';

interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showBackButton?: boolean;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
  showBackButton = true,
}: AuthScreenLayoutProps) {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(food-saver)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {showBackButton && (
        <View className="px-4 pt-2">
          <Pressable
            onPress={handleBack}
            className="p-2 -ml-2 self-start flex-row items-center"
            hitSlop={10}
            accessibilityLabel="Kembali"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
          </Pressable>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <Logo size="lg" className="mb-4" />
            <Text className="text-2xl font-bold text-primary">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-base mt-1" style={{ color: colors.textSecondary }}>
                {subtitle}
              </Text>
            )}
          </View>

          <View className="w-full">{children}</View>
        </ScrollView>

        {footer && (
          <View className="px-6 pb-6 items-center">{footer}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
