import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getImageVariants, type Product } from '@/lib/api/products';
import { formatExpiry } from '@/lib/utils/formatExpiry';
import { formatDistance } from '@/lib/utils/formatDistance';
import { colors } from '@/theme';
import { WishlistHeart } from './WishlistHeart';

interface ProductCardProps {
  product: Product;
  className?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export function ProductCard({ product, className = '', isWishlisted, onToggleWishlist }: ProductCardProps) {
  const variants = getImageVariants(product.imageVariants);
  const imageSource = variants?.card
    ? { uri: variants.card }
    : require('@/assets/placeholder.png');

  const { expiresAt, discountPercent, distanceKm, stock } = product;
  const expiryLabel = expiresAt ? formatExpiry(expiresAt) : null;

  const handleProductPress = () => router.push(`/product/${product.id}`);

  return (
    <Pressable
      onPress={handleProductPress}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {/* Image with overlay badges */}
      <View className="relative w-full aspect-square bg-gray-200">
        <Image
          source={imageSource}
          contentFit="cover"
          transition={300}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Expiry pill — top-left */}
        {expiryLabel && (
          <View className="absolute top-1.5 left-1.5 flex-row items-center rounded-full px-2 py-0.5"
            style={{ backgroundColor: colors.secondary }}
          >
            <MaterialCommunityIcons name="clock-outline" size={9} color="#ffffff" />
            <Text className="text-white text-[10px] font-medium ml-0.5">
              {expiryLabel}
            </Text>
          </View>
        )}

        {/* Discount pill — top-right */}
        {discountPercent != null && discountPercent > 0 && (
          <View className="absolute top-1.5 right-1.5 rounded-full px-2 py-0.5"
            style={{ backgroundColor: colors.destructive }}
          >
            <Text className="text-white text-[10px] font-bold">
              -{discountPercent}%
            </Text>
          </View>
        )}

        {/* Heart — interactive toggle */}
        {onToggleWishlist ? (
          <Pressable
            testID="product-card-heart"
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleWishlist();
            }}
            className="absolute bottom-1.5 left-1.5 z-10"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View className="w-6 h-6 rounded-full bg-white/90 items-center justify-center">
              <WishlistHeart isWishlisted={!!isWishlisted} onToggle={() => {}} size={12} />
            </View>
          </Pressable>
        ) : (
          <View className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-white/90 items-center justify-center">
            <MaterialCommunityIcons name="heart-outline" size={12} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Card body */}
      <View className="p-2">
        <Text className="font-bold text-sm text-gray-900" numberOfLines={2}>
          {product.name}
        </Text>

        {/* Store name + distance */}
        <View className="flex-row items-center mt-0.5 flex-wrap">
          <MaterialCommunityIcons name="map-marker" size={9} color={colors.textSecondary} />
          <Text className="text-gray-500 text-[10px] ml-0.5" numberOfLines={1}>
            {product.storeName}
          </Text>
          {distanceKm != null && (
            <>
              <Text className="text-gray-300 text-[10px] mx-0.5">·</Text>
              <Text className="text-primary text-[10px] font-medium">
                {formatDistance(distanceKm)}
              </Text>
            </>
          )}
        </View>

        {/* Stock indicator */}
        {stock >= 0 && (
          <Text className="text-destructive text-[10px] mt-0.5">
            Sisa {stock} porsi
          </Text>
        )}

        {/* Price */}
        <View className="mt-1">
          <Text className="text-sm font-bold" style={{ color: colors.secondary }}>
            Rp{product.discountedPrice.toLocaleString()}
          </Text>
          {product.originalPrice > product.discountedPrice && (
            <Text className="text-gray-400 line-through text-[10px]">
              Rp{product.originalPrice.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
