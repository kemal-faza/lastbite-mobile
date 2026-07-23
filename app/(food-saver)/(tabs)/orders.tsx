import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { EmptyState } from '@/components/EmptyState';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { getImageVariants } from '@/lib/api/products';
export default function OrdersScreen() {
	const { isAuthenticated } = useAuthStore();
	const { data, refetch } = useOrders(isAuthenticated);
	useRefreshOnFocus(refetch);

	if (!isAuthenticated) {
		return (
			<View className="flex-1 bg-background justify-center items-center px-4">
				<EmptyState
					icon="clipboard-list-outline"
					title="Login untuk melihat pesanan"
					description="Riwayat pesanan akan muncul di sini"
					action={
						<PrimaryButton
							onPress={() => router.push({ pathname: '/login', params: { returnUrl: '/(food-saver)/(tabs)/orders' } })}>
							Masuk
						</PrimaryButton>
					}
				/>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-background">
			<View className="flex-1 p-4">
				<Text className="text-xl font-bold text-primary mb-4">
					Pesanan Saya
				</Text>
				<FlatList
					data={data?.orders}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ flexGrow: 1 }}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center">
							<EmptyState
								icon="package-variant-closed"
								title="Belum ada pesanan"
								description="Pesananmu akan muncul setelah kamu checkout"
							/>
						</View>
					}
					renderItem={({ item }) => {
						const firstItem = item.items?.[0];
						return (
							<TouchableOpacity
								className="bg-white p-3 rounded-xl mb-2 flex-row items-center"
								onPress={() => router.push(`/order/${item.id}`)}
								activeOpacity={0.7}
							>
								{firstItem && (
									<View className="mr-3">
										<Image
											source={
												getImageVariants(
													firstItem.imageVariants,
												)?.thumb
													? {
															uri: getImageVariants(
																firstItem.imageVariants,
															)!.thumb,
														}
													: require('@/assets/placeholder.png')
											}
											contentFit="cover"
											style={{
												width: 64,
												height: 64,
												borderRadius: 8,
												backgroundColor: '#e5e7eb',
											}}
										/>
									</View>
								)}
								<View className="flex-1 mr-2">
									<Text className="font-bold">{item.storeName}</Text>
									<Text>Total: Rp{item.total.toLocaleString()}</Text>
								</View>
								<View className="items-end">
									<OrderStatusBadge status={item.status} size="sm" />
									<Text className="text-gray-400 text-xs mt-1">
										{item.pickupCode}
									</Text>
								</View>
							</TouchableOpacity>
						);
					}}
				/>
			</View>
		</View>
	);
}
