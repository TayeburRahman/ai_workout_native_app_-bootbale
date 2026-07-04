import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetTearmQuery } from "@/src/redux/page/profiledataApi";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Decode HTML entities
const decodeHtmlEntities = (html: string): string => {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
};

const TermsAndConditions = () => {
  const { data: tearmData, isLoading } = useGetTearmQuery();
  const scrollViewRef = useRef<ScrollView>(null);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const content = tearmData?.data?.content;
  const title = content?.title
    ? decodeHtmlEntities(content.title)
    : "Terms & Conditions";
  const htmlContent = content?.content
    ? decodeHtmlEntities(content.content)
    : "";
  const lastUpdated = content?.updatedAt
    ? new Date(content.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleContactEmail = () => {
    Linking.openURL("mailto:legal@bootble.com");
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
            {title}
          </Text>

          <View className="w-10 items-end">
            <MaterialIcons name="gavel" size={24} color="#A78BFA" />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Introduction Card */}
          <View className="bg-white/10 rounded-2xl p-5 mb-6 border border-[#A78BFA]/30">
            <View className="flex-row items-start">
              <View className="w-12 h-12 bg-[#A78BFA]/30 rounded-full items-center justify-center mr-4">
                <MaterialIcons name="info" size={24} color="#A78BFA" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-JosefinSansBold mb-2">
                  Important Legal Notice
                </Text>
                <Text className="text-gray-300 text-sm font-JosefinSansRegular">
                  These Terms & Conditions govern your use of BOOTBLE services.
                  By accessing our platform, you agree to these terms. Please
                  review them carefully.
                </Text>
              </View>
            </View>
          </View>

          {/* Version & Date Info */}
          {(content?.version || lastUpdated) && (
            <View className="flex-row justify-between mb-4 px-1">
              {content?.version && (
                <View className="flex-row items-center">
                  <FontAwesome6 name="code-branch" size={12} color="#A78BFA" />
                  <Text className="text-purple-300 text-xs font-JosefinSansRegular ml-1">
                    Version {content.version}
                  </Text>
                </View>
              )}
              {lastUpdated && (
                <View className="flex-row items-center">
                  <FontAwesome6 name="clock" size={12} color="#A78BFA" />
                  <Text className="text-purple-300 text-xs font-JosefinSansRegular ml-1">
                    Updated: {lastUpdated}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* API HTML Content */}
          {htmlContent ? (
            <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
              <RenderHtml
                contentWidth={width - 80}
                source={{ html: htmlContent }}
                baseStyle={{
                  color: "#E5E7EB",
                  fontSize: 15,
                  lineHeight: 24,
                }}
                tagsStyles={{
                  h1: {
                    color: "#FFFFFF",
                    fontSize: 22,
                    fontWeight: "700",
                    marginBottom: 16,
                    marginTop: 8,
                  },
                  h2: {
                    color: "#A78BFA",
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 10,
                    marginTop: 24,
                  },
                  h3: {
                    color: "#A78BFA",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 8,
                    marginTop: 20,
                  },
                  p: {
                    color: "#E5E7EB",
                    marginBottom: 14,
                    lineHeight: 24,
                  },
                  ul: {
                    marginBottom: 14,
                    paddingLeft: 20,
                  },
                  li: {
                    color: "#E5E7EB",
                    marginBottom: 8,
                    lineHeight: 22,
                  },
                  strong: {
                    color: "#FFFFFF",
                    fontWeight: "600",
                  },
                }}
              />
            </View>
          ) : (
            <View className="bg-white/5 rounded-2xl p-8 mb-6 border border-white/10 items-center">
              <MaterialIcons name="article" size={48} color="#A78BFA" />
              <Text className="text-white font-JosefinSansBold text-lg mt-4 mb-2">
                Content Unavailable
              </Text>
              <Text className="text-gray-400 font-JosefinSansRegular text-center">
                Unable to load terms content. Please try again later.
              </Text>
            </View>
          )}

          {/* Contact Section */}
          <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
            <Text className="text-white text-lg font-JosefinSansBold mb-4 text-center">
              Questions About Our Terms?
            </Text>

            <View className="flex-col gap-2 space-y-4">
              <TouchableOpacity
                onPress={handleContactEmail}
                className="bg-white/5 rounded-xl p-4 flex-row items-center border border-white/10"
              >
                <View className="w-12 h-12 bg-[#3B82F6]/20 rounded-full items-center justify-center mr-4">
                  <Ionicons name="mail-outline" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-JosefinSansBold">
                    Legal Department
                  </Text>
                  <Text className="text-gray-400 text-sm font-JosefinSansRegular">
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
                  <Text className="text-white font-JosefinSansBold">
                    Official Website
                  </Text>
                  <Text className="text-gray-400 text-sm font-JosefinSansRegular">
                    www.bootble.com
                  </Text>
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

export default TermsAndConditions;
