import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AuthScreenLayout } from "@/components/AuthScreenLayout";
import { TextField } from "@/components/TextField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors } from "@/theme";
import { authService } from "@/lib/auth";
import { safeReturnUrl } from "@/lib/security/redirect";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { returnUrl } = useLocalSearchParams<{ returnUrl?: string }>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      const isMitra = res.user.role === "MITRA";
      const target = isMitra
        ? safeReturnUrl(returnUrl, "/(mitra)")
        : safeReturnUrl(returnUrl || undefined, "/(food-saver)");
      router.replace(target as any);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      title="Masuk LastBite"
      subtitle="Selamat datang kembali"
      footer={
        <Pressable onPress={() => router.push("/register")}>
          <Text className="text-center text-sm">
            Belum punya akun?{" "}
            <Text className="font-semibold" style={{ color: colors.primary }}>
              Daftar
            </Text>
          </Text>
        </Pressable>
      }
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Email"
            accessibilityLabel="email field"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Password"
            accessibilityLabel="password label"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <Pressable
        onPress={() => router.push("/forgot-password")}
        className="self-end"
      >
        <Text className="text-sm" style={{ color: colors.primary }}>
          Lupa password?
        </Text>
      </Pressable>

      <PrimaryButton
        onPress={handleSubmit(onLogin)}
        loading={loading}
        accessibilityLabel="Tombol Masuk"
      >
        Masuk
      </PrimaryButton>

      {__DEV__ && (
        <View className="mt-6 pt-4 border-t border-gray-200">
          <Text className="text-xs text-gray-400 text-center mb-2">
            Mode Development
          </Text>

          {/* --- Dev login buttons use env vars (M-2) --- */}
          <PrimaryButton
            testID="dev-login-foodsaver"
            accessibilityLabel="Masuk Food Saver Dev"
            loading={loading}
            onPress={async () => {
              setLoading(true);
              try {
                const fsEmail = process.env.EXPO_PUBLIC_DEV_FOODSAVER_EMAIL;
              const fsPassword =
                process.env.EXPO_PUBLIC_DEV_FOODSAVER_PASSWORD;
              if (!fsEmail || !fsPassword) {
                alert(
                  "Dev credentials missing. Set EXPO_PUBLIC_DEV_FOODSAVER_EMAIL / _PASSWORD in your .env",
                );
                return;
              }
              await authService.login(fsEmail, fsPassword);
                router.replace(
                  safeReturnUrl(returnUrl, "/(food-saver)") as any,
                );
              } catch (e: any) {
                alert(e.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Masuk sebagai Food Saver (Dev)
          </PrimaryButton>

          <View className="h-2" />

          <PrimaryButton
            testID="dev-login-mitra"
            accessibilityLabel="Masuk Mitra Dev"
            loading={loading}
            onPress={async () => {
              setLoading(true);
              try {
                const mitraEmail = process.env.EXPO_PUBLIC_DEV_MITRA_EMAIL;
                const mitraPassword =
                  process.env.EXPO_PUBLIC_DEV_MITRA_PASSWORD;
                if (!mitraEmail || !mitraPassword) {
                  alert(
                    "Dev credentials missing. Set EXPO_PUBLIC_DEV_MITRA_EMAIL / _PASSWORD in your .env",
                  );
                  return;
                }
                await authService.login(mitraEmail, mitraPassword);
                const target = safeReturnUrl(returnUrl, "/(mitra)");
                router.replace(target as any);
              } catch (e: any) {
                alert(e.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Masuk sebagai Mitra (Dev)
          </PrimaryButton>
        </View>
      )}
    </AuthScreenLayout>
  );
}
