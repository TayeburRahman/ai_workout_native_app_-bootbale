import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetAiSuggestionsQuery } from "@/src/redux/page/aiApi";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
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

const Ai_suggestions = () => {
  const [imageSize, setImageSize] = useState(getImageSize());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  // -------------------ai-suggestions
  const {
    data: aiSuggestionData,
    isLoading,
    isError,
    error,
  } = useGetAiSuggestionsQuery(undefined);

  console.log("the ai data ", aiSuggestionData?.data);
  const suggestionsData = aiSuggestionData?.data;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setImageSize(getImageSize());
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    return () => subscription?.remove();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "workout":
        return "#EF4444";
      case "nutrition":
        return "#10B981";
      case "sleep":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getActionButtonText = (action: string) => {
    switch (action) {
      case "schedule_workout":
        return "Schedule Workout";
      case "log_meal":
        return "Log Meal";
      case "log_sleep":
        return "Track Sleep";
      default:
        return "Take Action";
    }
  };

  const handleActionPress = (action: string) => {
    setSelectedAction(action);
    setTimeout(() => {
      switch (action) {
        case "schedule_workout":
          router.push("/(page)/(aipage)/workout-plan");
          break;
        case "log_meal":
          router.push("/(page)/(aipage)/nutrition-advice");
          break;
        case "log_sleep":
          router.push("/(tabs)/sleeprecovery");
          break;
        default:
          break;
      }
    }, 200);
  };

  const SuggestionCard = ({
    suggestion,
    index,
  }: {
    suggestion: any;
    index: number;
  }) => {
    const cardAnim = useState(new Animated.Value(0))[0];
    const typeColor = getTypeColor(suggestion.type);
    const priorityColor = getPriorityColor(suggestion.priority);
    const isSelected = selectedAction === suggestion.action;

    useEffect(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
          opacity: cardAnim,
        }}
      >
        <View
          className={`border rounded-2xl  p-5 mb-4 ${suggestion.priority === "high" ? "bg-[#FFFFFF22]" : "bg-[#FFFFFF1A]"} ${isSelected ? "border-[#A895FF]" : "border-[#FFFFFF1A]"}`}
          style={{
            borderColor: suggestion.priority === "high" ? `${priorityColor}60` : undefined,
            shadowColor: isSelected ? typeColor : (suggestion.priority === "high" ? priorityColor : "#000"),
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.3 : 0.1,
            shadowRadius: isSelected ? 8 : 4,
            elevation: isSelected ? 8 : 4,
          }}
        >
          {/* Card Header */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text
                className="text-white font-JosefinSansBold mb-1"
                style={{ fontSize: scale(18) }}
                numberOfLines={2}
              >
                {suggestion.title}
              </Text>

              {/* Type Badge */}
              <View className="flex-row items-center">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: typeColor }}
                />
                <Text
                  className="text-gray-400 font-JosefinSansSemiBold capitalize"
                  style={{ fontSize: scale(12) }}
                >
                  {suggestion.type}
                </Text>
              </View>
            </View>

            {/* Priority Indicator */}
            <View
              className="px-3 py-1.5 rounded-full self-start"
              style={{ backgroundColor: `${priorityColor}15` }}
            >
              <Text
                className="font-JosefinSansBold"
                style={{
                  fontSize: scale(11),
                  color: priorityColor,
                }}
              >
                {suggestion.priority.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Message */}
          <View className="mb-4">
            <Text
              className="text-gray-300 font-JosefinSansRegular"
              style={{ fontSize: scale(14), lineHeight: scale(20) }}
            >
              {suggestion.message}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px bg-[#FFFFFF08] mb-4" />

          {/* Action Section */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: priorityColor }}
              />
              <Text
                className="text-gray-400 font-JosefinSansRegular"
                style={{ fontSize: scale(12) }}
              >
                {suggestion.priority.charAt(0).toUpperCase() +
                  suggestion.priority.slice(1)}{" "}
                Priority
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleActionPress(suggestion.action)}
              className={`px-4 py-2.5 rounded-xl ${isSelected ? "opacity-80" : ""}`}
              style={{ backgroundColor: `${typeColor}15` }}
              activeOpacity={0.7}
            >
              <Text
                className="font-JosefinSansSemiBold"
                style={{
                  fontSize: scale(14),
                  color: typeColor,
                }}
              >
                {getActionButtonText(suggestion.action)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show pressed action feedback */}
          {isSelected && (
            <View className="mt-3 p-2 bg-[#A895FF15] rounded-lg">
              <Text
                className="text-[#A895FF] font-JosefinSansRegular text-center"
                style={{ fontSize: scale(12) }}
              >
                Action: {suggestion.action}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="px-[5%] flex-row justify-between items-center py-4 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[38] h-[38] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center active:opacity-80"
            activeOpacity={0.8}
          >
            <FontAwesome6 name="arrow-left" size={scale(18)} color="#A895FF" />
          </TouchableOpacity>

          <Text
            className="text-center font-JosefinSansSemiBold text-[#FFFFFF]"
            style={{ fontSize: scale(24) }}
          >
            AI Suggestions
          </Text>
          <View className="w-[38]" />
        </View>

        {/* Subtle Background Image */}
        <View className="absolute inset-0 items-center justify-center opacity-10">
          <Image source={Images.gpt} resizeMode="contain" style={imageSize} />
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-[5%]"
          contentContainerStyle={{ paddingBottom: scale(40) }}
          style={{ opacity: fadeAnim }}
        >
          {/* Suggestions List */}
          <View className="mb-2">
            {/* <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-white font-JosefinSansBold "
                style={{ fontSize: scale(20) }}
              >
                Displaying Data
              </Text>
              <View className="px-3 py-1.5 bg-[#FFFFFF08] rounded-full">
                <Text
                  className="text-gray-400 font-JosefinSansSemiBold"
                  style={{ fontSize: scale(12) }}
                >
                  Read Only
                </Text>
              </View>
            </View> */}

            {suggestionsData?.map((suggestion: any, index: number) => (
              <SuggestionCard
                key={index}
                suggestion={suggestion}
                index={index}
              />
            ))}
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Ai_suggestions;
