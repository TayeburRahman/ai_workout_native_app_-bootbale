import GradientBackground from "@/src/commonents/background/GradientBackground";
import CalenderPage from "@/src/commonents/calender/CalenderPage";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const calender = () => {
  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="flex-1 px-[5%]">
          <ScrollView className="flex-1">
            <Text className="text-center font-JosefinSansSemiBold text-2xl text-[#FFFFFF]">
              Calendar
            </Text>
            <CalenderPage />
            <View className="h-48" />
          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default calender;
