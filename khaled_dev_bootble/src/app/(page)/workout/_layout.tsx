import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="session" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
