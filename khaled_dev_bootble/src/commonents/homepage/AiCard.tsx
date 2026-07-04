import { Images } from "@/assets/extra/images";
import { robolt } from "@/assets/icon";
import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";

const AiCard = () => {
  return (
    <View className="my-5">
      <LinearGradient
        colors={["#9F8CFF", "#7FE6F3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",

          borderRadius: 16,
          overflow: "hidden",
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <View className="flex-row  px-5 ">
          {/* LEFT CONTENT */}
          <View className="flex-1 pr-[3%]">
            {/* Header */}
            <View className="flex-row items-center gap-3">
              <View className="bg-[#EBE9FF] w-[44px] h-[44px] rounded-full justify-center items-center">
                <SvgXml xml={robolt} width={22} height={22} color={"#121030"} />
              </View>

              <Text className="text-[#121030] font-JosefinSansBold text-[20px]">
                Shift-Aware AI
              </Text>
            </View>

            {/* Description */}
            <Text className="mt-[2%] text-[#2F2F2F] font-JosefinSansMedium text-base leading-[18px] max-w-[100%]">
              Your AI adapts workouts, recovery protocols, and sleep
              recommendations around your rotating shifts.
            </Text>

            {/* Tags */}
            <View className="flex-row gap-[2%] mt-[3%]">
              <TouchableOpacity className="border border-[#0C123433] rounded-full px-4 py-[6px] bg-white/30">
                <Text className="font-JosefinSansMedium text-base text-[#0C1234CC]">
                  Shift-synced timing
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-[#0C123433] rounded-full px-4 py-[6px] bg-white/30">
                <Text className="font-JosefinSansMedium text-base text-[#0C1234CC]">
                  Fatigue
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT IMAGE */}
          <View className="justify-center items-end">
            <Image
              source={Images.gpt}
              resizeMode="contain"
              style={{
                width: responsive.scale(95),
                height: responsive.verticalScale(120),
                transform: [{ translateY: -6 }],
              }}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default AiCard;
