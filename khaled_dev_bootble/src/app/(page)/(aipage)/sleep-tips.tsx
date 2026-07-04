import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetSleepTipsQuery } from "@/src/redux/page/aiApi";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

const scale = (size: number) => {
  const baseWidth = 375;
  return (screenWidth / baseWidth) * size;
};

const getImageSize = () => {
  if (screenWidth < 375) return { width: scale(140), height: scale(140) };
  else if (screenWidth < 414) return { width: scale(160), height: scale(160) };
  else if (screenWidth < 768) return { width: scale(180), height: scale(180) };
  else return { width: scale(220), height: scale(220) };
};

const Sleep_tips = () => {
  const [imageSize] = useState(getImageSize());
  const [scheduled, setScheduled] = useState(false);

  const {
    data: aiSleepTipsData,
    isLoading,
  } = useGetSleepTipsQuery(undefined);
  
  const sleepData = aiSleepTipsData?.data;

  if (isLoading || !sleepData) {
    return <SkeletonLoader />;
  }

  const { behavioral, shiftSpecific, universal } = sleepData.categories || { behavioral: [], shiftSpecific: [], universal: [] };
  const actions = sleepData.actions || [];

  const handleAction = (action: string) => {
    if (action === "log_sleep") {
      router.push("/(tabs)/sleeprecovery");
    } else if (action === "schedule_wind_down") {
      setScheduled(true);
      setTimeout(() => setScheduled(false), 3000);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="px-[5%] flex-row justify-between items-center py-4 mb-2 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[38] h-[38] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center"
          >
            <FontAwesome6 name="arrow-left" size={scale(18)} color="#A895FF" />
          </TouchableOpacity>
          <Text className="text-center font-JosefinSansSemiBold text-[#FFFFFF]" style={{ fontSize: scale(24) }}>
            Sleep Coaching
          </Text>
          <View className="w-[38]" />
        </View>

        {/* Image Section */}
        <View className="absolute inset-0 flex-1 items-center justify-center opacity-20">
          <Image source={Images.gpt} resizeMode="contain" style={imageSize} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-[5%]">
          
          {/* Title Card */}
          <View className="bg-[#A895FF]/20 rounded-2xl p-6 mb-6 border border-[#A895FF]/30 mt-4">
            <Text className="text-center text-white font-JosefinSansBold mb-2" style={{ fontSize: scale(24) }}>
              {sleepData.title}
            </Text>
            <Text className="text-center text-white/80 font-JosefinSansRegular" style={{ fontSize: scale(14) }}>
              Personalized recovery strategies based on your logs and {sleepData.shiftContext.replace('_', ' ')} shift pattern.
            </Text>
          </View>

          {/* 1. Behavioral Insights */}
          {behavioral && behavioral.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mr-3">
                  <FontAwesome6 name="bolt" size={scale(16)} color="#FF6B6B" />
                </View>
                <Text className="text-white font-JosefinSansSemiBold text-xl">Behavioral Insights</Text>
              </View>

              {behavioral.map((insight: any, idx: number) => (
                <View key={idx} className="bg-red-500/10 rounded-xl p-5 mb-3 border border-red-500/30">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="warning" size={18} color="#FF6B6B" />
                    <Text className="text-red-400 font-JosefinSansBold text-base ml-2">{insight.title}</Text>
                  </View>
                  <Text className="text-white/90 font-JosefinSansRegular leading-6">{insight.message}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 2. Shift Strategy */}
          {shiftSpecific && shiftSpecific.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-[#4ECDC4]/20 rounded-full items-center justify-center mr-3">
                  <FontAwesome6 name="clock" size={scale(16)} color="#4ECDC4" />
                </View>
                <Text className="text-white font-JosefinSansSemiBold text-xl">Shift Strategy</Text>
              </View>

              {shiftSpecific.map((tip: string, idx: number) => (
                <View key={idx} className="bg-[#4ECDC4]/10 rounded-xl p-4 mb-2 border border-[#4ECDC4]/20 flex-row">
                  <View className="w-6 h-6 bg-[#4ECDC4]/20 rounded-full items-center justify-center mr-3">
                    <Text className="text-[#4ECDC4] font-JosefinSansBold text-xs">{idx + 1}</Text>
                  </View>
                  <Text className="text-white/90 font-JosefinSansRegular flex-1 pt-0.5">{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 3. Universal Habits */}
          {universal && universal.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mr-3">
                  <FontAwesome6 name="check-double" size={scale(16)} color="#A895FF" />
                </View>
                <Text className="text-white font-JosefinSansSemiBold text-xl">Universal Habits</Text>
              </View>

              {universal.map((tip: string, idx: number) => (
                <View key={idx} className="bg-white/5 rounded-xl p-4 mb-2 border border-white/10 flex-row">
                  <View className="w-2 h-2 bg-white/40 rounded-full mt-2 mr-3" />
                  <Text className="text-white/70 font-JosefinSansRegular flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Section */}
          <View className="bg-gradient-to-r from-[#A895FF]/20 to-blue-500/20 rounded-2xl p-6 mb-10 border border-[#A895FF]/30 mt-4">
            <Text className="text-center text-white font-JosefinSansBold mb-6 text-xl">Take Action Now</Text>
            
            <View className="gap-y-3">
              {actions.includes('log_sleep') && (
                <TouchableOpacity
                  onPress={() => handleAction('log_sleep')}
                  className="bg-[#A895FF] rounded-xl py-4 items-center flex-row justify-center"
                  activeOpacity={0.8}
                >
                  <Ionicons name="journal-outline" size={20} color="white" />
                  <Text className="text-white font-JosefinSansSemiBold text-lg ml-2">Log Sleep Period</Text>
                </TouchableOpacity>
              )}

              {actions.includes('schedule_wind_down') && (
                <TouchableOpacity
                  onPress={() => handleAction('schedule_wind_down')}
                  className={`border border-[#A895FF] rounded-xl py-4 items-center flex-row justify-center ${scheduled ? 'bg-[#4ECDC4]/20 border-[#4ECDC4]' : 'bg-transparent'}`}
                  activeOpacity={0.8}
                >
                  <Ionicons name={scheduled ? "checkmark-circle" : "alarm-outline"} size={20} color={scheduled ? "#4ECDC4" : "#A895FF"} />
                  <Text className="font-JosefinSansSemiBold text-lg ml-2" style={{ color: scheduled ? "#4ECDC4" : "#A895FF" }}>
                    {scheduled ? "Reminder Set for 90m Before Bed" : "Enable Wind-Down Reminder"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Sleep_tips;
