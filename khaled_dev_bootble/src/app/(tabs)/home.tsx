import { roboticon } from "@/assets/icon";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import AiCard from "@/src/commonents/homepage/AiCard";
import AllRecentNutrition from "@/src/commonents/homepage/AllRecentNutrition";
import DailyActionBlock from "@/src/commonents/homepage/DailyActionBlock";
import Navber from "@/src/commonents/homepage/Navber";
import Nutrition from "@/src/commonents/homepage/Nutrition";
import ThreeDataC from "@/src/commonents/homepage/ThreeDataC";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import { useGetmyhealthQuery } from "@/src/redux/page/homedataApi";
import { router } from "expo-router";

import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

const home = () => {
  const { data: myHealthData, isLoading, error } = useGetmyhealthQuery();
  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetMyProfileQuery();
  // console.log(myHealthData);

  if (isLoading || isLoadingProfileData) {
    return <SkeletonLoader />;
  }

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="flex-1 px-[5%]">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <Navber />
            <AiCard />
            <DailyActionBlock actionPlan={myHealthData?.data?.actionPlan} />
            <ThreeDataC />
            <Nutrition />
            <AllRecentNutrition />
            <View className="h-48" />
          </ScrollView>
          <View className="absolute bottom-28 right-4 m-4">
            <TouchableOpacity
              className="w-16 h-16 justify-center items-center bg-[#A895FF] rounded-full shadow-lg"
              onPress={() => router.push("/gptassistant")}
            >
              <SvgXml xml={roboticon} width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default home;
