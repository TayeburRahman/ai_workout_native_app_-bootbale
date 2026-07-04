import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import { useForgetPasswordMutation } from "@/src/redux/Auth/authApi";
import { isSuccessfulResponse } from "@/src/utils/authRouting";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handletheforget = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Error", "Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const res = await forgetPassword({ email: trimmedEmail }).unwrap();

      if (isSuccessfulResponse(res)) {
        Alert.alert(
          "Verification Code Sent",
          "If this email is registered, a password reset code has been sent. Please check your inbox.",
          [
            {
              text: "OK",
              onPress: () =>
                router.push({
                  pathname: "/varify",
                  params: { preemail: trimmedEmail, purpose: "forget" },
                }),
            }
          ]
        );
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Something went wrong. Please try again.";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            className="px-[7%]"
          >
            {/* Top Navigation Row */}
            <TouchableOpacity
              onPress={() => router.push("/signin")}
              className="flex-row items-center mt-4 self-start"
            >
              <Ionicons name="arrow-back-outline" size={20} color="#E5E7EB" />
              <Text className="text-gray-200 ml-2 text-base font-JosefinSansRegular">
                Back to Sign In
              </Text>
            </TouchableOpacity>

            {/* Logo */}
            <View className="items-center mt-[4%] mb-[2%]">
              <Image
                source={Images.logo}
                className="w-44 h-44 mb-3"
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text className="text-white text-center text-xl font-JosefinSansSemiBold mb-[4%]">
              Recover your password safely
            </Text>

            {/* Explanatory Message */}
            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
              <Text className="text-gray-300 text-xs font-JosefinSansRegular leading-5 text-center">
                For security reasons, we do not disclose if your email is registered. If the email matches an active account, you will receive a verification code.
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-8">
              <Text className="text-[#FFFFFF] font-JosefinSansMedium text-base mb-2">
                Email Address
              </Text>
              <View className="bg-white/10 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  placeholder="alexjohn@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  className="text-white text-base font-JosefinSansRegular"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handletheforget}
              disabled={isLoading}
              activeOpacity={0.9}
              className="h-14 rounded-full bg-[#A78BFA] items-center justify-center mb-6 mt-auto"
            >
              <Text className="text-black font-JosefinSansSemiBold text-lg">
                {isLoading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Forgot;
