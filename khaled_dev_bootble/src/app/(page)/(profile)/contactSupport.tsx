import GradientBackground from "@/src/commonents/background/GradientBackground";
import { usePostSupportAndContractMutation } from "@/src/redux/page/profiledataApi";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    transactionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [postSupportAndContract, { isLoading: updating }] =
    usePostSupportAndContractMutation();
  // Support categories
  const supportCategories = [
    {
      id: 1,
      title: "Account Issues",
      value: "account",
      icon: "account-circle" as const,
      color: "#A78BFA",
    },
    {
      id: 2,
      title: "Technical Support",
      value: "technical",
      icon: "computer" as const,
      color: "#F59E0B",
    },
    {
      id: 3,
      title: "Billing & Payment",
      value: "billing",
      icon: "credit-card" as const,
      color: "#10B981",
    },
    {
      id: 4,
      title: "Feature Request",
      value: "feedback",
      icon: "lightbulb" as const,
      color: "#3B82F6",
    },
    {
      id: 5,
      title: "Report a Bug",
      value: "security",
      icon: "bug-report" as const,
      color: "#EF4444",
    },
    {
      id: 6,
      title: "General Enquiry",
      value: "general",
      icon: "chat" as const,
      color: "#8B5CF6",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (formData.phone && !/^[+]?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!selectedCategory) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const metadata = [];
      if (selectedCategory === "billing" && formData.transactionId) {
        metadata.push(`[Transaction ID: ${formData.transactionId}]`);
      }
      if (selectedCategory === "technical" || selectedCategory === "security") {
        metadata.push(`[Device OS: ${Platform.OS}]`);
        metadata.push(`[Device Version: ${Platform.Version}]`);
      }
      
      const finalMessage = metadata.length > 0 
        ? `${metadata.join("\n")}\n\n${formData.message}` 
        : formData.message;

      const payload = {
        name: formData.name,
        email: formData.email,
        category: selectedCategory,
        subject: formData.subject,
        message: finalMessage,
      };

      const response = await postSupportAndContract(payload).unwrap();
      if (response?.data?.ticketId) {
        setSubmittedTicket(response.data.ticketId);
      } else {
        setSubmittedTicket("TKT-SUCCESS"); // Fallback
      }
    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    iconName: keyof typeof Ionicons.glyphMap,
    keyboardType: "default" | "email-address" | "phone-pad" = "default",
    multiline = false,
    numberOfLines = 1,
  ) => (
    <View className="mb-6">
      <Text className="text-white text-base font-JosefinSansSemiBold mb-2">
        {label}
      </Text>
      <View
        className={`bg-white/5 border rounded-2xl px-4 flex-row items-center ${errors[field] ? "border-red-500" : "border-white/10"}`}
      >
        <Ionicons name={iconName} size={20} color="#9CA3AF" className="mr-3" />
        <TextInput
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-white text-base py-4 font-JosefinSansMedium"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={{ textAlignVertical: multiline ? "top" : "center" }}
        />
      </View>
      {errors[field] && (
        <Text className="text-red-400 text-sm mt-1 ml-1">{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-5 flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20"
          >
            <FontAwesome6 name="arrow-left" size={18} color="#A78BFA" />
          </TouchableOpacity>

          <Text className="text-center font-JosefinSansSemiBold text-2xl text-[#FFFFFF]">
            Contact Support
          </Text>

          <View className="w-10" />
        </View>

        {submittedTicket ? (
          <View className="flex-1 items-center justify-center px-6 -mt-20">
            <View className="w-24 h-24 bg-[#10B981]/20 rounded-full items-center justify-center mb-6 border-2 border-[#10B981]">
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>
            <Text className="text-white text-2xl font-JosefinSansBold mb-2 text-center">
              Ticket Submitted!
            </Text>
            <Text className="text-gray-300 text-center font-JosefinSansRegular text-base mb-2">
              Our team has received your request. We will review it and get back to you within 24 hours.
            </Text>
            <View className="bg-white/10 px-6 py-4 rounded-xl border border-white/20 mb-10 w-full">
              <Text className="text-center text-gray-400 font-JosefinSansMedium mb-1">Your Ticket ID is:</Text>
              <Text className="text-center text-white text-xl font-JosefinSansBold">{submittedTicket}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.9}
              className="h-14 w-full rounded-full bg-[#A78BFA] items-center justify-center shadow-lg"
            >
              <Text className="text-black font-bold text-lg">Return to Settings</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Introduction */}
            <View className="mb-8">
              <Text className="text-white text-lg font-JosefinSansSemiBold mb-2">
                How can we help you?
              </Text>
              <Text className="text-gray-300 font-JosefinSansRegular text-base">
                Our support team is here to assist you with any questions or
                issues you may have. We typically respond within 24 hours.
              </Text>
            </View>

            {/* Support Categories */}
            <View className="mb-8">
              <Text className="text-white text-lg font-JosefinSansBold mb-4">
                Select Category
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {supportCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      setSelectedCategory(category.value);
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: "" }));
                      }
                    }}
                    className={`w-[48%] mb-4 p-4 rounded-2xl border-2 ${
                      selectedCategory === category.value
                        ? "border-[#A78BFA] bg-white/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <View className="items-center">
                      <MaterialIcons
                        name={category.icon}
                        size={32}
                        color={category.color}
                        className="mb-2"
                      />
                      <Text className="text-white text-center text-sm font-JosefinSansMedium">
                        {category.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && (
                <Text className="text-red-400 text-sm mt-1 ml-1">
                  {errors.category}
                </Text>
              )}
            </View>

            {/* Contact Form */}
            <View className="mb-8">
              <Text className="text-white text-lg font-JosefinSansBold mb-4">
                Contact Information
              </Text>

              {renderInputField(
                "Full Name",
                "name",
                "Enter your full name",
                "person-outline",
              )}
              {renderInputField(
                "Email Address",
                "email",
                "Enter your email",
                "mail-outline",
                "email-address",
              )}
              {/* {renderInputField(
                "Phone Number (Optional)",
                "phone",
                "Enter your phone number",
                "call-outline",
                "phone-pad",
              )} */}
              {renderInputField(
                "Subject",
                "subject",
                "Brief description of your issue",
                "document-text-outline",
              )}

              {selectedCategory === "billing" && (
                renderInputField(
                  "Transaction ID (Optional)",
                  "transactionId",
                  "Enter payment reference",
                  "receipt-outline"
                )
              )}

              {/* Message Input */}
              <View className="mb-6">
                <Text className="text-white text-base font-JosefinSansSemiBold mb-2">
                  Message
                </Text>
                <View
                  className={`bg-white/5 border rounded-2xl px-4 ${errors.message ? "border-red-500" : "border-white/10"}`}
                >
                  <TextInput
                    value={formData.message}
                    onChangeText={(value) =>
                      handleInputChange("message", value)
                    }
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor="#9CA3AF"
                    className="text-white text-base py-4 min-h-[120px] font-JosefinSansMedium"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                {errors.message && (
                  <Text className="text-red-400 text-sm mt-1 ml-1">
                    {errors.message}
                  </Text>
                )}
              </View>
            </View>

            {/* Additional Contact Methods */}
            {/* <View className="mb-8">
              <Text className="text-white text-lg font-JosefinSansBold mb-4">
                Other Ways to Contact Us
              </Text>

              <View className="flex-col gap-2 space-y-4">
                <TouchableOpacity className="flex-row items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <View className="w-12 h-12 bg-[#A78BFA]/20 rounded-full items-center justify-center mr-4">
                    <Feather name="mail" size={24} color="#A78BFA" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white  font-PoppinsMedium">
                      Email
                    </Text>
                    <Text className="text-gray-300 text-sm font-PoppinsRegular">
                      rasel201311047@gmail.com
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                  <View className="w-12 h-12 bg-[#F59E0B]/20 rounded-full items-center justify-center mr-4">
                    <Feather name="phone" size={24} color="#F59E0B" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-PoppinsMedium">Phone</Text>
                    <Text className="text-gray-300 font-PoppinsRegular text-sm">
                      +880 1303679402
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.9}
              className={`h-16 rounded-full items-center justify-center mt-4 ${
                loading ? "bg-gray-600" : "bg-[#A78BFA]"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <View className="flex-row items-center">
                  <Ionicons
                    name="paper-plane-outline"
                    size={22}
                    color="#000"
                    className="mr-2"
                  />
                  <Text className="text-black font-bold text-lg">
                    Send Message
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ContactSupport;
