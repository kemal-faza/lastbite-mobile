import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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

  const { mutateAsync: createReview, isPending } = useCreateReview();
  const { showToast } = useToast();

  useEffect(() => {
    if (visible) {
      setRating(0);
      setComment('');
      setError(null);
    }
  }, [visible]);

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="bg-background rounded-t-2xl p-6"
          >
            <View className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
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
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}
