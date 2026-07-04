import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import ChatScreen from "@/src/commonents/chat/ChatScreen";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const scale = (size: number) => {
  const baseWidth = 375;
  return (screenWidth / baseWidth) * size;
};
const getImageSize = () => {
  if (screenWidth < 375) {
    return {
      width: scale(140),
      height: scale(140),
    };
  } else if (screenWidth < 414) {
    return {
      width: scale(160),
      height: scale(160),
    };
  } else if (screenWidth < 768) {
    return {
      width: scale(180),
      height: scale(180),
    };
  } else {
    return {
      width: scale(220),
      height: scale(220),
    };
  }
};
const Ai_coach_chat = () => {
  const [imageSize, setImageSize] = useState(getImageSize());
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <View className="px-[5%] flex-row justify-between items-center py-4 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[38] h-[38] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center"
          >
            <FontAwesome6 name="arrow-left" size={scale(18)} color="#A895FF" />
          </TouchableOpacity>

          <Text
            className="text-center font-JosefinSansSemiBold text-[#FFFFFF]"
            style={{ fontSize: scale(24) }}
          >
            Bootsy
          </Text>
          <View className="w-[38]" />
        </View>

        <View className=" absolute inset-0 flex-1 items-center justify-center">
          {/* Main Image */}
          <Image
            source={Images.gpt}
            resizeMode="contain"
            style={imageSize}
            className=""
          />
          <View className="bg-[#1c154cb6] absolute inset-0" />
        </View>

        {/* screen */}
        <ChatScreen />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Ai_coach_chat;
