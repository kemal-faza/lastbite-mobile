import { type ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from './Logo';
import { colors } from '@/theme';

interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
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
