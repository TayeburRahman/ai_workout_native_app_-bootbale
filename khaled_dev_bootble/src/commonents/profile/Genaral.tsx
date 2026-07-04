import { Images } from "@/assets/extra/images";
import {
  com,
  faq,
  logout,
  policy,
  rightButton,
  roboticon,
  sub,
  tearm,
  usericon,
  moonsun
} from "@/assets/icon";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import { getDisplayName, getProfilePhotoUri } from "@/src/utils/authRouting";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import LogoutModal from "./LogoutModal";
const Genaral = () => {
  const [logoutModal, setLogoutModal] = useState(false);

  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    isError,
  } = useGetMyProfileQuery();
  // console.log(myHealthData);

  const profilePhotoUri = getProfilePhotoUri(profileData?.data?.user);
  const profilePhotoSource = profilePhotoUri ? { uri: profilePhotoUri } : Images.user;
  const profileName = getDisplayName(profileData?.data?.user);

  const subscriptionPlan = profileData?.data?.user?.subscription?.plan || "free";
  const subscriptionStatus = subscriptionPlan === "free" ? "Free Plan" : `${subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)} Plan`;
  const aiStatus = subscriptionPlan !== "free" ? "Active" : "Upgrade Required";

  return (
    <ScrollView className="flex-1 ">
      {/* Profile Section */}
      <View className="  mx-auto my-3 ">
        <View className="flex-row items-center">
          <View className="w-24 h-24 rounded-full justify-center items-center ">
            <Image
              source={profilePhotoSource}
              className="w-full h-full rounded-full "
            />

            {/* <View className=" absolute right-[2%]  bottom-[2%]">
              <TouchableOpacity
                onPress={() => router.push("/editprofile")}
                className="bg-[#A895FF] w-[24] h-[24] border border-[#121030] items-center justify-center rounded-full "
              >
                <SvgXml xml={edit} width={12} height={12} color={"#121030"} />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
        <Text className="text-xl mt-2 text-[#FFFFFF] text-center font-JosefinSansSemiBold">
          {profileName}
        </Text>
      </View>

      <Text className="text-base text-[#FFFFFF] font-JosefinSansSemiBold  my-2">
        General Settings
      </Text>
      <View className="space-y-3">
        {[
          {
            title: "Personal Information",
            icon: usericon,
            route: "/persionalinformation",
          },
          {
            title: "Work Schedule",
            icon: moonsun,
            route: "/shiftSelection",
          },
          {
            title: "Subscription", 
            icon: sub, 
            route: "/subcription",
            subtitle: subscriptionStatus,
            subtitleColor: subscriptionPlan !== "free" ? "#10B981" : "#94A3B8"
          },
          { 
            title: "AI Assistant", 
            icon: roboticon, 
            route: "/gptassistant",
            subtitle: aiStatus,
            subtitleColor: subscriptionPlan !== "free" ? "#10B981" : "#F87171"
          },
        ].map((item, i) => (
          <TouchableOpacity
            onPress={() => item.route && router.push(item.route as any)}
            key={i}
            className="bg-[#FFFFFF1A] border border-[#FFFFFF33] p-4 rounded-2xl  flex-row justify-between items-center mb-[2%]"
          >
            <View className="flex-row items-center">
              <View className="w-[20] h-[20] rounded-full bg-[#EBE9FF] justify-center items-center">
                <SvgXml
                  xml={item.icon}
                  width={14}
                  height={14}
                  color={"#121030"}
                />
              </View>
              <View className="ml-3">
                <Text className="text-[#FFFFFF] font-JosefinSansSemiBold text-base">
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text style={{ color: item.subtitleColor || "#94A3B8" }} className="font-JosefinSansMedium text-xs mt-0.5">
                    {item.subtitle}
                  </Text>
                )}
              </View>
            </View>
            <SvgXml
              xml={rightButton}
              width={10}
              height={10}
              color={"#A895FF"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* More Section */}
      <Text className="text-base text-[#FFFFFF] font-JosefinSansSemiBold  my-2">
        Other Settings
      </Text>

      <View className="space-y-3 mb-8">
        {[
          { title: "Term & Conditions", icon: tearm, route: "/tearcondition" },
          { title: "Privacy Policy", icon: policy, route: "/policy" },
          { title: "FAQs", icon: faq, route: "/faqs" },
          { title: "Contact Support", icon: com, route: "/contactSupport" },
        ].map((item, i) => (
          <TouchableOpacity
            onPress={() => item.route && router.push(item.route as any)}
            key={i}
            className="bg-[#FFFFFF1A] border border-[#FFFFFF33] p-4 rounded-2xl  flex-row justify-between items-center mb-[2%]"
          >
            <View className="flex-row items-center">
              <View className="w-[20] h-[20] rounded-full bg-[#EBE9FF] justify-center items-center">
                <SvgXml
                  xml={item.icon}
                  width={14}
                  height={14}
                  color={"#121030"}
                />
              </View>

              <Text className="ml-3 text-[#FFFFFF] font-JosefinSansSemiBold  text-base">
                {item.title}
              </Text>
            </View>
            <SvgXml
              xml={rightButton}
              width={10}
              height={10}
              color={"#A895FF"}
            />
          </TouchableOpacity>
        ))}

        {/* Log Out */}
        <TouchableOpacity
          onPress={() => setLogoutModal(true)}
          className="bg-[#FFFFFF1A] border border-[#FFFFFF33] p-4 rounded-2xl flex-row items-center"
        >
          <View className="w-[20] h-[20] rounded-full bg-[#EBE9FF] justify-center items-center">
            <SvgXml xml={logout} width={14} height={14} color={"#E34949"} />
          </View>
          <Text className="ml-3 text-[#E34949] font-JosefinSansSemiBold  text-base">
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
      {/* =====================
      logout
      ==============================*/}
      <LogoutModal
        visible={logoutModal}
        onClose={() => setLogoutModal(false)}
      />
    </ScrollView>
  );
};

export default Genaral;
