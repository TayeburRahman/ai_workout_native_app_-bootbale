import { medal } from "@/assets/icon";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

const Subscription = () => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.error("Error fetching offerings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOfferings();
  }, []);

  const getIntervalLabel = (pkg: PurchasesPackage): string => {
    switch (pkg.packageType) {
      case "MONTHLY":
        return "/ month";
      case "ANNUAL":
        return "/ year";
      case "LIFETIME":
        return "";
      default:
        return "";
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pkg);
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error("Purchase error:", e);
      }
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <SafeAreaView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#9C8CFF" />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-[5%] flex-row items-center justify-between mt-2 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[38px] h-[38px] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center"
          >
            <FontAwesome6 name="arrow-left" size={18} color="#A895FF" />
          </TouchableOpacity>

          <Text className="font-JosefinSansSemiBold text-2xl text-white">
            Subscription
          </Text>

          <View className="w-[38px]" />
        </View>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-[5%] space-y-4 flex-col gap-4">
            {packages.map((pkg, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-[#FFFFFF14] border border-[#FFFFFF26] rounded-2xl px-4 py-4"
              >
                {/* Left */}
                <View className="flex-row items-center space-x-3 gap-[4%]">
                  <View className="w-10 h-10 bg-[#EBE9FF] rounded-full items-center justify-center">
                    <SvgXml
                      xml={medal}
                      width={24}
                      height={24}
                      color={"#121030"}
                    />
                  </View>

                  <View>
                    <Text className="text-white font-JosefinSansSemiBold text-base">
                      {pkg.product.title}
                    </Text>
                    <Text className="text-[#FFFFFF] font-JosefinSansMedium text-sm">
                      {pkg.product.priceString} {getIntervalLabel(pkg)}
                    </Text>
                  </View>
                </View>

                {/* Button */}
                <TouchableOpacity
                  onPress={() => handlePurchase(pkg)}
                  className="bg-[#9C8CFF] px-5 py-2 rounded-full"
                >
                  <Text className="text-white font-JosefinSansSemiBold text-sm">
                    {pkg.packageType === "LIFETIME" ? "Buy Once" : "Subscribe"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Subscription;
