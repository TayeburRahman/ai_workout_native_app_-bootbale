import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetNutritionQuery } from "@/src/redux/page/aiApi";
import { FontAwesome6 } from "@expo/vector-icons";
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

interface MacroCardProps {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  icon: string;
}

const MacroCard = ({
  label,
  consumed,
  target,
  unit,
  color,
  icon,
}: MacroCardProps) => {
  const ratio = target > 0 ? Math.min(consumed / target, 1) : 0;
  
  return (
    <LinearGradient
      colors={[`${color}20`, `${color}05`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 rounded-2xl p-4 border"
      style={{ borderColor: `${color}30` }}
    >
      <View className="flex-row items-center mb-2">
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: `${color}20` }}
        >
          <FontAwesome6 name={icon} size={scale(14)} color={color} />
        </View>
        <Text
          className="text-white/60 font-JosefinSansMedium"
          style={{ fontSize: scale(12) }}
        >
          {label}
        </Text>
      </View>

      <Text
        className="text-white font-JosefinSansBold mb-1"
        style={{ fontSize: scale(20) }}
      >
        {Math.round(consumed)}
        <Text
          className="text-white/40 font-JosefinSansRegular"
          style={{ fontSize: scale(12) }}
        >
          {" "}
          / {Math.round(target)}{unit}
        </Text>
      </Text>

      <View className="flex-row items-center mt-2">
        <View className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${ratio * 100}%`,
              backgroundColor: color,
            }}
          />
        </View>
        <Text
          className="text-white/40 ml-2 font-JosefinSansMedium"
          style={{ fontSize: scale(10) }}
        >
          {Math.round(ratio * 100)}%
        </Text>
      </View>
    </LinearGradient>
  );
};

interface RecommendationCardProps {
  text: string;
  index: number;
}

const RecommendationCard = ({ text, index }: RecommendationCardProps) => (
  <View className="flex-row items-start mb-3">
    <View className="w-6 h-6 rounded-full bg-[#A895FF] items-center justify-center mr-3 mt-0.5">
      <Text className="text-[#0A0A1A] font-JosefinSansBold text-xs">
        {index + 1}
      </Text>
    </View>
    <View className="flex-1">
      <Text
        className="text-white/90 font-JosefinSansRegular leading-5"
        style={{ fontSize: scale(14) }}
      >
        {text}
      </Text>
    </View>
  </View>
);

const SuggestedFoodCard = ({ food, color }: { food: any, color: string }) => (
  <View className="bg-black/20 border border-white/10 rounded-xl p-4 mr-3 min-w-[140px]">
    <View className="flex-row justify-between items-start mb-2">
      <View className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <FontAwesome6 name="drumstick-bite" size={14} color={color} />
      </View>
      <Text className="text-white/50 text-xs font-JosefinSansSemiBold">{food.calories} kcal</Text>
    </View>
    <Text className="text-white font-JosefinSansSemiBold text-sm mb-1" numberOfLines={1}>{food.name}</Text>
    <Text style={{ color }} className="font-JosefinSansBold text-base">{food.protein}g Protein</Text>
  </View>
);

const Nutrition_advice = () => {
  const [imageSize, setImageSize] = useState(getImageSize());
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: nutritionData,
    isLoading,
    isError,
    refetch,
  } = useGetNutritionQuery(undefined);

  useEffect(() => {
    const updateImageSize = () => {
      setImageSize(getImageSize());
    };

    const subscription = Dimensions.addEventListener("change", updateImageSize);
    return () => subscription?.remove();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError || !nutritionData?.data) {
    return (
      <GradientBackground>
        <SafeAreaView className="flex-1">
          <View className="px-[5%] flex-row justify-between items-center py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-[38] h-[38] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center"
            >
              <FontAwesome6
                name="arrow-left"
                size={scale(18)}
                color="#A895FF"
              />
            </TouchableOpacity>
            <Text
              className="text-center font-JosefinSansSemiBold text-white"
              style={{ fontSize: scale(24) }}
            >
              Live Guidance
            </Text>
            <View className="w-[38]" />
          </View>
          <View className="flex-1 justify-center items-center px-[5%]">
            <FontAwesome6
              name="circle-exclamation"
              size={scale(48)}
              color="#A895FF"
            />
            <Text
              className="text-white/80 text-center mt-4 font-JosefinSansMedium"
              style={{ fontSize: scale(16) }}
            >
              Failed to load nutrition data
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="mt-4 px-6 py-3 bg-[#A895FF] rounded-full"
            >
              <Text className="text-[#0A0A1A] font-JosefinSansSemiBold">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const { title, dailyTargets, consumed, recommendations, shiftSpecific, mealTiming, suggestedFoods } =
    nutritionData.data;

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
            className="text-center font-JosefinSansSemiBold text-white"
            style={{ fontSize: scale(24) }}
          >
            Nutrition Coach
          </Text>
          <View className="w-[38]" />
        </View>

        <View className="absolute inset-0 flex-1 items-center justify-center opacity-10">
          <Image source={Images.gpt} resizeMode="contain" style={imageSize} />
        </View>

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
          {/* Title */}
          <View className="flex-row items-center mb-2 mt-2">
            <FontAwesome6 name="bolt" size={16} color="#A895FF" />
            <Text
              className="text-[#A895FF] font-JosefinSansBold ml-2"
              style={{ fontSize: scale(20) }}
            >
              {title}
            </Text>
          </View>

          {/* Daily Targets Overview */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center my-4">
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(16) }}
              >
                Today's Progress
              </Text>
              <View className="bg-[#A895FF] px-3 py-1 rounded-full flex-row items-center">
                <Text
                  className="text-[#0A0A1A] font-JosefinSansBold"
                  style={{ fontSize: scale(12) }}
                >
                  {Math.round(consumed?.calories || 0)} / {dailyTargets?.calorieTarget || 0} kcal
                </Text>
              </View>
            </View>

            {/* Macro Cards */}
            <View className="flex-row gap-3 mb-4">
              <MacroCard
                label="Protein"
                consumed={consumed?.protein || 0}
                target={dailyTargets?.proteinTarget || 0}
                unit="g"
                color="#FF6B6B"
                icon="dumbbell"
              />
              <MacroCard
                label="Carbs"
                consumed={consumed?.carbs || 0}
                target={dailyTargets?.carbTarget || 0}
                unit="g"
                color="#4ECDC4"
                icon="wheat-awn"
              />
              <MacroCard
                label="Fat"
                consumed={consumed?.fat || 0}
                target={dailyTargets?.fatTarget || 0}
                unit="g"
                color="#FFD93D"
                icon="oil-can"
              />
            </View>
          </View>

          {/* Suggested Foods Panel (Only shows if there are suggestions, e.g., low protein) */}
          {suggestedFoods && suggestedFoods.length > 0 && (
            <View className="mb-6">
               <Text
                className="text-white font-JosefinSansSemiBold mb-3"
                style={{ fontSize: scale(16) }}
              >
                Suggested for you
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {suggestedFoods.map((food: any) => (
                  <SuggestedFoodCard key={food.id} food={food} color="#FF6B6B" />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Shift Specific Advice & Timings */}
          {shiftSpecific && (
            <View className="mb-6">
              <Text
                className="text-white font-JosefinSansSemiBold mb-3"
                style={{ fontSize: scale(16) }}
              >
                Shift Meal Timings
              </Text>
              <LinearGradient
                colors={["#4ECDC420", "#4ECDC405"]}
                className="rounded-2xl p-5 border border-[#4ECDC4]/50"
              >
                <View className="flex-row items-start mb-4">
                  <View className="w-8 h-8 rounded-full bg-[#4ECDC4] items-center justify-center mr-3">
                    <FontAwesome6
                      name="clock"
                      size={scale(14)}
                      color="#0A0A1A"
                    />
                  </View>
                  <Text
                    className="flex-1 text-white/90 font-JosefinSansRegular leading-5 mt-1"
                    style={{ fontSize: scale(14) }}
                  >
                    {shiftSpecific}
                  </Text>
                </View>
                
                {mealTiming && (
                  <View className="bg-black/20 rounded-xl p-3 border border-[#4ECDC4]/20">
                    {Object.entries(mealTiming).map(([meal, time]) => (
                      <View key={meal} className="flex-row justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                        <Text className="text-white/70 capitalize font-JosefinSansMedium">{meal}</Text>
                        <Text className="text-[#4ECDC4] font-JosefinSansBold">{String(time)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </LinearGradient>
            </View>
          )}

          {/* Key Recommendations */}
          <View className="mb-6">
            <Text
              className="text-white font-JosefinSansSemiBold mb-3"
              style={{ fontSize: scale(16) }}
            >
              Action Plan
            </Text>
            <LinearGradient
              colors={["#FFFFFF10", "#FFFFFF05"]}
              className="rounded-2xl p-5 border border-white/10"
            >
              {recommendations?.map((rec: string, index: number) => (
                <RecommendationCard key={index} text={rec} index={index} />
              ))}
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Nutrition_advice;
