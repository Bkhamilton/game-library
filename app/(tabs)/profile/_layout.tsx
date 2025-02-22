import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="profilePage" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: 'card', animation: 'slide_from_right', headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ presentation: 'card', animation: 'slide_from_right', headerShown: false }} />
    </Stack>
  );
}