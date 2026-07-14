import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useOrder } from '@/hooks/useOrders';
import { useConfirmPickup } from '@/hooks/useOrders';
import { useBackHandler } from '@/hooks/useBackHandler';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Header } from '@/components/Header';
import { ReviewModal } from '@/components/ReviewModal';
import { useToast } from '@/contexts/ToastContext';
import { colors } from '@/theme';
export default function OrderConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: orderData, isLoading, isError } = useOrder(id);
  const { mutate: doConfirmPickup, isPending } = useConfirmPickup();
  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductName, setReviewProductName] = useState('');

  const handleBack = useCallback(() => {
    try { router.back(); } catch { router.replace('/'); }
  }, []);

  useBackHandler(handleBack);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-2">Memuat pesanan...</Text>
      </View>
    );
  }

  if (isError || !orderData?.order) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.destructive} />
        <Text className="text-red-500 text-center mt-2">Gagal memuat pesanan</Text>
      </View>
    );
  }

  const order = orderData.order;
  const pickupExpiresAt = order.pickupExpiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();

  // Check for success state
  const showSuccess = showSuccessScreen || order.status === 'PICKED_UP';

  if (showSuccess) {
    const productName = order.items?.[0]?.name || 'Produk';

    return (
      <View className="flex-1 bg-background">
        <Header title="Pesanan Selesai" onBack={handleBack} />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          {/* Lottie animation */}
          <LottieView
            testID="lottie-success"
            source={require('@/assets/animations/success.json')}
            autoPlay
            loop={false}
            style={{ width: 120, height: 120, marginBottom: 16 }}
          />

          <Text className="text-2xl font-bold text-center mb-2">
            Pesanan Berhasil Diambil
          </Text>
          <Text className="text-sm text-gray-500 text-center max-w-xs mb-8">
            Terima kasih telah berkontribusi mengurangi food waste. Setiap
            pesanan yang kamu ambil membantu menyelamatkan makanan dari
            tempat pembuangan.
          </Text>

          {/* Action buttons */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={() => router.replace('/')}
              className="bg-primary py-3.5 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Cari Makanan Lagi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/orders')}
              className="border-2 border-primary py-3.5 rounded-xl"
            >
              <Text className="text-primary text-center font-semibold">
                Lihat Riwayat Pesanan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setReviewProductName(productName);
                setShowReviewModal(true);
              }}
              className="bg-secondary py-3.5 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Tulis Ulasan
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ReviewModal
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          orderId={order.id}
          productName={reviewProductName}
        />
      </View>
    );
  }

  const handlePickupCompleted = () => {
    setShowConfirm(false);
    doConfirmPickup(
      { id: order.id, pickupCode: order.pickupCode },
      {
        onSuccess: () => setShowSuccessScreen(true),
        onError: (err: any) => {
          const code = err?.code;
          if (code === 'INVALID_PICKUP_CODE') showToast('Kode pickup tidak sesuai');
          else if (code === 'PICKUP_EXPIRED') showToast('Kode pickup sudah kadaluarsa');
          else showToast('Gagal memverifikasi pickup');
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-background">
      <Header title="Konfirmasi Pesanan" onBack={handleBack} />
      <ScrollView className="flex-1">
        <View className="bg-primary p-6 items-center">
          <MaterialCommunityIcons name="check-circle" size={64} color="white" />
          <Text className="text-white text-lg font-bold mt-2">Pesanan Berhasil!</Text>
          <Text className="text-white/80 text-sm">Tunjukkan kode ini ke mitra</Text>
        </View>

        <View className="bg-white mx-4 -mt-4 rounded-xl p-6 items-center border border-gray-100 shadow-md">
          <Text className="text-sm text-gray-500 mb-1">Kode Pickup</Text>
          <Text className="text-2xl font-bold tracking-widest text-primary">
            {order.pickupCode || 'LAST-XXXX'}
          </Text>
        </View>

        <View className="mx-4 mt-4 bg-destructive/5 rounded-xl p-4 items-center">
          <Text className="text-sm text-destructive mb-2">Waktu Tersisa</Text>
          <CountdownTimer expiresAt={pickupExpiresAt} />
        </View>

        <View className="mx-4 mt-4">
          <Text className="text-lg font-bold mb-3">Detail Pesanan</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100">
            {order.items?.map((item: any) => (
              <View key={item.id} className="flex-row justify-between py-2 border-b border-gray-50">
                <Text className="text-sm text-gray-700 flex-1">{item.name} x{item.quantity}</Text>
                <Text className="text-sm font-medium">Rp{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}
            <View className="flex-row justify-between pt-3 mt-1 border-t border-gray-200">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-primary">Rp{(order.total || 0).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={() => setShowConfirm(true)}
            className="bg-primary py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Saya Sudah Mengambil Pesanan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Konfirmasi Pengambilan"
        description={`Apakah kamu sudah menerima pesanan dari ${order.storeName}?`}
        confirmLabel="Ya, Saya Sudah Ambil"
        onConfirm={handlePickupCompleted}
        loading={isPending}
      />
    </View>
  );
}
