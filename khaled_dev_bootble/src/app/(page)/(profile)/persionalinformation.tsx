import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetProfileDataQuery } from "@/src/redux/page/profiledataApi";
import {
  getDisplayName,
  getProfilePhotoUri,
  formatProfileMetric,
} from "@/src/utils/authRouting";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PersonalInformation = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetProfileDataQuery();
  // console.log(myHealthData);

  if (isLoadingProfileData) {
    return <SkeletonLoader />;
  }

  const profilePhotoUri = getProfilePhotoUri(profileData?.data?.user);
  const profilePhotoSource = profilePhotoUri ? { uri: profilePhotoUri } : Images.user;

  const dob = profileData?.data?.user?.dateOfBirth;

  const formattedDate = dob ? new Date(dob).toLocaleDateString("en-GB") : "";
  const userData = {
    name: getDisplayName(profileData?.data?.user) || "",
    email: profileData?.data?.user?.email || "",
    location:
      [profileData?.data?.user?.location?.city, profileData?.data?.user?.location?.country]
        .filter(Boolean)
        .join(", ") || "",
    weight: formatProfileMetric(profileData?.data?.user?.weight),
    height: formatProfileMetric(profileData?.data?.user?.height),
    dob: profileData?.data?.user?.dateOfBirth ? formattedDate : "",
    gender: profileData?.data?.user?.gender || "",
    emergencyContact: profileData?.data?.user?.phoneNumber || "",
  };

  const InfoRow = ({
    label,
    value,
    icon,
    impactLabel,
  }: {
    label: string;
    value: string;
    icon?: string;
    impactLabel?: string;
  }) => (
    <View className="bg-white/5 rounded-2xl px-6 py-5 mb-3 border border-white/10 relative overflow-hidden">
      {impactLabel && (
        <View className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
      )}
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-[#A1A1AA] text-sm font-JosefinSansSemiBold tracking-wide">
          {label}
        </Text>
        <View className="flex-row items-center space-x-2 gap-2">
          {value ? (
            <Text className="text-white text-base font-JosefinSansSemiBold">
              {value}
            </Text>
          ) : (
            <View className="bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
              <Text className="text-red-400 text-xs font-JosefinSansMedium">
                Action Required
              </Text>
            </View>
          )}
          {icon && <Ionicons name={icon as any} size={18} color="#CBD5E1" />}
        </View>
      </View>
      {impactLabel && (
        <View className="flex-row items-center mt-1">
          <Ionicons name="analytics" size={12} color="#A78BFA" />
          <Text className="text-violet-300 text-xs ml-1 font-JosefinSansMedium">
            {impactLabel}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-[5%] pt-4 pb-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/10 rounded-full justify-center items-center backdrop-blur-sm border border-white/20"
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={20} color="#A5B4FC" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-JosefinSansSemiBold text-2xl text-white">
              Personal Information
            </Text>
            <Text className="font-JosefinSansRegular text-sm text-[#D1D5DB] mt-1">
              Manage your profile details
            </Text>
          </View>

          <View className="w-12" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <View className="px-[5%] pt-4">
            {/* Profile Picture */}
            <View className="items-center mb-8">
              <View className="relative">
                <Image
                  source={profilePhotoSource}
                  className="w-32 h-32 rounded-full border-4 border-white/20"
                />
                <TouchableOpacity
                  className="absolute bottom-2 right-2 w-10 h-10 bg-purple-600 rounded-full items-center justify-center border-2 border-white/30"
                  activeOpacity={0.8}
                >
                  <Ionicons name="star" size={18} color="#FFD700" />
                </TouchableOpacity>
              </View>
              <Text className="text-white font-JosefinSansSemiBold text-xl mt-4">
                {userData.name}
              </Text>
              <Text className="text-[#94A3B8] font-JosefinSansRegular text-sm mt-1">
                {profileData?.data?.user?.subscription?.plan?.toUpperCase() ||
                  ""}
              </Text>
            </View>

            {/* Information Section */}
            <View className="mb-6">
              <View className="flex-row items-center bg-violet-500/10 border border-violet-500/20 p-3 rounded-xl mb-4 ml-2">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <View className="ml-3">
                  <Text className="text-white font-JosefinSansSemiBold text-sm">System Status: Verified & Active</Text>
                  <Text className="text-[#94A3B8] font-JosefinSansRegular text-xs">Your data is actively driving AI personalization.</Text>
                </View>
              </View>

              <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-lg mb-4 ml-2">
                Basic Information
              </Text>

              <InfoRow label="Full Name" value={userData.name} />
              <InfoRow label="Email Address" value={userData.email} />
              <InfoRow
                label="Location"
                value={userData.location}
                impactLabel="Used for localized timezone scheduling"
              />

              <View className="flex-row justify-between gap-1 space-x-3">
                <View className="flex-1">
                  <InfoRow label="Weight" value={userData.weight} impactLabel="Drives goal targets" />
                </View>
                <View className="flex-1">
                  <InfoRow label="Height" value={userData.height} impactLabel="Drives macro targets" />
                </View>
              </View>

              <InfoRow
                label="Date of Birth"
                value={userData.dob}
                icon="calendar-outline"
                impactLabel="Drives age-based AI baselines"
              />
              <InfoRow label="Gender" value={userData.gender} impactLabel="Adjusts physiological calculations" />

              <View className="mt-6">
                <Text className="text-[#E2E8F0] font-JosefinSansSemiBold text-lg mb-4 ml-2">
                  Emergency Contact
                </Text>
                <InfoRow
                  label="Phone Number"
                  value={userData.emergencyContact}
                  icon="call-outline"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => router.push("/editprofile")}
                activeOpacity={0.9}
                className="mt-2"
              >
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
                  <View className="flex-row items-center space-x-3">
                    <Ionicons name="create-outline" size={22} color="white" />
                    <Text className="text-white font-JosefinSansSemiBold text-xl">
                      Edit Profile
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default PersonalInformation;
