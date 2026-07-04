import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="shiftSelection" options={{ headerShown: false }} />
      <Stack.Screen name="goalsection" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
