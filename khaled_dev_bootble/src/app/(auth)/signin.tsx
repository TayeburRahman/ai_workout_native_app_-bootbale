import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import { useSigninMutation } from "@/src/redux/Auth/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
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
import { getPostAuthRoute, isSuccessfulResponse } from "@/src/utils/authRouting";
import * as SecureStore from "expo-secure-store";

interface FormErrors {
  email: string;
  password: string;
}

const Signin = () => {
  const [singnindata, { isLoading: isSignInLoadin }] = useSigninMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  // Load remembered credentials on mount
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await SecureStore.getItemAsync("remembered_email");
        const savedPassword = await SecureStore.getItemAsync("remembered_password");
        if (savedEmail) {
          setForm({
            email: savedEmail,
            password: savedPassword || "",
          });
          setRememberMe(true);
        }
      } catch (e) {
        console.error("Failed to load saved credentials", e);
      }
    };
    loadSavedCredentials();
  }, []);

  const handeleSignin = async () => {
    let newErrors: Partial<FormErrors> = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors({
      email: newErrors.email || "",
      password: newErrors.password || "",
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      const values = {
        email: form.email.trim(),
        password: form.password,
      };
      const res = await singnindata(values).unwrap();
      
      if (isSuccessfulResponse(res)) {
        // Save or clear credentials based on rememberMe status
        if (rememberMe) {
          await SecureStore.setItemAsync("remembered_email", form.email.trim());
          await SecureStore.setItemAsync("remembered_password", form.password);
        } else {
          await SecureStore.deleteItemAsync("remembered_email");
          await SecureStore.deleteItemAsync("remembered_password");
        }

        router.replace(getPostAuthRoute(res));
      } else {
        Alert.alert("Sign In Failed", "Please check your credentials.");
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Sign in failed. Please check your credentials.";

      // Handle unverified user accounts redirecting to verification page
      if (errorMsg.toLowerCase().includes("verify your email") || errorMsg.toLowerCase().includes("first")) {
        Alert.alert(
          "Email Not Verified",
          "Your email address is not verified yet. Would you like to verify it now?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Verify Now",
              onPress: () => {
                router.push({
                  pathname: "/varify",
                  params: { preemail: form.email.trim(), purpose: "signup" },
                });
              }
            }
          ]
        );
        return;
      }

      Alert.alert("Sign In Failed", errorMsg);
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
              Welcome back, Glad to see you again!
            </Text>
            {/* Email */}
            <View className="mb-4">
              <Text className="text-[#FFFFFF] font-JosefinSansMedium text-base mb-2">
                Email
              </Text>
              <View className="bg-white/10 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  placeholder="alexjohn@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  className="text-white text-base font-JosefinSansRegular"
                  onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    setErrors({ ...errors, email: "" });
                  }}
                />
              </View>
              {errors?.email ? (
                <Text className="font-PoppinsRegular text-xs text-red-800 mt-1">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-[#FFFFFF] font-JosefinSansMedium text-base mb-2">
                Password
              </Text>
              <View className="bg-white/10 rounded-2xl px-4 h-14 flex-row items-center">
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={form.password}
                  className="flex-1 text-white text-base font-JosefinSansRegular"
                  onChangeText={(text) => {
                    setForm({ ...form, password: text });
                    setErrors({ ...errors, password: "" });
                  }}
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
              {errors?.password ? (
                <Text className="font-PoppinsRegular text-xs text-red-800 mt-1">
                  {errors.password}
                </Text>
              ) : null}
            </View>
            <View className="flex-row justify-between items-center mb-[10%]">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
              >
                <Ionicons
                  name={rememberMe ? "checkbox" : "square-outline"}
                  size={20}
                  color={rememberMe ? "#A78BFA" : "#9CA3AF"}
                />
                <Text className="text-gray-300 ml-2 font-JosefinSansMedium text-sm">
                  Remember Me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/forgot")}
              >
                <Text className="text-sm text-[#A78BFA] font-JosefinSansSemiBold">
                  Forget Password?
                </Text>
              </TouchableOpacity>
            </View>
            {/* Sign In */}
            <TouchableOpacity
              onPress={handeleSignin}
              disabled={isSignInLoadin}
              activeOpacity={0.9}
              className="h-14 rounded-full bg-[#A78BFA] items-center justify-center"
            >
              <Text className="text-black font-JosefinSansSemiBold text-lg">
                {isSignInLoadin ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-white font-JosefinSansMedium text-base">
                Don’t have an account?
              </Text>
              <TouchableOpacity onPress={() => router.replace("/signup")}>
                <Text className="text-[#A78BFA] text-base font-JosefinSansBold ml-2">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Signin;
