import GradientBackground from "@/src/commonents/background/GradientBackground";
import React from "react";
import { View } from "react-native";

const SkeletonLoader = () => (
  <GradientBackground>
    <View className="flex-1 p-4">
      {/* Header Skeleton */}
      <View className="h-12 bg-white/20 rounded-lg mb-6 animate-pulse" />

      {/* Content Skeleton */}
      {[1, 2, 3].map((i) => (
        <View key={i} className="mb-4">
          <View className="h-40 bg-white/15 rounded-xl mb-2 animate-pulse" />
          <View className="h-4 bg-white/10 rounded w-3/4 mb-1 animate-pulse" />
          <View className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
        </View>
      ))}
    </View>
  </GradientBackground>
);

export default SkeletonLoader;
