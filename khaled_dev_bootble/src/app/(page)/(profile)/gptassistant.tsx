import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const features = [
  {
    id: 1,
    title: "Generate Workout Plan",
    description: "Launch the AI scheduling engine",
    icon: "💪",
    isPremium: true,
    route: "/workout-plan",
  },
  {
    id: 2,
    title: "Analyze My Macros",
    description: "Review your live nutrition deficit",
    icon: "🥗",
    isPremium: true,
    route: "/nutrition-advice",
  },
  {
    id: 3,
    title: "Optimize My Sleep",
    description: "View targeted recovery strategies",
    icon: "😴",
    isPremium: false,
    route: "/sleep-tips",
  },
  {
    id: 4,
    title: "Review AI Suggestions",
    description: "See what Bootsy recommends today",
    icon: "🤖",
    isPremium: false,
    route: "/ai-suggestions",
  },
  {
    id: 5,
    title: "Analyze Progress",
    description: "Deep dive into your performance",
    icon: "📊",
    isPremium: true,
    route: "/progress-insights",
  }
];

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

const GPTAssistant = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetMyProfileQuery();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [imageSize, setImageSize] = useState(getImageSize());

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setImageSize(getImageSize());
    });
    return () => subscription?.remove();
  }, []);

  const handleFeaturePress = (feature: any) => {
    if (feature.isPremium && !isUserPremium) {
      setSelectedFeature(feature);
      setShowPremiumModal(true);
    } else {
      router.push(feature.route);
    }
  };

  const navigateToSubscription = () => {
    setShowPremiumModal(false);
    router.push("/subcription");
  };

  const PremiumLockIcon = () => (
    <View className="absolute -top-4 -right-4 bg-gray-800/90 rounded-full p-1.5">
      <FontAwesome6 name="crown" size={scale(14)} color="#FFD700" />
    </View>
  );

  const FeatureCard = ({ feature }: { feature: any }) => (
    <TouchableOpacity
      onPress={() => handleFeaturePress(feature)}
      className={`bg-[#FFFFFF1A] border rounded-2xl p-5 mb-4 ${
        feature.isPremium && !isUserPremium
          ? "border-[#FFD70033]"
          : "border-[#FFFFFF33]"
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <View className="bg-[#A895FF33] rounded-xl p-3 mr-4">
          <Text className="text-2xl" style={{ fontSize: scale(24) }}>
            {feature.icon}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-white font-JosefinSansSemiBold flex-1 mr-2"
              style={{ fontSize: scale(18) }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {feature.title}
            </Text>
            {feature.isPremium && !isUserPremium && (
              <View className="bg-yellow-500/20 px-2 py-1 rounded-full">
                <Text
                  className="text-yellow-400 font-JosefinSansSemiBold"
                  style={{ fontSize: scale(10) }}
                >
                  PREMIUM
                </Text>
              </View>
            )}
          </View>

          <Text
            className="text-gray-300 font-JosefinSansRegular text-sm mt-1"
            style={{ fontSize: scale(14) }}
          >
            {feature.description}
          </Text>

          <View className="flex-row items-center mt-3">
            <FontAwesome6
              name={
                feature.isPremium && !isUserPremium
                  ? "lock"
                  : "arrow-right-long"
              }
              size={scale(14)}
              color={
                feature.isPremium && !isUserPremium ? "#FFD700" : "#A895FF"
              }
              style={{ marginRight: 6 }}
            />
            <Text
              className={`font-JosefinSansMedium ${
                feature.isPremium && !isUserPremium
                  ? "text-yellow-400"
                  : "text-[#A895FF]"
              }`}
              style={{ fontSize: scale(14) }}
            >
              {feature.isPremium && !isUserPremium
                ? "Premium Feature"
                : "Access Now"}
            </Text>
          </View>
        </View>

        {feature.isPremium && !isUserPremium && <PremiumLockIcon />}
      </View>
    </TouchableOpacity>
  );

  // is Premium or not

  const isUserPremium =
    profileData?.data?.user?.subscription?.plan === "free" ? false : true;

  // loading page
  if (isLoadingProfileData) {
    return <SkeletonLoader />;
  }

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
            className="text-center font-JosefinSansSemiBold text-[#FFFFFF]"
            style={{ fontSize: scale(24) }}
          >
            AI Assistant
          </Text>
          <View className="w-[38]" />
        </View>

        <View className=" absolute inset-0 flex-1 items-center justify-center">
          {/* Main Image */}
          <Image
            source={Images.gpt}
            resizeMode="contain"
            style={imageSize}
            className=""
          />
          <View className="bg-[#1c154cb6] absolute inset-0" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-[5%]"
          contentContainerStyle={{ paddingBottom: scale(20) }}
        >
          {/* Header Section */}
          <View className="items-center mb-8 mt-4">
            <Text
              className="text-white font-JosefinSansBold text-center mt-4"
              style={{ fontSize: scale(28) }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Your AI Fitness Companion
            </Text>

            <Text
              className="text-gray-300 font-JosefinSansRegular text-center mt-2 px-4"
              style={{ fontSize: scale(16) }}
              numberOfLines={3}
            >
              Get personalized fitness guidance powered by advanced AI
            </Text>

            {/* Subscription Status Badge */}
            <View
              className={`mt-4 px-4 py-2 rounded-full ${
                isUserPremium
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                  : "bg-gradient-to-r from-[#6B7280] to-[#4B5563]"
              }`}
            >
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(14) }}
              >
                {isUserPremium ? "🌟 PREMIUM MEMBER" : "FREE PLAN"}
              </Text>
            </View>
          </View>

          {/* Quick Command Input */}
          <View className="mb-8 bg-[#FFFFFF1A] p-4 rounded-2xl border border-[#FFFFFF33]">
            <Text className="text-white font-JosefinSansSemiBold mb-3" style={{ fontSize: scale(16) }}>
              Ask Bootsy or give a command:
            </Text>
            <TouchableOpacity 
              onPress={() => {
                if (!isUserPremium) {
                  setShowPremiumModal(true);
                } else {
                  router.push("/ai-coach-chat");
                }
              }}
              className="bg-black/30 rounded-xl px-4 py-3 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <Text className="text-gray-400 font-JosefinSansRegular">e.g. Adjust my macros for today...</Text>
              <FontAwesome6 name="arrow-right" size={16} color="#A895FF" />
            </TouchableOpacity>
            
            <View className="flex-row items-center mt-3 justify-center">
              <FontAwesome6 name="shield-halved" size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs font-JosefinSansRegular ml-2 text-center">
                Bootsy has access to your Workouts, Nutrition, and Sleep data.
              </Text>
            </View>
          </View>

          {/* Features Grid */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-white font-JosefinSansSemiBold"
                style={{ fontSize: scale(20) }}
              >
                AI Tools & Commands
              </Text>
              {!isUserPremium && (
                <TouchableOpacity
                  onPress={() => router.push("/subcription")}
                  className="bg-gradient-to-r from-[#A895FF] to-[#7C3AED] px-4 py-2 rounded-full"
                  style={{
                    paddingHorizontal: scale(16),
                    paddingVertical: scale(8),
                  }}
                >
                  <Text
                    className="text-white font-JosefinSansSemiBold"
                    style={{ fontSize: scale(14) }}
                  >
                    Upgrade to Premium
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>

          {/* Info Section */}
          {!isUserPremium && (
            <View
              className="bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-2xl p-4 mb-10"
              style={{ padding: scale(16) }}
            >
              <View className="flex-row items-center mb-2">
                <FontAwesome6
                  name="crown"
                  size={scale(20)}
                  color="#FFD700"
                  style={{ marginRight: scale(8) }}
                />
                <Text
                  className="text-white font-JosefinSansSemiBold"
                  style={{ fontSize: scale(18) }}
                >
                  Unlock Premium Features
                </Text>
              </View>
              <Text
                className="text-gray-300 font-JosefinSansRegular"
                style={{ fontSize: scale(14) }}
              >
                Upgrade to access personalized workout plans, nutrition advice,
                progress insights, and chat directly with your AI fitness coach.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/subcription")}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] mt-4 py-3 rounded-xl items-center"
                style={{
                  marginTop: scale(16),
                  paddingVertical: scale(12),
                }}
              >
                <Text
                  className="text-[#fff] font-JosefinSansBold"
                  style={{ fontSize: scale(16) }}
                >
                  View Premium Plans
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Premium Feature Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPremiumModal}
          onRequestClose={() => setShowPremiumModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View
              className="bg-[#322E5C] rounded-t-3xl p-6 border-t border-[#322E5C]"
              style={{ padding: scale(24) }}
            >
              <View className="items-center mb-6">
                <View
                  className="bg-yellow-500/20 rounded-full mb-4"
                  style={{
                    padding: scale(16),
                  }}
                >
                  <FontAwesome6 name="crown" size={scale(32)} color="#FFD700" />
                </View>
                <Text
                  className="text-white font-JosefinSansBold text-center"
                  style={{ fontSize: scale(24) }}
                >
                  Premium Feature
                </Text>
                <Text
                  className="text-gray-300 font-JosefinSansRegular text-center mt-2"
                  style={{ fontSize: scale(16) }}
                >
                  {selectedFeature?.title} is a premium feature
                </Text>
              </View>

              <View
                className="bg-[#FFFFFF0D] rounded-xl p-4 mb-6"
                style={{ padding: scale(16) }}
              >
                <Text
                  className="text-white font-JosefinSansSemiBold mb-2"
                  style={{ fontSize: scale(18) }}
                >
                  {`What you'll get:`}
                </Text>
                <View className="flex-row items-center mb-2">
                  <FontAwesome6
                    name="check-circle"
                    size={scale(16)}
                    color="#4ADE80"
                    style={{ marginRight: scale(8) }}
                  />
                  <Text
                    className="text-gray-300 font-JosefinSansRegular"
                    style={{ fontSize: scale(14) }}
                  >
                    Personalized AI workout plans
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <FontAwesome6
                    name="check-circle"
                    size={scale(16)}
                    color="#4ADE80"
                    style={{ marginRight: scale(8) }}
                  />
                  <Text
                    className="text-gray-300 font-JosefinSansRegular"
                    style={{ fontSize: scale(14) }}
                  >
                    Custom nutrition advice
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <FontAwesome6
                    name="check-circle"
                    size={scale(16)}
                    color="#4ADE80"
                    style={{ marginRight: scale(8) }}
                  />
                  <Text
                    className="text-gray-300 font-JosefinSansRegular"
                    style={{ fontSize: scale(14) }}
                  >
                    Progress tracking & insights
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FontAwesome6
                    name="check-circle"
                    size={scale(16)}
                    color="#4ADE80"
                    style={{ marginRight: scale(8) }}
                  />
                  <Text
                    className="text-gray-300 font-JosefinSansRegular"
                    style={{ fontSize: scale(14) }}
                  >
                    24/7 AI fitness coach chat
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-center gap-[2%] space-x-3">
                <TouchableOpacity
                  onPress={() => setShowPremiumModal(false)}
                  className="flex-1 bg-[#FFFFFF1A] border border-[#FFFFFF33] py-4 rounded-xl items-center"
                  style={{
                    paddingVertical: scale(16),
                  }}
                >
                  <Text
                    className="text-white font-JosefinSansSemiBold"
                    style={{ fontSize: scale(16) }}
                  >
                    Maybe Later
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={navigateToSubscription}
                  className="flex-1 bg-gradient-to-r from-[#A895FF] to-[#7C3AED] border border-[#FFFFFF33] py-4 rounded-xl  items-center"
                  style={{
                    paddingVertical: scale(16),
                  }}
                >
                  <Text
                    className="text-white font-JosefinSansSemiBold"
                    style={{ fontSize: scale(16) }}
                  >
                    Upgrade Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default GPTAssistant;
