import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import {
  useOtpresendForgetMutation,
  useOtpresendValidationMutation,
  useVerifyCodeMutation,
  useChangeEmailMutation,
} from "@/src/redux/Auth/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

const Verify = () => {
  const { preemail, purpose } = useLocalSearchParams();

  const [otpvarification, { isLoading: otploading }] = useVerifyCodeMutation();
  const [otpresendForget, { isLoading: otpForgetloading }] = useOtpresendForgetMutation();
  const [otpresendvarification, { isLoading: otpsendloading }] = useOtpresendValidationMutation();
  const [changeEmail, { isLoading: isChangingEmail }] = useChangeEmailMutation();

  const [currentEmail, setCurrentEmail] = useState<string>((preemail as string) || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0 && !isResendEnabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [timer, isResendEnabled]);

  const handleOtpChange = (text: string, index: number) => {
    // Sanitize to only numeric input
    const sanitizedText = text.replace(/[^0-9]/g, "");

    if (sanitizedText.length > 1) {
      // Handle paste
      const pastedOtp = sanitizedText.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);

      // Focus on last filled input
      const lastFilledIndex = newOtp.findIndex((val) => val === "");
      const focusIndex = lastFilledIndex === -1 ? 5 : Math.min(lastFilledIndex, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = sanitizedText;
    setOtp(newOtp);

    // Auto-focus next input
    if (sanitizedText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-focus previous input on backspace
    if (!sanitizedText && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!isResendEnabled) return;

    const emailvalue = {
      email: currentEmail,
    };
    try {
      if (purpose === "signup") {
        await otpresendvarification(emailvalue).unwrap();
      } else {
        await otpresendForget(emailvalue).unwrap();
      }
      setTimer(60);
      setIsResendEnabled(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      Alert.alert("Success", "A fresh 6-digit code has been sent to your email.");
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to resend code. Please wait and try again.";
      Alert.alert("Resend Failed", errorMsg);
    }
  };

  const handleSaveEmail = async () => {
    const trimmed = newEmailInput.trim();
    if (!trimmed) {
      Alert.alert("Error", "Email cannot be empty");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (trimmed.toLowerCase() === currentEmail.toLowerCase()) {
      setIsEditingEmail(false);
      return;
    }

    try {
      const res = await changeEmail({ newEmail: trimmed }).unwrap();
      if (isSuccessfulResponse(res)) {
        setCurrentEmail(trimmed);
        setTimer(60);
        setIsResendEnabled(false);
        setOtp(["", "", "", "", "", ""]);
        setIsEditingEmail(false);
        inputRefs.current[0]?.focus();
        Alert.alert("Success", "Your email has been updated and a new verification code was sent.");
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to update email. Please try again.";
      Alert.alert("Error", errorMsg);
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    try {
      const otpValue = {
        email: currentEmail,
        otp: enteredOtp,
      };
      const res = await otpvarification(otpValue).unwrap();
      if (isSuccessfulResponse(res)) {
        if (purpose === "signup") {
          router.replace("/shiftSelection");
        } else {
          router.push({
            pathname: "/changepassword",
            params: { foremail: currentEmail },
          });
        }
      } else {
        Alert.alert("Verification Error", "Invalid code. Please check and try again.");
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Verification failed. The code may have expired or is incorrect.";
      Alert.alert("Verification Error", errorMsg);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="flex-1 px-[7%] py-8">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.push("/signin")}
                className="flex-row items-center mb-6 self-start"
              >
                <Ionicons name="arrow-back-outline" size={20} color="#E5E7EB" />
                <Text className="text-gray-200 ml-2 text-base font-JosefinSansRegular">
                  Back to Sign In
                </Text>
              </TouchableOpacity>

              {/* Logo */}
              <View className="items-center mb-6">
                <Image
                  source={Images.logo}
                  className="w-36 h-36"
                  resizeMode="contain"
                />
                <Text className="text-white text-2xl font-bold mt-2 tracking-wider">
                  BOOTBLE
                </Text>
              </View>

              {/* Title */}
              <Text className="text-white text-center text-xl font-bold mb-2">
                Verify Your Email
              </Text>

              {/* Email display and Editing view */}
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
                {isEditingEmail ? (
                  <View>
                    <Text className="text-white/80 text-xs mb-2">Edit Email Address:</Text>
                    <TextInput
                      placeholder="Enter new email"
                      placeholderTextColor="#9CA3AF"
                      value={newEmailInput}
                      onChangeText={setNewEmailInput}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="bg-white/10 text-white rounded-xl px-3 h-10 mb-3 font-JosefinSansRegular"
                    />
                    <View className="flex-row justify-end space-x-2">
                      <TouchableOpacity
                        onPress={() => setIsEditingEmail(false)}
                        className="px-4 py-2 rounded-lg bg-gray-600"
                      >
                        <Text className="text-white text-xs font-semibold">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveEmail}
                        disabled={isChangingEmail}
                        className="px-4 py-2 rounded-lg bg-[#A78BFA]"
                      >
                        <Text className="text-black text-xs font-semibold">
                          {isChangingEmail ? "Saving..." : "Save"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View className="items-center">
                    <Text className="text-gray-300 text-center text-sm leading-5 mb-2">
                      We've sent a 6-digit verification code to
                    </Text>
                    <View className="flex-row items-center justify-center flex-wrap">
                      <Text className="text-[#A78BFA] font-semibold text-base mr-2">{currentEmail}</Text>
                      {purpose === "signup" && (
                        <TouchableOpacity
                          onPress={() => {
                            setNewEmailInput(currentEmail);
                            setIsEditingEmail(true);
                          }}
                          className="flex-row items-center bg-white/10 px-2.5 py-1 rounded-full"
                        >
                          <Ionicons name="create-outline" size={13} color="#E5E7EB" />
                          <Text className="text-white text-xs ml-1 font-JosefinSansRegular">Edit</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* OTP Input Fields */}
              <View className="mb-10">
                <Text className="text-white/80 text-sm mb-4 text-center">
                  Enter the verification code
                </Text>

                <View className="flex-row justify-between px-4">
                  {otp.map((digit, index) => (
                    <View
                      key={index}
                      className={`w-12 h-14 rounded-2xl items-center justify-center border-2 ${
                        digit ? "border-[#A78BFA]" : "border-white/20"
                      } bg-white/5`}
                    >
                      <TextInput
                        ref={(ref) => {
                          inputRefs.current[index] = ref;
                        }}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        className="text-white text-2xl font-bold text-center w-full h-full"
                        selectionColor="#A78BFA"
                        autoFocus={index === 0}
                        secureTextEntry={false}
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* Resend OTP Section */}
              <View className="items-center mb-10">
                <Text className="text-gray-400 text-base mb-2">
                  {isResendEnabled
                    ? "Didn't receive the code?"
                    : `Resend code in ${timer}s`}
                </Text>

                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={!isResendEnabled || otpsendloading || otpForgetloading}
                  className={`mt-2 ${isResendEnabled ? "opacity-100" : "opacity-50"}`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      isResendEnabled ? "text-[#A78BFA]" : "text-gray-500"
                    }`}
                  >
                    {otpsendloading || otpForgetloading ? "Resending..." : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isOtpComplete || otploading}
                activeOpacity={0.9}
                className={`h-16 rounded-full items-center justify-center mt-auto ${
                  isOtpComplete && !otploading ? "bg-[#A78BFA]" : "bg-gray-600"
                }`}
              >
                {otploading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#000000" className="mr-2" />
                    <Text className="text-black font-bold text-lg">
                      Verifying...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-black font-bold text-lg">
                    Verify & Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Verify;
