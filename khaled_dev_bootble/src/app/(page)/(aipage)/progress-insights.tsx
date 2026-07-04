import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetProgressInsightsQuery } from "@/src/redux/page/aiApi";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const scale = (size: number) => {
  const baseWidth = 375;
  return (screenWidth / baseWidth) * size;
};

const getImageSize = () => {
  if (screenWidth < 375) {
    return {
      width: scale(100),
      height: scale(100),
    };
  } else if (screenWidth < 414) {
    return {
      width: scale(120),
      height: scale(120),
    };
  } else if (screenWidth < 768) {
    return {
      width: scale(140),
      height: scale(140),
    };
  } else {
    return {
      width: scale(180),
      height: scale(180),
    };
  }
};

const ProgressInsights = () => {
  const [imageSize, setImageSize] = useState(getImageSize());
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: progressInsightsData,
    isLoading,
    isError,
    refetch,
  } = useGetProgressInsightsQuery();

  useEffect(() => {
    const updateImageSize = () => {
      setImageSize(getImageSize());
    };
    return () => {};
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Mock data for preview (remove when API is connected)
  const mockData = {
    status: "success",
    data: {
      period: "week",
      summary: "Good consistency in workouts, could improve sleep quality",
      strengths: ["Workout frequency", "Nutrition tracking consistency"],
      areasForImprovement: ["Sleep duration", "Post-workout recovery"],
      nextSteps: [
        "Aim for 7+ hours of sleep nightly",
        "Add 1-2 active recovery sessions per week",
      ],
    },
  };

  const displayData = progressInsightsData || mockData;

  if (isLoading && !refreshing) {
    return <SkeletonLoader />;
  }

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
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
            Progress Insight
          </Text>

          <TouchableOpacity
            onPress={onRefresh}
            className="w-[38] h-[38] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center"
          >
            <Ionicons name="refresh" size={scale(18)} color="#A895FF" />
          </TouchableOpacity>
        </View>

        {/* Background Image */}
        <View className="absolute inset-0 flex-1 items-center justify-center opacity-20">
          <Image source={Images.gpt} resizeMode="contain" style={imageSize} />
        </View>

        {/* Main Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-[5%]"
          contentContainerStyle={{ paddingBottom: scale(30) }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#A895FF"
            />
          }
        >
          {/* Period Badge */}
          <View className="items-center mb-6 mt-2">
            <View className="bg-[#a895ff96] px-6 py-2 rounded-full">
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(14) }}
              >
                {displayData?.data?.period?.toUpperCase()} INSIGHTS
              </Text>
            </View>
          </View>

          {/* Summary Card */}
          <LinearGradient
            colors={["#2A1C5E", "#1A0F3E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24 }}
            className="rounded-3xl p-6 mb-6 border border-[#a895ff2d]"
          >
            <View className="flex-row items-start mb-3">
              <MaterialCommunityIcons
                name="robot"
                size={scale(28)}
                color="#A895FF"
              />
              <Text
                className="text-white font-JosefinSansBold ml-3"
                style={{ fontSize: scale(20) }}
              >
                AI Summary
              </Text>
            </View>
            <Text
              className="text-[#E0E0E0] font-JosefinSansRegular leading-6"
              style={{ fontSize: scale(16) }}
            >
              {displayData?.data?.summary}
            </Text>
          </LinearGradient>

          {/* Strengths Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-8 bg-[#4CAF50] rounded-full mr-3" />
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(20) }}
              >
                Strengths
              </Text>
            </View>

            {displayData?.data?.strengths?.map(
              (strength: string, index: number) => (
                <LinearGradient
                  key={`strength-${index}`}
                  colors={["#1e3a2f94", "#132a2071"]}
                  style={{ borderRadius: 16 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl p-4 mb-3  border border-[#4CAF5040]"
                >
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-[#4CAF50] rounded-full justify-center items-center mr-3">
                      <Ionicons
                        name="checkmark"
                        size={scale(20)}
                        color="white"
                      />
                    </View>
                    <Text
                      className="text-white font-JosefinSansMedium flex-1"
                      style={{ fontSize: scale(16) }}
                    >
                      {strength}
                    </Text>
                  </View>
                </LinearGradient>
              ),
            )}
          </View>

          {/* Areas for Improvement */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-8 bg-[#FF6B6B] rounded-full mr-3" />
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(20) }}
              >
                Areas for Improvement
              </Text>
            </View>

            {displayData?.data?.areasForImprovement?.map(
              (area: string, index: number) => (
                <LinearGradient
                  key={`area-${index}`}
                  colors={["#4a2c2c57", "#2a1a1a60"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 16 }}
                  className="rounded-2xl p-4 mb-3  border border-[#FF6B6B40]"
                >
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-[#FF6B6B] rounded-full justify-center items-center mr-3">
                      <Ionicons name="alert" size={scale(20)} color="white" />
                    </View>
                    <Text
                      className="text-white font-JosefinSansMedium flex-1"
                      style={{ fontSize: scale(16) }}
                    >
                      {area}
                    </Text>
                  </View>
                </LinearGradient>
              ),
            )}
          </View>

          {/* Next Steps */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-8 bg-[#A895FF] rounded-full mr-3" />
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(20) }}
              >
                Recommended Next Steps
              </Text>
            </View>

            {displayData?.data?.nextSteps?.map(
              (step: string, index: number) => (
                <LinearGradient
                  key={`step-${index}`}
                  colors={["#2a1c5e5d", "#1a0f3e57"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 16 }}
                  className="rounded-2xl p-4 mb-3  border border-[#A895FF40]"
                >
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-[#A895FF] rounded-full justify-center items-center mr-3">
                      <Text className="text-white font-JosefinSansBold">
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      className="text-white font-JosefinSansMedium flex-1"
                      style={{ fontSize: scale(16) }}
                    >
                      {step}
                    </Text>
                  </View>
                </LinearGradient>
              ),
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ProgressInsights;
