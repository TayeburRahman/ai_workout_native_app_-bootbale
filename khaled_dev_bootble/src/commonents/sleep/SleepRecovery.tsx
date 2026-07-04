import { useGetSleepRecoveryQuery } from "@/src/redux/page/sleepRecoveryApi";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import SleepRecoveryCard from "../card/SleepRecoveryCard";
import SkeletonLoader from "../modarndesign/SkeletonLoader";

const SleepRecovery = () => {
  const { data: sleepRecovery, isLoading, error } = useGetSleepRecoveryQuery();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Separate recommended and other activities
  const recommendedData = sleepRecovery?.data
    ? sleepRecovery.data.filter((item: any) => item.recommended)
    : [];

  const otherData = sleepRecovery?.data
    ? sleepRecovery.data.filter((item: any) => !item.recommended).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 py-4">
        <Text className="font-JosefinSansBold text-3xl text-center text-white">
          Sleep & Recovery
        </Text>
        <Text className="font-JosefinSansSemiBold text-base text-center text-white/70 mt-2 mb-4">
          Reset your body around your shifts
        </Text>

        <View className="flex-col mt-2">
          {recommendedData.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3 px-2">
                <View className="w-1.5 h-6 bg-[#10B981] rounded-full mr-3" />
                <Text className="font-JosefinSansBold text-xl text-white">Recommended for You</Text>
              </View>
              {recommendedData.map((item: any, index: number) => (
                <SleepRecoveryCard key={item._id || `rec-${index}`} item={item} />
              ))}
            </View>
          )}

          {otherData.length > 0 && (
            <View>
              <Text className="font-JosefinSansSemiBold text-lg text-white/70 mb-3 px-2">
                {recommendedData.length > 0 ? "Other Recovery Options" : "All Recovery Options"}
              </Text>
              {otherData.map((item: any, index: number) => (
                <SleepRecoveryCard key={item._id || `oth-${index}`} item={item} />
              ))}
            </View>
          )}
          
          {recommendedData.length === 0 && otherData.length === 0 && (
            <Text className="text-white/50 text-center mt-8 font-JosefinSansMedium">
              No recovery activities available
            </Text>
          )}
        </View>
      </View>
      <View className="h-48" />
    </ScrollView>
  );
};

export default SleepRecovery;
