import { Images } from "@/assets/extra/images";
import { notification } from "@/assets/icon";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import {
  getDisplayName,
  getProfilePhotoUri,
} from "@/src/utils/authRouting";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";

const Navber = () => {
  const currentHour = new Date().getHours();
  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetMyProfileQuery();
  // console.log(profileData?.data?.user?.profilePhoto);

  const getGreeting = () => {
    if (currentHour >= 5 && currentHour < 18) return "Day";
    if (currentHour >= 18 && currentHour < 22) return "Night";
  };

  // data nav

  const profilePhotoUri = getProfilePhotoUri(profileData?.data?.user);
  const profilePhotoSource = profilePhotoUri ? { uri: profilePhotoUri } : Images.user;
  const profileName = getDisplayName(profileData?.data?.user);
  return (
    <View className="flex-row justify-between items-center ">
      <View className="flex-row items-center gap-[3%]">
        <TouchableOpacity onPress={() => router.replace("/profile")}>
          <Image
            source={profilePhotoSource}
            className="rounded-full w-16 h-16 border-2 border-color3"
          />
        </TouchableOpacity>
        <View>
          <Text className="font-JosefinSansSemiBold text-sm text-[#86F0FB]">
            Pre-Shift {getGreeting()},
          </Text>
          <Text className="text-[#FFFFFF] font-JosefinSansSemiBold  text-xl">
            {profileName} !
          </Text>
        </View>
      </View>

      <View className="flex-row gap-[3%]">
        <Pressable
          onPress={() => router.push("/notification")}
          className="w-14 h-14 bg-[#A895FF] rounded-full items-center justify-center"
        >
          <SvgXml xml={notification} width={24} height={24} color={"#121030"} />
        </Pressable>
      </View>
    </View>
  );
};

export default Navber;
