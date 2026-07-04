import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetFaqQuery } from "@/src/redux/page/profiledataApi";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Faqs = () => {
  const { data: faqData, isLoading } = useGetFaqQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Build categories from API grouped data
  const groupedByCategory = faqData?.data?.groupedByCategory ?? {};

  const faqCategories = Object.entries(groupedByCategory).map(
    ([categoryName, questions]: [string, any]) => ({
      id: categoryName,
      title: categoryName,
      questions,
    }),
  );

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter FAQs based on search query
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q: any) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  // Popular FAQs: first 4 from all faqs
  const popularFaqs = (faqData?.data?.faqs ?? []).slice(0, 4);

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-5 flex-row justify-between items-center mb-6 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20"
          >
            <FontAwesome6 name="arrow-left" size={18} color="#A78BFA" />
          </TouchableOpacity>

          <Text className="text-center font-JosefinSansBold text-2xl text-white">
            FAQs & Help
          </Text>

          <View className="w-10">
            <Ionicons name="help-circle-outline" size={24} color="#A78BFA" />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Search Bar */}
          <View className="mb-6">
            <View className="bg-white/10 rounded-2xl px-4 py-3 flex-row items-center border border-white/20">
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search FAQs..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-white text-base font-JosefinSansRegular ml-3"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Popular FAQs Quick Access */}
          {popularFaqs.length > 0 && (
            <View className="mb-8">
              <Text className="text-white text-lg font-JosefinSansBold mb-4">
                Popular Questions
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {popularFaqs.map((item: any) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => setExpandedId(item._id)}
                    className="bg-white/5 rounded-2xl p-4 mr-3 w-48 border border-white/10"
                  >
                    <View className="flex-row items-start">
                      <View className="w-8 h-8 bg-[#A78BFA]/20 rounded-full items-center justify-center mr-3">
                        <MaterialIcons
                          name="question-answer"
                          size={16}
                          color="#A78BFA"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-sm font-JosefinSansMedium mb-1">
                          {item.question}
                        </Text>
                        <Text className="text-gray-400 font-JosefinSansRegular text-xs">
                          {item.category}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* FAQ Categories */}
          <View>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <View key={category.id} className="mb-8">
                  {/* Category Header */}
                  <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center mr-3">
                      <Ionicons
                        name="help-circle-outline"
                        size={22}
                        color="#A78BFA"
                      />
                    </View>
                    <Text className="text-white text-lg font-JosefinSansBold">
                      {category.title}
                    </Text>
                  </View>

                  {/* Questions */}
                  <View className="space-y-3 flex-col gap-2">
                    {category.questions.map((item: any) => (
                      <View
                        key={item._id}
                        className="bg-white/5 rounded-2xl overflow-hidden border border-white/10"
                      >
                        <TouchableOpacity
                          onPress={() => toggleExpand(item._id)}
                          className="p-4 flex-row justify-between items-center"
                        >
                          <View className="flex-1 pr-4">
                            <Text className="text-white text-base font-JosefinSansMedium">
                              {item.question}
                            </Text>
                          </View>
                          <Ionicons
                            name={
                              expandedId === item._id
                                ? "chevron-up"
                                : "chevron-down"
                            }
                            size={20}
                            color="#A78BFA"
                          />
                        </TouchableOpacity>

                        {expandedId === item._id && (
                          <View className="px-4 pb-4">
                            <View className="pt-3 border-t border-white/10">
                              <Text className="text-gray-300 text-base font-JosefinSansRegular leading-6">
                                {item.answer}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-10">
                <Ionicons name="search" size={64} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-medium mt-4">
                  No results found
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  Try searching with different keywords
                </Text>
              </View>
            )}
          </View>

          {/* Still Need Help Section */}
          <View className="mt-8 bg-gradient-to-r from-[#A78BFA]/20 to-[#8B5CF6]/20 rounded-2xl p-5 border border-[#A78BFA]/30">
            <View className="flex-row items-start">
              <View className="w-12 h-12 bg-[#A78BFA]/30 rounded-full items-center justify-center mr-4">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="#A78BFA"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-JosefinSansBold mb-2">
                  Still need help?
                </Text>
                <Text className="text-gray-300 text-base font-JosefinSansRegular mb-4">
                  {`Can't find what you're looking for? Our support team is here to help you.`}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/contactSupport")}
                  className="bg-[#A78BFA] rounded-full py-3 px-6 items-center"
                >
                  <Text className="text-black font-JosefinSansBold text-base">
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Faqs;
