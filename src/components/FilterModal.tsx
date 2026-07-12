import { useState, useEffect, useRef } from 'react';
import {
	Animated,
	Pressable,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	BackHandler,
	StyleSheet,
	Dimensions,
} from 'react-native';

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
					}`}>
					<Text
						className={`text-sm font-medium ${
							selected === v ? 'text-white' : 'text-gray-600'
						}`}>
						{formatLabel(v)}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

export function FilterModal({
	visible,
	onClose,
	filters,
	onApply,
}: FilterModalProps) {
	const [draft, setDraft] = useState<FilterState>(filters);
	const [mounted, setMounted] = useState(visible);
	const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
	const sheetTranslateY = useRef(
		new Animated.Value(visible ? 0 : Dimensions.get('window').height * 0.5),
	).current;

	// Animate fade in + slide up (parallel)
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

	// Sync draft filters when parent changes them externally
	useEffect(() => {
		setDraft(filters);
	}, [filters]);

	// Android back button closes the modal
	useEffect(() => {
		if (!visible) return;
		const onBackPress = () => {
			onClose();
			return true;
		};
		const subscription = BackHandler.addEventListener(
			'hardwareBackPress',
			onBackPress,
		);
		return () => {
			if (subscription && typeof subscription.remove === 'function') {
				subscription.remove();
			}
		};
	}, [visible, onClose]);

	const handleApply = () => {
		onApply(draft);
		onClose();
	};

	const handleReset = () => {
		const reset: FilterState = {
			maxDistance: 0,
			maxPrice: 0,
			expiry: 'Hari Ini',
		};
		setDraft(reset);
		onApply(reset);
		onClose();
	};

	if (!mounted) return null;

	return (
		<Animated.View
			pointerEvents={visible ? 'auto' : 'none'}
			testID="filter-overlay"
			style={[
				StyleSheet.absoluteFill,
				{ zIndex: 50, justifyContent: 'flex-end' },
			]}>
			{/* Backdrop with fade animation (independent of sheet) */}
			<Animated.View
				testID="filter-backdrop-animated"
				style={[
					StyleSheet.absoluteFill,
					{ opacity, backgroundColor: 'rgba(0,0,0,0.5)' },
				]}>
				<Pressable
					testID="filter-backdrop"
					onPress={onClose}
					style={StyleSheet.absoluteFill}
				/>
			</Animated.View>
			{/* Sheet with slide animation (independent of backdrop) */}
			<Animated.View
				testID="filter-sheet-animated"
				style={[
					{ height: '50%' },
					{ transform: [{ translateY: sheetTranslateY }] },
				]}>
				<Pressable
					onPress={() => {}}
					testID="filter-sheet"
					className="bg-white rounded-t-3xl px-4 pt-4 pb-4"
					style={{ flex: 1 }}>
						{/* Header */}
						<View className="flex-row justify-between items-center mb-4">
							<Text className="text-lg font-bold">Filter</Text>
							<TouchableOpacity onPress={handleReset}>
								<Text className="text-primary text-sm font-medium">
									Reset
								</Text>
							</TouchableOpacity>
						</View>

						<ScrollView
							bounces={false}
							showsVerticalScrollIndicator={false}
							className="flex-1">
							<Text className="text-sm font-semibold mb-2">
								Jarak Maksimal
							</Text>
							<OptionPills
								options={DISTANCE_OPTIONS}
								selected={draft.maxDistance}
								onSelect={(v) =>
									setDraft({ ...draft, maxDistance: v })
								}
								formatLabel={(v) =>
									v === 0 ? 'Tidak terbatas' : `${v} km`
								}
							/>

							<View className="h-px bg-gray-200 my-4" />

							<Text className="text-sm font-semibold mb-2">
								Harga Maksimal
							</Text>
							<OptionPills
								options={PRICE_OPTIONS}
								selected={draft.maxPrice}
								onSelect={(v) =>
									setDraft({ ...draft, maxPrice: v })
								}
								formatLabel={(v) =>
									v === 0
										? 'Tidak terbatas'
										: `Rp${v.toLocaleString('id')}`
								}
							/>

							<View className="h-px bg-gray-200 my-4" />

							<Text className="text-sm font-semibold mb-2">
								Kedaluwarsa
							</Text>
							<View className="flex-row flex-wrap gap-2">
								{EXPIRY_OPTIONS.map((opt) => (
									<TouchableOpacity
										key={opt.key}
										onPress={() =>
											setDraft({
												...draft,
												expiry: opt.key,
											})
										}
										className={`px-3 py-1.5 rounded-full ${
											draft.expiry === opt.key
												? 'bg-primary'
												: 'bg-gray-100'
										}`}>
										<Text
											className={`text-sm font-medium ${
												draft.expiry === opt.key
													? 'text-white'
													: 'text-gray-600'
											}`}>
											{opt.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</ScrollView>

						{/* Sticky footer with Terapkan button */}
						<View className="pt-3 border-t border-gray-200">
							<TouchableOpacity
								onPress={handleApply}
								className="bg-primary py-3 rounded-xl">
								<Text className="text-white text-center font-semibold">
									Terapkan
								</Text>
							</TouchableOpacity>
						</View>
				</Pressable>
		</Animated.View>
		</Animated.View>
	);
}
