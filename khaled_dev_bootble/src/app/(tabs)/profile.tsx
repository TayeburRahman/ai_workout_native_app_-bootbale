import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import Genaral from "@/src/commonents/profile/Genaral";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetMyProfileQuery();
  // console.log(myHealthData);

  if (isLoadingProfileData) {
    return <SkeletonLoader />;
  }
  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="flex-1 px-[5%]">
          <ScrollView className="flex-1">
            <View className="flex-1">
              <Text className="text-center font-JosefinSansSemiBold text-2xl text-[#FFFFFF]">
                Profile
              </Text>
              <Genaral />
            </View>
            <View className="h-48" />
          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default profile;
