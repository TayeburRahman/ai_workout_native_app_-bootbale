import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import SleepRecovery from "@/src/commonents/sleep/SleepRecovery";
import { useGetSleepRecoveryQuery } from "@/src/redux/page/sleepRecoveryApi";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sleeprecovery = () => {
  const { data: sleepRecovery, isLoading, error } = useGetSleepRecoveryQuery();

  if (isLoading) {
    return <SkeletonLoader />;
  }
  // console.log("data", sleepRecovery?.data);
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-[5%]">
          <SleepRecovery />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default sleeprecovery;
