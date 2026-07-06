import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import {
  useGetProfileDataQuery,
  useUpdateUserProfileImageMutation,
  useUpdateUserProfileMutation,
} from "@/src/redux/page/profiledataApi";
import {
  formatProfileMetric,
  getDisplayName,
  getProfilePhotoUri,
} from "@/src/utils/authRouting";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
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

const EditProfile = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetProfileDataQuery();
  const [updateUserProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();
  const [updateUserProfileImage, { isLoading: imageupdating }] =
    useUpdateUserProfileImageMutation();

  if (isLoadingProfileData) {
    return <SkeletonLoader />;
  }

  // Parse date of birth
  const dob = profileData?.data?.user?.dateOfBirth;
  const initialDate = dob ? new Date(dob) : null;

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Initial user data
  const [userData, setUserData] = useState({
    name: getDisplayName(profileData?.data?.user) || "",
    email: profileData?.data?.user?.email || "",
    location: [profileData?.data?.user?.location?.city, profileData?.data?.user?.location?.country].filter(Boolean).join(", ") || "",
    weight: formatProfileMetric(profileData?.data?.user?.weight),
    height: formatProfileMetric(profileData?.data?.user?.height),
    dob: initialDate as Date | null,
    dobDisplay: formatDateForDisplay(initialDate),
    gender: profileData?.data?.user?.gender || "",
    emergencyContact: profileData?.data?.user?.phoneNumber || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // recent profile photo

  const recentProfilePhotoUri = getProfilePhotoUri(profileData?.data?.user);
  const recentProfilePhotoSource = recentProfilePhotoUri
    ? { uri: recentProfilePhotoUri }
    : Images.user;

  // Handle image picker
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Handle camera capture
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera access is required to take photos.",
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  // Show image picker options
  const handleImageOption = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setUserData({
        ...userData,
        dob: selectedDate,
        dobDisplay: formatDateForDisplay(selectedDate),
      });
      // Clear dob error if they pick a new date
      if (errors.dob) setErrors({ ...errors, dob: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors: Record<string, string> = {};

    // Name
    if (!userData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Height
    const heightNum = Number(userData.height);
    if (!userData.height || isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
      newErrors.height = "Must be between 50-250 cm";
      isValid = false;
    }

    // Weight
    const weightNum = Number(userData.weight);
    if (!userData.weight || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.weight = "Must be between 30-300 kg";
      isValid = false;
    }

    // Age
    if (!userData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    } else {
      const today = new Date();
      const dobDate = new Date(userData.dob);
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      
      if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
        isValid = false;
      } else if (age < 13) {
        newErrors.dob = "You must be at least 13 years old";
        isValid = false;
      }
    }

    // Gender
    if (!userData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please correct the highlighted errors before saving.");
      return;
    }

    try {
      if (profileImage) {
        const formData = new FormData();

        formData.append("profilePhoto", {
          uri: profileImage,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);

        try {
          await updateUserProfileImage(formData).unwrap();
        } catch {
          Alert.alert(
            "Profile photo update failed",
            "Your other profile details will still be saved.",
          );
        }
      }
      await updateUserProfile({
        name: userData.name.trim(),
        height: Number(userData.height),
        weight: Number(userData.weight),
        phoneNumber: userData.emergencyContact.replace(/[^0-9+]/g, ''),
        dateOfBirth: userData.dob,
        gender: userData?.gender?.toLowerCase(),
        location: {
          city: "Rajshahi",
          country: "Bangladesh",
        },
      }).unwrap();

      router.back();
    } catch {
      Alert.alert("Update failed", "Please try again.");
    }
  };

  // Input field component
  // const InputField = ({
  //   label,
  //   value,
  //   onChangeText,
  //   placeholder,
  //   keyboardType = "default",
  //   icon,
  //   multiline = false,
  // }) => (
  //   <View className="mb-5">
  //     <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
  //       {label}
  //     </Text>
  //     <View className="relative">
  //       <TextInput
  //         className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-JosefinSansSemiBold text-base"
  //         value={value}
  //         onChangeText={onChangeText ? onChangeText : () => {}}
  //         placeholder={placeholder}
  //         placeholderTextColor="#94A3B8"
  //         keyboardType={keyboardType}
  //         multiline={multiline}
  //         numberOfLines={multiline ? 3 : 1}
  //       />
  //       {icon && (
  //         <View className="absolute right-4 top-0 bottom-0 justify-center">
  //           <Ionicons name={icon} size={20} color="#CBD5E1" />
  //         </View>
  //       )}
  //     </View>
  //   </View>
  // );

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/10 rounded-full justify-center items-center backdrop-blur-sm border border-white/20"
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={20} color="#A5B4FC" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-JosefinSansSemiBold text-2xl text-white">
              Edit Profile
            </Text>
            <Text className="font-JosefinSansRegular text-sm text-[#D1D5DB] mt-1">
              Update your information
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            className="w-12 h-12 bg-white/10 rounded-full justify-center items-center border border-white/20"
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={24} color="#10B981" />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
            className=""
          >
            <View className="px-6 pt-4">
              {/* Profile Picture Section */}
              <View className="items-center mb-8">
                <TouchableOpacity
                  onPress={handleImageOption}
                  activeOpacity={0.8}
                  className="relative"
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      className="w-32 h-32 rounded-full border-4 border-white/30"
                      resizeMode="cover"
                    />
                  ) : profileData?.data?.user?.profilePhoto ? (
                    <Image
                      source={recentProfilePhotoSource}
                      className="w-32 h-32 rounded-full border-4 border-white/30"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/30 items-center justify-center">
                      <Ionicons name="person" size={60} color="white" />
                    </View>
                  )}

                  <View className="absolute -bottom-2 right-0 w-12 h-12 bg-purple-600 rounded-full items-center justify-center border-4 border-[#1E1B4B] shadow-lg">
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleImageOption}
                  activeOpacity={0.7}
                  className="mt-4"
                >
                  <Text className="text-[#A5B4FC] font-JosefinSansSemiBold text-base">
                    Change Profile Picture
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View className="mb-6">
                <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-lg mb-4 ml-1">
                  Personal Information
                </Text>

                <View className="mb-5">
                  <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                    Full Name
                  </Text>
                  <View className="relative">
                    <TextInput
                      className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-JosefinSansSemiBold text-base"
                      value={userData.name}
                      onChangeText={(text) =>
                        setUserData({ ...userData, name: text })
                      }
                      placeholder="Enter your full name"
                      placeholderTextColor="#94A3B8"
                    />

                    <View className="absolute right-4 top-0 bottom-0 justify-center">
                      <Ionicons
                        name={"person-outline"}
                        size={20}
                        color="#CBD5E1"
                      />
                    </View>
                  </View>
                  {errors.name && (
                    <Text className="text-red-400 text-xs font-JosefinSansMedium mt-1 ml-1">{errors.name}</Text>
                  )}
                </View>

                {/* <InputField
                  label="Full Name"
                  value={userData.name}
                  onChangeText={(text) =>
                    setUserData({ ...userData, name: text })
                  }
                  placeholder="Enter your full name"
                  icon="person-outline"
                /> */}

                {/* <InputField
                  label="Email Address"
                  value={userData.email}
                  onChangeText={(text) =>
                    setUserData({ ...userData, email: text })
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  icon="mail-outline"
                /> */}
                <View className="mb-5">
                  <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                    Email Address
                  </Text>
                  <View className="relative">
                    <TextInput
                      className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-JosefinSansSemiBold text-base"
                      value={userData.email}
                      onChangeText={(text) =>
                        setUserData({ ...userData, email: text })
                      }
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      placeholderTextColor="#94A3B8"
                    />

                    <View className="absolute right-4 top-0 bottom-0 justify-center">
                      <Ionicons
                        name={"mail-outline"}
                        size={20}
                        color="#CBD5E1"
                      />
                    </View>
                  </View>
                  {errors.email && (
                    <Text className="text-red-400 text-xs font-JosefinSansMedium mt-1 ml-1">{errors.email}</Text>
                  )}
                </View>

                <View className="flex-row justify-between gap-[2%] space-x-3">
                  <View className="flex-1">
                    <View className="mb-5">
                      <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                        Weight (Kg)
                      </Text>
                      <View className="relative">
                        <TextInput
                          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-JosefinSansSemiBold text-base"
                          value={userData.weight}
                          onChangeText={(text) => {
                            const numericVal = text.replace(/[^0-9.]/g, "");
                            setUserData({ ...userData, weight: numericVal });
                          }}
                          placeholder="e.g. 70"
                          keyboardType="numeric"
                          placeholderTextColor="#94A3B8"
                        />

                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                          <Ionicons
                            name={"scale-outline"}
                            size={20}
                            color="#CBD5E1"
                          />
                        </View>
                      </View>
                      {errors.weight && (
                        <Text className="text-red-400 text-[10px] font-JosefinSansMedium mt-1 ml-1">{errors.weight}</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-1">
                    <View className="mb-5">
                      <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                        Height (cm)
                      </Text>
                      <View className="relative">
                        <TextInput
                          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-JosefinSansSemiBold text-base"
                          value={userData.height}
                          onChangeText={(text) => {
                            const numericVal = text.replace(/[^0-9.]/g, "");
                            setUserData({ ...userData, height: numericVal });
                          }}
                          placeholder="e.g. 175"
                          keyboardType="decimal-pad"
                          placeholderTextColor="#94A3B8"
                        />

                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                          <Ionicons
                            name={"resize-outline"}
                            size={20}
                            color="#CBD5E1"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Date of Birth Picker */}
                <View className="mb-5">
                  <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                    Date of Birth
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                    className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex-row justify-between items-center"
                  >
                    <Text className="text-white font-JosefinSansSemiBold text-base">
                      {userData.dobDisplay}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={22}
                      color="#CBD5E1"
                    />
                  </TouchableOpacity>
                  {errors.dob && (
                    <Text className="text-red-400 text-xs font-JosefinSansMedium mt-1 ml-1">{errors.dob}</Text>
                  )}
                </View>

                {/* Gender Selection */}
                <View className="mb-5">
                  <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                    Gender
                  </Text>
                  <View className="flex-row gap-[2%] space-x-3">
                    {["Male", "Female", "Other"].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        onPress={() => setUserData({ ...userData, gender })}
                        className={`flex-1 py-3 rounded-2xl items-center justify-center border ${
                          userData.gender === gender
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-white/5 border-white/10"
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`font-JosefinSansSemiBold text-base ${
                            userData.gender === gender
                              ? "text-white"
                              : "text-[#CBD5E1]"
                          }`}
                        >
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.gender && (
                    <Text className="text-red-400 text-xs font-JosefinSansMedium mt-1 ml-1">{errors.gender}</Text>
                  )}
                </View>

                {/* Emergency Contact */}
                <View className="mt-2">
                  <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-lg mb-4 ml-1">
                    Emergency Contact
                  </Text>

                  <View className="mb-5">
                    <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-sm mb-2 ml-1">
                      Emergency Contact Number
                    </Text>
                    <View className="relative">
                      <TextInput
                        className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-JosefinSansSemiBold text-base"
                        value={userData.emergencyContact}
                        onChangeText={(text) => {
                          const phoneVal = text.replace(/[^0-9+]/g, "");
                          setUserData({ ...userData, emergencyContact: phoneVal });
                        }}
                        placeholder="Enter emergency contact"
                        keyboardType="phone-pad"
                        placeholderTextColor="#94A3B8"
                      />

                      <View className="absolute right-4 top-0 bottom-0 justify-center">
                        <Ionicons
                          name={"resize-outline"}
                          size={20}
                          color="#CBD5E1"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="space-y-4 flex-col gap-3 mt-4">
                <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
                  <LinearGradient
                    colors={["#8B5CF6", "#6366F1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="h-14 rounded-2xl items-center justify-center shadow-lg"
                    style={{
                      shadowColor: "#8B5CF6",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      borderRadius: 8,
                      height: 56,
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0px 4px 8px rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    <Text className="text-white font-JosefinSansSemiBold text-xl">
                      Save Changes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.7}
                  className="h-14 rounded-2xl bg-white/5 border border-white/10 items-center justify-center"
                >
                  <Text className="text-[#CBD5E1] font-JosefinSansSemiBold text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={userData.dob || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
            textColor="#FFFFFF"
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
};

export default EditProfile;
