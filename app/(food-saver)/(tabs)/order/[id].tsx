import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrder, useConfirmPickup, useCancelExpired } from '@/hooks/useOrders';
import { useBackHandler } from '@/hooks/useBackHandler';
import { Header } from '@/components/Header';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReviewModal } from '@/components/ReviewModal';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { useToast } from '@/contexts/ToastContext';
import { colors } from '@/theme';

export default function OrderDetailScreen() {
  const { id, justChecked, fromScreen } = useLocalSearchParams<{ id: string; justChecked?: string; fromScreen?: string }>();
  const { data: orderData, isLoading, isError } = useOrder(id);
  const { mutate: doConfirmPickup, isPending } = useConfirmPickup();
  const { mutate: doCancelExpired } = useCancelExpired();
  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessAfterCheckout, setShowSuccessAfterCheckout] = useState(
    justChecked === 'true'
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductName, setReviewProductName] = useState('');

  // Hardware back & header back → navigate to fromScreen or /orders
  const handleBack = useCallback(() => {
    if (fromScreen) {
      router.navigate(fromScreen as any);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/orders');
    }
  }, [fromScreen]);
  useBackHandler(handleBack);

  // Derive values at top level so all hooks are before early returns
  const order = orderData?.order;
  const isPickedUp = order?.status === 'PICKED_UP';
  const isCancelled = order?.status === 'CANCELLED';
  const isFinal = isPickedUp || isCancelled;
  const pickupExpiresAt = order?.pickupExpiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const isExpired = !isFinal && new Date() > new Date(pickupExpiresAt);

  // Auto-cancel expired order when order detail screen loads
  useEffect(() => {
    if (isExpired && order) {
      doCancelExpired(order.id, {
        onSuccess: () => showToast('Pesanan dibatalkan karena kode kedaluwarsa'),
        onError: (err: any) => {
          // Silent for race conditions (mitra already cancelled/picked-up)
          if (err?.code !== 'INVALID_STATUS' && err?.code !== 'ORDER_NOT_FOUND') {
            console.warn('Auto-cancel expired order failed:', err);
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpired, order?.id]);

  // --- EARLY EXIT: loading state ---
  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-2">Memuat pesanan...</Text>
      </View>
    );
  }

  // --- EARLY EXIT: not found ---
  if (isError || !orderData?.order) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.destructive} />
        <Text className="text-red-500 text-center mt-2">Pesanan tidak ditemukan</Text>
      </View>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleReview = (productName: string) => {
    setReviewProductName(productName);
    setShowReviewModal(true);
  };

  const handlePickup = () => {
    setShowConfirm(true);
  };

  const handlePickupCompleted = () => {
    setShowConfirm(false);
    doConfirmPickup(
      { id: order.id, pickupCode: order.pickupCode },
      {
        onSuccess: () => {
          // Update local state to reflect PICKED_UP
          showToast('Pesanan berhasil diambil!');
        },
        onError: (err: any) => {
          const code = err?.code;
          if (code === 'INVALID_PICKUP_CODE') showToast('Kode pickup tidak sesuai');
          else if (code === 'PICKUP_EXPIRED') showToast('Kode pickup sudah kadaluarsa');
          else showToast('Gagal memverifikasi pickup');
        },
      }
    );
  };

  // --- SUCCESS STATE (first-time post-checkout) ---
  if (showSuccessAfterCheckout) {
    const productName = order.items?.[0]?.name || 'Produk';

    return (
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
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

  // --- NORMAL PICKUP/DETAIL STATE ---
  return (
    <View className="flex-1 bg-background">
      <Header title="Detail Pesanan" onBack={handleBack} fallbackHref={fromScreen || '/orders'} />
      <ScrollView className="flex-1">
        {/* Hero section (only for active non-expired orders) */}
        {!isFinal && !isExpired && (
          <View className="bg-primary p-6 items-center">
            <MaterialCommunityIcons name="check-circle" size={64} color="white" />
            <Text className="text-white text-lg font-bold mt-2">Pesanan Berhasil!</Text>
            <Text className="text-white/80 text-sm">Tunjukkan kode ini ke mitra</Text>
          </View>
        )}

        {/* Pickup code card */}
        <View className={`bg-white mx-4 rounded-xl p-6 items-center border border-gray-100 shadow-md ${isFinal ? 'mt-4' : '-mt-4'}`}>
          <Text className="text-sm text-gray-500 mb-1">Kode Pickup</Text>
          <Text className="text-2xl font-bold tracking-widest text-primary">
            {order.pickupCode || 'LAST-XXXX'}
          </Text>
          {/* Order date shown here */}
          <Text className="text-xs text-gray-400 mt-2">
            {formatDate(order.createdAt)}
          </Text>
        </View>

        {/* Status badge for finalised orders */}
        {isFinal && (
          <View className="mx-4 mt-4 flex-row items-center">
            <OrderStatusBadge status={order.status} size="md" />
          </View>
        )}

        {/* Countdown timer or expired message */}
        {!isFinal && (
          <View className={`mx-4 mt-4 rounded-xl p-4 items-center ${isExpired ? 'bg-red-50' : 'bg-destructive/5'}`}>
            {isExpired ? (
              <Text className="text-sm text-red-700 text-center">
                Pesanan sudah melewati waktu pengambilan, silakan buat pesanan baru
              </Text>
            ) : (
              <>
                <Text className="text-sm text-destructive mb-2">Waktu Tersisa</Text>
                <CountdownTimer expiresAt={pickupExpiresAt} />
              </>
            )}
          </View>
        )}

        {/* Order details */}
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
            {order.savingAmount > 0 && (
              <View className="flex-row justify-between pt-1">
                <Text className="text-gray-600">Kamu Hemat</Text>
                <Text className="font-semibold text-green-600">
                  Rp{order.savingAmount.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Pickup button (only for active non-expired orders) */}
        {!isFinal && !isExpired && (
          <View className="px-4 mt-6 mb-8">
            <TouchableOpacity
              onPress={handlePickup}
              className="bg-primary py-4 rounded-xl"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Saya Sudah Mengambil Pesanan
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Review button (PICKED_UP only) */}
        {isPickedUp && !order.hasReviewed && (
          <View className="mx-4 mt-6 mb-8">
            <TouchableOpacity
              onPress={() => handleReview(order.items?.[0]?.name || 'Produk')}
              className="bg-secondary py-3.5 rounded-xl"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Tulis Ulasan
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>

      {/* Confirm pickup dialog */}
      <ConfirmDialog
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Konfirmasi Pengambilan"
        description={`Apakah kamu sudah menerima pesanan dari ${order.storeName}?`}
        confirmLabel="Ya, Saya Sudah Ambil"
        onConfirm={handlePickupCompleted}
        loading={isPending}
      />

      {/* Review modal */}
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={order.id}
        productName={reviewProductName}
      />
    </View>
  );
}
