import { Redirect, useLocalSearchParams } from 'expo-router';

export default function OrderConfirmRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/order/${id}`} />;
}
