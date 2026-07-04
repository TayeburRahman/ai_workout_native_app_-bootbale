import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import { useResetPasswordMutation } from "@/src/redux/Auth/authApi";
import { logoutUser } from "@/src/redux/Auth/authSlice";
import { isSuccessfulResponse } from "@/src/utils/authRouting";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
import { useDispatch } from "react-redux";

const Changepassword = () => {
  const { foremail } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [chengePassword, { isLoading }] = useResetPasswordMutation();

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  };

  const isPasswordStrong = Object.values(checks).every(Boolean);

  const handletReset = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }
    if (!isPasswordStrong) {
      Alert.alert("Error", "Password does not meet the security requirements");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const playload = {
        email: foremail,
        newPassword: password,
        confirmPassword: confirmPassword,
      };
      const res = await chengePassword(playload).unwrap();
      if (isSuccessfulResponse(res)) {
        // Clear secure store and local Redux state
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        dispatch(logoutUser());

        Alert.alert(
          "Success",
          "Your password has been reset successfully. Please sign in with your new password.",
          [{ text: "OK", onPress: () => router.replace("/signin") }]
        );
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Something went wrong";
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
            contentContainerStyle={{ paddingBottom: 40 }}
            className="px-[7%]"
          >
            {/* Logo */}
            <View className="items-center mt-[8%] mb-[2%]">
              <Image
                source={Images.logo}
                className="w-44 h-44 mb-3"
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text className="text-white text-center text-xl font-JosefinSansSemiBold mb-[6%]">
              Your security starts with a strong password
            </Text>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-[#FFFFFF] font-JosefinSansMedium text-base mb-2">
                New Password
              </Text>
              <View className="bg-white/10 rounded-2xl px-4 h-14 flex-row items-center">
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => setpassword(text)}
                  className="flex-1 text-white text-base font-JosefinSansRegular"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#E5E7EB"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements Checklist */}
            <View className="mb-6 px-1">
              <Text className="text-gray-300 text-xs font-JosefinSansMedium mb-2">
                Password Requirements:
              </Text>
              <View className="gap-y-1.5">
                {[
                  { key: "length", label: "At least 8 characters" },
                  { key: "uppercase", label: "At least one uppercase letter" },
                  { key: "lowercase", label: "At least one lowercase letter" },
                  { key: "number", label: "At least one number" },
                  { key: "special", label: "At least one special character" },
                ].map((item) => {
                  const isMet = checks[item.key as keyof typeof checks];
                  return (
                    <View key={item.key} className="flex-row items-center">
                      <Ionicons
                        name={isMet ? "checkmark-circle" : "ellipse-outline"}
                        size={16}
                        color={isMet ? "#10B981" : "#9CA3AF"}
                      />
                      <Text
                        className={`text-xs ml-2 font-JosefinSansRegular ${
                          isMet ? "text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-8">
              <Text className="text-[#FFFFFF] font-JosefinSansMedium text-base mb-2">
                Confirm Password
              </Text>
              <View className="bg-white/10 rounded-2xl px-4 h-14 flex-row items-center">
                <TextInput
                  secureTextEntry={!showConfirm}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  className="flex-1 text-white text-base font-JosefinSansRegular"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#E5E7EB"
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text className="text-rose-400 text-xs mt-1 ml-2 font-JosefinSansRegular">
                  Passwords do not match
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handletReset}
              disabled={isLoading}
              activeOpacity={0.9}
              className="h-14 rounded-full bg-[#A78BFA] items-center justify-center"
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

export default Changepassword;
