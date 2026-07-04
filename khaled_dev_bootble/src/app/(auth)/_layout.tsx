import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="signup" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="forgot" />
      <Stack.Screen name="changepassword" />
      <Stack.Screen name="varify" />
    </Stack>
  );
};

export default _layout;
