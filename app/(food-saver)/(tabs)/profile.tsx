import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuthStore } from "@/stores/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { ImpactStats } from "@/components/ImpactStats";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { useImpact } from "@/hooks/useImpact";
import { useToast } from "@/contexts/ToastContext";
import { useMutation } from "@tanstack/react-query";
import { updateProfile as updateProfileApi } from "@/lib/api/profile";

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [editingField, setEditingField] = useState<"name" | "phone" | null>(
    null,
  );
  const [editValue, setEditValue] = useState("");
  const { showToast } = useToast();
  const { moneySaved, foodSaved, isLoading: impactLoading } = useImpact();
  const updateUser = useAuthStore((s) => s.updateUser);
  const updateProfile = useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      updateProfileApi(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });

  const startEdit = (field: "name" | "phone", currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || "");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingField) return;
    try {
      await updateProfile.mutateAsync({ [editingField]: editValue });
      setEditingField(null);
      showToast("Profil diperbarui");
    } catch {
      showToast("Gagal memperbarui profil");
    }
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 p-4 justify-center items-center">
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={80}
            color={colors.textSecondary}
          />
          <Text className="text-xl font-bold mt-4">Masuk LastBite</Text>
          <Text className="text-sm text-gray-500 mt-1 mb-8 text-center">
            Masuk untuk mendapatkan rekomendasi{"\n"}personal dan melacak
            pesanan
          </Text>
          <PrimaryButton onPress={() => router.push({ pathname: '/login', params: { returnUrl: '/(food-saver)/(tabs)/profile' } })}>
            Masuk
          </PrimaryButton>
          <Button
            variant="outline"
            onPress={() => router.push("/register")}
            className="mt-3 w-full"
          >
            <Text className="font-medium w-full text-center">
              Daftar Akun Baru
            </Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        {/* Avatar + name */}
        <View className="items-center mt-8 mb-6">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <Text className="text-xl font-bold">{user?.name}</Text>
          <Text className="text-sm text-gray-500">{user?.email}</Text>
          <View className="bg-primary/10 px-3 py-1 rounded-full mt-2">
            <Text className="text-primary text-xs font-semibold">
              {user?.role === "MITRA" ? "Mitra" : "Food Saver"}
            </Text>
          </View>
        </View>

        {/* Dynamic Impact Stats */}
        <ImpactStats moneySaved={moneySaved} foodSaved={foodSaved} />

        {/* Inline Edit: Info Akun */}
        <View className="bg-white rounded-xl overflow-hidden border border-gray-100 mb-4">
          <Text className="px-3.5 py-3 text-[13px] font-bold text-gray-500 border-b border-gray-100">
            Info Akun
          </Text>

          {/* Name field */}
          {editingField === "name" ? (
            <View className="px-3.5 py-3 border-b border-gray-100">
              <Text className="text-[13px] text-primary font-semibold mb-1.5">
                Nama
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-2.5 py-2 text-sm text-gray-700"
                value={editValue}
                onChangeText={setEditValue}
                autoFocus
                maxLength={100}
              />
              <View className="flex-row gap-2 mt-2.5">
                <TouchableOpacity
                  onPress={cancelEdit}
                  className="flex-1 bg-gray-100 rounded-lg py-2.5 items-center"
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveEdit}
                  className="flex-1 bg-primary rounded-lg py-2.5 items-center"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-sm font-semibold text-white">
                      Simpan
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => startEdit("name", user?.name || "")}
              className="flex-row items-center justify-between px-3.5 py-3 border-b border-gray-100"
            >
              <Text className="text-[13px] text-gray-500">Nama</Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-medium text-gray-900">
                  {user?.name || "Belum ditambahkan"}
                </Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={14}
                  color="#166534"
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Phone field */}
          {editingField === "phone" ? (
            <View className="px-3.5 py-3">
              <Text className="text-[13px] text-primary font-semibold mb-1.5">
                Telepon
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-2.5 py-2 text-sm text-gray-700"
                value={editValue}
                onChangeText={setEditValue}
                autoFocus
                keyboardType="phone-pad"
                maxLength={15}
              />
              <View className="flex-row gap-2 mt-2.5">
                <TouchableOpacity
                  onPress={cancelEdit}
                  className="flex-1 bg-gray-100 rounded-lg py-2.5 items-center"
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveEdit}
                  className="flex-1 bg-primary rounded-lg py-2.5 items-center"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-sm font-semibold text-white">
                      Simpan
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => startEdit("phone", user?.phone || "")}
              className="flex-row items-center justify-between px-3.5 py-3"
            >
              <Text className="text-[13px] text-gray-500">Telepon</Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-medium text-gray-900">
                  {user?.phone || "Belum ditambahkan"}
                </Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={14}
                  color="#166534"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu items */}
        <View className="bg-white rounded-xl mb-4">
          <ProfileMenuItem
            icon="clipboard-list"
            label="Riwayat Pesanan"
            onPress={() => router.push("/orders")}
          />
          <ProfileMenuItem
            icon="heart-outline"
            label="Menu Favorit"
            onPress={() => router.push("/wishlist")}
          />
          <ProfileMenuItem
            icon="shield-account"
            label="Keamanan Akun"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="cog-outline"
            label="Pengaturan"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="help-circle-outline"
            label="Pusat Bantuan"
            onPress={() => {}}
            showArrow={false}
          />
        </View>

        {user?.role === "MITRA" && (
          <View className="bg-white rounded-xl mb-4">
            <ProfileMenuItem
              icon="store"
              label="Dashboard Mitra"
              onPress={() => router.push("/(mitra)")}
            />
          </View>
        )}

        <View className="pb-4">
          <Button
            variant="outline"
            onPress={logout}
            className="border-destructive"
          >
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={colors.destructive}
            />
            <Text className="text-destructive font-medium ml-1">Keluar</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
