import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetPolicyQuery } from "@/src/redux/page/profiledataApi";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

const Policy = () => {
  const { data: policyData, isLoading } = useGetPolicyQuery(undefined);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();

  console.log("Policy Data:", policyData);

  // Loading
  if (isLoading) {
    return <SkeletonLoader />;
  }

  const handleContactEmail = () => {
    Linking.openURL("mailto:enquiries@bootble.com");
  };

  const handleOpenWebsite = () => {
    Linking.openURL("https://www.bootble.com");
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-5 flex-row justify-between items-center mb-4 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20"
          >
            <FontAwesome6 name="arrow-left" size={18} color="#A78BFA" />
          </TouchableOpacity>

          <Text className="text-center font-JosefinSansBold text-2xl text-white">
            Privacy Policy
          </Text>

          <View className="w-10">
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#A78BFA"
            />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Intro Card */}
          <View className="bg-gradient-to-r from-[#10B981]/20 to-[#34D399]/20 rounded-2xl p-5 mb-6 border border-[#10B981]/30">
            <View className="flex-row items-start">
              <View className="w-12 h-12 bg-[#10B981]/30 rounded-full items-center justify-center mr-4">
                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-JosefinSansBold mb-2">
                  Your Privacy Matters
                </Text>
                <Text className="text-gray-300 font-JosefinSansMedium text-base">
                  We are committed to protecting your personal information and
                  being transparent about how we collect, use, and share your
                  data.
                </Text>
              </View>
            </View>
          </View>

          {/* ✅ HTML Content */}
          <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
            <RenderHTML
              contentWidth={width}
              source={{ html: policyData || "" }}
              baseStyle={{
                color: "white",
                fontSize: 14,
                lineHeight: 22,
              }}
              tagsStyles={{
                h1: { color: "white", marginBottom: 10 },
                h2: { color: "#A78BFA", marginBottom: 8 },
                h3: { color: "#10B981", marginBottom: 6 },
                p: { color: "#D1D5DB", marginBottom: 8 },
                li: { color: "#D1D5DB", marginBottom: 4 },
              }}
              renderersProps={{
                a: {
                  onPress: (event: any, href: string) => {
                    Linking.openURL(href);
                  }
                }
              }}
            />
          </View>

          {/* Contact Section */}
          <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
            <Text className="text-white text-lg font-bold mb-4 text-center">
              Need More Information?
            </Text>

            <View className="flex-col gap-4">
              <TouchableOpacity
                onPress={handleContactEmail}
                className="bg-white/5 rounded-xl p-4 flex-row items-center border border-white/10"
              >
                <View className="w-12 h-12 bg-[#3B82F6]/20 rounded-full items-center justify-center mr-4">
                  <Ionicons name="mail-outline" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Email Us</Text>
                  <Text className="text-gray-400 text-sm">
                    enquiries@bootble.com
                  </Text>
                </View>
                <Ionicons name="open-outline" size={20} color="#A78BFA" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenWebsite}
                className="bg-white/5 rounded-xl p-4 flex-row items-center border border-white/10"
              >
                <View className="w-12 h-12 bg-[#8B5CF6]/20 rounded-full items-center justify-center mr-4">
                  <MaterialIcons name="web" size={24} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Visit Website</Text>
                  <Text className="text-gray-400 text-sm">www.bootble.com</Text>
                </View>
                <Ionicons name="open-outline" size={20} color="#A78BFA" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Policy;
