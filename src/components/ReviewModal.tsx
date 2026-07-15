import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateReview } from '@/hooks/useReviews';
import { useToast } from '@/contexts/ToastContext';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  productName: string;
}

const MAX_COMMENT_LENGTH = 1000;

export function ReviewModal({
  visible,
  onClose,
  orderId,
  productName,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(visible);
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const sheetTranslateY = useRef(
    new Animated.Value(visible ? 0 : Dimensions.get('window').height * 0.5),
  ).current;

  const { mutateAsync: createReview, isPending } = useCreateReview();
  const { showToast } = useToast();

  // Animate fade in + slide up (parallel, same pattern as FilterModal)
  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: Dimensions.get('window').height * 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible, opacity, sheetTranslateY]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setRating(0);
      setComment('');
      setError(null);
    }
  }, [visible]);

  // Android back button closes the modal
  useEffect(() => {
    if (!visible) return;
    const onBackPress = () => {
      handleClose();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, onClose]);

  const handleSubmit = async () => {
    setError(null);

    if (rating === 0) {
      setError('Harap pilih rating terlebih dahulu');
      return;
    }

    try {
      await createReview({ orderId, rating, comment: comment || undefined });
      showToast('Ulasan berhasil dikirim!');
      setRating(0);
      setComment('');
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Gagal mengirim ulasan';
      setError(message);
      showToast(message);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setError(null);
    onClose();
  };

  const ratingHint =
    rating === 0
      ? 'Ketuk bintang untuk memberi rating'
      : `Rating kamu: ${rating} bintang`;

  const isSubmitDisabled = rating === 0 || isPending;

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      testID="review-overlay"
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 50, justifyContent: 'flex-end' },
      ]}>
      {/* Backdrop with fade animation */}
      <Animated.View
        testID="review-backdrop-animated"
        style={[
          StyleSheet.absoluteFill,
          { opacity, backgroundColor: 'rgba(0,0,0,0.5)' },
        ]}>
        <Pressable
          testID="review-backdrop"
          onPress={handleClose}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      {/* Sheet with slide animation */}
      <Animated.View
        testID="review-sheet-animated"
        style={[
          { transform: [{ translateY: sheetTranslateY }] },
        ]}>
        <Pressable
          onPress={() => {}}
          testID="review-sheet"
          className="bg-white rounded-t-3xl px-4 pt-4 pb-4"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Text className="text-xl font-bold text-center mb-1">
              Tulis Ulasan
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              {productName}
            </Text>

            <View className="flex-row justify-center mb-4" testID="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  className="px-1"
                  testID={`star-${star}`}
                >
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={36}
                    color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm text-gray-500 text-center mb-4">
              {ratingHint}
            </Text>

            <View className="mb-4">
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base min-h-[100px]"
                placeholder="Tulis komentar (opsional)"
                placeholderTextColor="#9CA3AF"
                multiline
                value={comment}
                onChangeText={(text) => {
                  if (text.length <= MAX_COMMENT_LENGTH) {
                    setComment(text);
                  }
                }}
                textAlignVertical="top"
              />
              <Text className="text-xs text-gray-400 text-right mt-1">
                {comment.length}/{MAX_COMMENT_LENGTH}
              </Text>
            </View>

            {error && (
              <Text className="text-red-500 text-sm text-center mb-4">
                {error}
              </Text>
            )}

            <TouchableOpacity
              className={`py-3 rounded-xl ${
                isSubmitDisabled ? 'bg-gray-300' : 'bg-primary'
              }`}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              testID="submit-review"
            >
              <Text
                className={`text-center font-semibold text-base ${
                  isSubmitDisabled ? 'text-gray-500' : 'text-white'
                }`}
              >
                {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
