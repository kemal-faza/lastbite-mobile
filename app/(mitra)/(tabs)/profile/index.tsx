import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { ProfileMenuItem } from '@/components/ProfileMenuItem';
import { useToast } from '@/contexts/ToastContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updateProfile as updateProfileApi } from '@/lib/api/profile';
import { getMitraProfile } from '@/lib/api/mitra';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MitraProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuthStore();
  const [editingField, setEditingField] = useState<'name' | 'phone' | null>(null);
  const [editValue, setEditValue] = useState('');
  const { showToast } = useToast();

  const { data: mitraProfile, isLoading } = useQuery({
    queryKey: ['mitra-profile'],
    queryFn: () => getMitraProfile().then((r) => r.profile),
    enabled: user?.role === 'MITRA',
  });

  const updateProfile = useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      updateProfileApi(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
    },
  });

  const startEdit = (field: 'name' | 'phone', currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingField) return;
    try {
      await updateProfile.mutateAsync({ [editingField]: editValue });
      setEditingField(null);
      showToast('Profil diperbarui');
    } catch {
      showToast('Gagal memperbarui profil');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(food-saver)');
  };

  const storeName = mitraProfile?.storeName || user?.name || 'Mitra';

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 90 + insets.bottom,
        }}
      >
        {/* Avatar + Store / User name */}
        <View className="items-center mt-6 mb-6">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-3">
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text className="text-primary text-3xl font-bold">
                {storeName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <Text className="text-xl font-bold">{storeName}</Text>
          {user?.name && user.name !== storeName && (
            <Text className="text-sm text-gray-600 mt-0.5">{user.name}</Text>
          )}
          <Text className="text-sm text-gray-500 mt-0.5">{user?.email}</Text>
          <View className="bg-primary/10 px-3 py-1 rounded-full mt-2">
            <Text className="text-primary text-xs font-semibold">Mitra</Text>
          </View>
        </View>

        {/* Inline Edit: Info Akun */}
        <View className="bg-white rounded-xl overflow-hidden border border-gray-100 mb-4">
          <Text className="px-3.5 py-3 text-[13px] font-bold text-gray-500 border-b border-gray-100">
            Info Akun
          </Text>

          {/* Name field */}
          {editingField === 'name' ? (
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
                  accessibilityLabel="Batal Edit"
                  className="flex-1 bg-gray-100 rounded-lg py-2.5 items-center"
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveEdit}
                  accessibilityLabel="Simpan Edit"
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
              accessibilityLabel="Edit Nama"
              onPress={() => startEdit('name', user?.name || '')}
              className="flex-row items-center justify-between px-3.5 py-3 border-b border-gray-100"
            >
              <Text className="text-[13px] text-gray-500">Nama</Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-medium text-gray-900">
                  {user?.name || 'Belum ditambahkan'}
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
          {editingField === 'phone' ? (
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
                  accessibilityLabel="Batal Edit"
                  className="flex-1 bg-gray-100 rounded-lg py-2.5 items-center"
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveEdit}
                  accessibilityLabel="Simpan Edit"
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
              accessibilityLabel="Edit Telepon"
              onPress={() => startEdit('phone', user?.phone || '')}
              className="flex-row items-center justify-between px-3.5 py-3"
            >
              <Text className="text-[13px] text-gray-500">Telepon</Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-medium text-gray-900">
                  {user?.phone || 'Belum ditambahkan'}
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

        {/* Menu items (Mitra subset) */}
        <View className="bg-white rounded-xl mb-4">
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

        {/* Logout */}
        <View className="mt-2 mb-4">
          <Button
            testID="logout-button"
            variant="outline"
            size="lg"
            onPress={handleLogout}
            accessibilityLabel="Keluar"
            className="border-destructive flex-row items-center justify-center w-full h-11"
          >
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={colors.destructive}
            />
            <Text className="text-destructive font-medium ml-2">Keluar</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
