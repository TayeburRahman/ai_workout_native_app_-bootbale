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
      <Stack.Screen name="ai-suggestions" />
      <Stack.Screen name="sleep-tips" />
      <Stack.Screen name="workout-plan" />
      <Stack.Screen name="nutrition-advice" />
      <Stack.Screen name="progress-insights" />
      <Stack.Screen name="ai-coach-chat" />
    </Stack>
  );
};

export default _layout;
