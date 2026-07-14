import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrder } from '@/hooks/useOrders';
import { getImageVariants } from '@/lib/api/products';
import { ReviewModal } from '@/components/ReviewModal';
import { colors } from '@/theme';
import type { OrderItem } from '@/lib/api/orders';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: orderData, isLoading, isError } = useOrder(id);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductName, setReviewProductName] = useState('');

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
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color={colors.destructive}
        />
        <Text className="text-red-500 text-center mt-2">
          Pesanan tidak ditemukan
        </Text>
      </View>
    );
  }

  const order = orderData.order;
  const isPickedUp = order.status === 'PICKED_UP';
  const isCancelled = order.status === 'CANCELLED';

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

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Status Badge */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold">Status Pesanan</Text>
          <View
            className={`px-3 py-1 rounded-full ${
              isPickedUp ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isPickedUp ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {isPickedUp ? 'Selesai' : 'Dibatalkan'}
            </Text>
          </View>
        </View>

        {/* Pickup Code */}
        {isPickedUp && (
          <View className="mb-2">
            <Text className="text-sm text-gray-500">Kode Pickup</Text>
            <Text className="text-lg font-bold tracking-widest text-primary">
              {order.pickupCode}
            </Text>
          </View>
        )}

        {/* Order Date */}
        <View>
          <Text className="text-sm text-gray-500">Tanggal Pesanan</Text>
          <Text className="text-base font-medium">
            {formatDate(order.createdAt)}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
        <Text className="text-lg font-bold mb-3">Item Pesanan</Text>
        {order.items?.map((item: OrderItem) => (
          <View
            key={item.id}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <View className="mr-3">
              <Image
                source={
                  getImageVariants(item.imageVariants)?.thumb
                    ? {
                        uri: getImageVariants(item.imageVariants)!.thumb,
                      }
                    : require('@/assets/placeholder.png')
                }
                contentFit="cover"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  backgroundColor: '#e5e7eb',
                }}
              />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-xs text-gray-500">{item.storeName}</Text>
              <Text className="text-sm text-gray-700 mt-1">
                {item.quantity} x Rp{item.price.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total & Saving */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Total Pembayaran</Text>
          <Text className="font-bold text-lg">
            Rp{order.total.toLocaleString()}
          </Text>
        </View>
        {order.savingAmount > 0 && (
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Kamu Hemat</Text>
            <Text className="font-semibold text-green-600">
              Rp{order.savingAmount.toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* Review Button */}
      {isPickedUp && !order.hasReviewed && (
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={() =>
              handleReview(order.items?.[0]?.name || 'Produk')
            }
            className="bg-secondary py-3.5 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Tulis Ulasan
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={order.id}
        productName={reviewProductName}
      />
    </ScrollView>
  );
}
