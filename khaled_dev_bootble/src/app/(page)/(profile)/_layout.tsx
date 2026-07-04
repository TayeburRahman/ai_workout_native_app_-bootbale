import { Stack } from "expo-router";
import React from "react";
//
const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="tearcondition" />
      <Stack.Screen name="policy" />
      <Stack.Screen name="gptassistant" />
      <Stack.Screen name="subcription" />
      <Stack.Screen name="persionalinformation" />

      <Stack.Screen name="editprofile" />
      <Stack.Screen name="contactSupport" />
      <Stack.Screen name="faqs" />
    </Stack>
  );
};

export default _layout;
