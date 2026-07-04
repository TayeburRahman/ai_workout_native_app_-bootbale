import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import { useSignupMutation } from "@/src/redux/Auth/authApi";
import { SignUpPayload } from "@/src/redux/types/auth";
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
import { isSuccessfulResponse } from "@/src/utils/authRouting";

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [SignUpUser, { isLoading }] = useSignupMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password requirements checklist evaluation
  const passwordCriteria = {
    length: form.password.length >= 8,
    mixedCase: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    specialChar: /[^A-Za-z0-9]/.test(form.password),
  };

  const handleRegister = async () => {
    let newErrors: Partial<FormErrors> = {};

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();

    if (!trimmedName) newErrors.name = "Name is required";
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      const isValidPassword =
        passwordCriteria.length &&
        passwordCriteria.mixedCase &&
        passwordCriteria.number &&
        passwordCriteria.specialChar;
      if (!isValidPassword) {
        newErrors.password = "Password does not meet strength requirements";
      }
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors as FormErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const values: SignUpPayload = {
        fullName: trimmedName,
        email: trimmedEmail,
        password: form.password,
      };
      const res = await SignUpUser(values).unwrap();
      
      if (isSuccessfulResponse(res)) {
        router.push({
          pathname: "/varify",
          params: { preemail: trimmedEmail, purpose: "signup" },
        });
      } else {
        Alert.alert("Registration Failed", "Failed to register user. Please try again.");
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Sign up failed. Please check details and try again.";
      Alert.alert("Registration Failed", errorMsg);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
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
              Welcome, Please fill your details below!
            </Text>

            {/* Username / Name */}
            <View className="mb-4">
              <Text className="text-[#FFFFFF] font-JosefinSansMedium text-base mb-2">
                Name
              </Text>
              <View className="bg-white/10 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  placeholder="Alex John"
                  placeholderTextColor="#FFFFFF99"
                  value={form.name}
                  autoCapitalize="words"
                  className="text-white text-base font-JosefinSansRegular"
                  onChangeText={(text) => {
                    setForm({ ...form, name: text });
                    setErrors({ ...errors, name: "" });
                  }}
                />
              </View>
              {errors?.name ? (
                <Text className="font-PoppinsRegular text-xs text-red-800 mt-1">
                  {errors.name}
                </Text>
              ) : null}
            </View>

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

            {/* Password Strength Checklist */}
            {form.password ? (
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                <Text className="text-white/80 text-xs font-semibold mb-2">Password Requirements:</Text>
                <View className="space-y-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name={passwordCriteria.length ? "checkmark-circle" : "ellipse-outline"}
                      size={14}
                      color={passwordCriteria.length ? "#10B981" : "#9CA3AF"}
                    />
                    <Text className={`text-xs ml-2 ${passwordCriteria.length ? "text-emerald-400" : "text-gray-400"}`}>
                      At least 8 characters
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name={passwordCriteria.mixedCase ? "checkmark-circle" : "ellipse-outline"}
                      size={14}
                      color={passwordCriteria.mixedCase ? "#10B981" : "#9CA3AF"}
                    />
                    <Text className={`text-xs ml-2 ${passwordCriteria.mixedCase ? "text-emerald-400" : "text-gray-400"}`}>
                      Uppercase and lowercase letters
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name={passwordCriteria.number ? "checkmark-circle" : "ellipse-outline"}
                      size={14}
                      color={passwordCriteria.number ? "#10B981" : "#9CA3AF"}
                    />
                    <Text className={`text-xs ml-2 ${passwordCriteria.number ? "text-emerald-400" : "text-gray-400"}`}>
                      At least one number
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name={passwordCriteria.specialChar ? "checkmark-circle" : "ellipse-outline"}
                      size={14}
                      color={passwordCriteria.specialChar ? "#10B981" : "#9CA3AF"}
                    />
                    <Text className={`text-xs ml-2 ${passwordCriteria.specialChar ? "text-emerald-400" : "text-gray-400"}`}>
                      At least one special character
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

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
                  value={form.confirmPassword}
                  className="flex-1 text-white text-base font-JosefinSansRegular"
                  onChangeText={(text) => {
                    setForm({ ...form, confirmPassword: text });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#E5E7EB"
                  />
                </TouchableOpacity>
              </View>
              {errors?.confirmPassword ? (
                <Text className="font-PoppinsRegular text-xs text-red-800 mt-1">
                  {errors.confirmPassword}
                </Text>
              ) : null}
            </View>

            {/* Sign Up */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.9}
              className="h-14 rounded-full bg-[#A78BFA] items-center justify-center"
            >
              <Text className="text-black font-JosefinSansSemiBold text-lg">
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-white font-JosefinSansMedium text-base">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.replace("/signin")}>
                <Text className="text-[#A78BFA] text-base font-JosefinSansBold ml-2">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Signup;
