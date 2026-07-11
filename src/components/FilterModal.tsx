import { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

export interface FilterState {
  maxDistance: number;
  maxPrice: number;
  expiry: 'Hari Ini' | '< 1 Jam' | '< 3 Jam' | '< 6 Jam';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

const DISTANCE_OPTIONS = [1, 3, 5, 10, 0];
const PRICE_OPTIONS = [10000, 15000, 25000, 50000, 0];
const EXPIRY_OPTIONS: { key: FilterState['expiry']; label: string }[] = [
  { key: 'Hari Ini', label: 'Hari Ini' },
  { key: '< 1 Jam', label: '< 1 Jam' },
  { key: '< 3 Jam', label: '< 3 Jam' },
  { key: '< 6 Jam', label: '< 6 Jam' },
];

function OptionPills({
  options,
  selected,
  onSelect,
  formatLabel,
}: {
  options: number[];
  selected: number;
  onSelect: (v: number) => void;
  formatLabel: (v: number) => string;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((v) => (
        <TouchableOpacity
          key={v}
          onPress={() => onSelect(v)}
          className={`px-3 py-1.5 rounded-full ${
            selected === v ? 'bg-primary' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selected === v ? 'text-white' : 'text-gray-600'
            }`}
          >
            {formatLabel(v)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [draft, setDraft] = useState<FilterState>(filters);

  // Sync visible prop with BottomSheetModal imperative API
  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  // Sync draft filters when parent changes them externally
  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(draft);
    sheetRef.current?.dismiss();
  };

  const handleReset = () => {
    const reset: FilterState = { maxDistance: 0, maxPrice: 0, expiry: 'Hari Ini' };
    setDraft(reset);
    onApply(reset);
    sheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={['65%']}
      enablePanDownToClose
      onDismiss={onClose}
    >
      <BottomSheetView className="px-4 pb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Filter</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-primary text-sm font-medium">Reset</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm font-semibold mb-2">Jarak Maksimal</Text>
        <OptionPills
          options={DISTANCE_OPTIONS}
          selected={draft.maxDistance}
          onSelect={(v) => setDraft({ ...draft, maxDistance: v })}
          formatLabel={(v) => (v === 0 ? 'Tidak terbatas' : `${v} km`)}
        />

        <View className="h-px bg-gray-200 my-4" />

        <Text className="text-sm font-semibold mb-2">Harga Maksimal</Text>
        <OptionPills
          options={PRICE_OPTIONS}
          selected={draft.maxPrice}
          onSelect={(v) => setDraft({ ...draft, maxPrice: v })}
          formatLabel={(v) => (v === 0 ? 'Tidak terbatas' : `Rp${v.toLocaleString('id')}`)}
        />

        <View className="h-px bg-gray-200 my-4" />

        <Text className="text-sm font-semibold mb-2">Kedaluwarsa</Text>
        <View className="flex-row flex-wrap gap-2">
          {EXPIRY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setDraft({ ...draft, expiry: opt.key })}
              className={`px-3 py-1.5 rounded-full ${
                draft.expiry === opt.key ? 'bg-primary' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  draft.expiry === opt.key ? 'text-white' : 'text-gray-600'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleApply}
          className="bg-primary py-3 rounded-xl mt-6"
        >
          <Text className="text-white text-center font-semibold">Terapkan</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
