import { clock } from "@/assets/icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import SleepRecoveryModal from "../sleep/SleepRecoveryModal";

const iconMapping = {
  post_shift_wind_down: "apple-icloud",
  daytime_sleep: "white-balance-sunny",
  nervous_system_reset: "weather-windy",
  pre_shift_focus: "arrow-projectile",
  night_sleep: "shield-moon-outline",
  nap: "flash",
};

// Color mapping for tags
const colorMapping = {
  sleep: "#10B981",
  any_time: "#3B82F6",
  before_shift: "#F59E0B",
};

const SleepRecoveryCard = ({ item }: { item: any }) => {
  const [thekey, setTheKey] = useState("");
  const [open, setOpen] = useState(false);
  const iconName = iconMapping[item.key as keyof typeof iconMapping] || "sleep";
  const tagColor = item.color || colorMapping[item.timingTag as keyof typeof colorMapping] || "#A895FF";
  const durationText =
    item.minDuration && item.maxDuration
      ? `${item.minDuration}-${item.maxDuration} minutes`
      : item.duration || "Flexible duration";
  console.log(thekey);
  return (
    <TouchableOpacity
      onPress={() => {
        setTheKey(item.key);
        setOpen(true);
      }}
      className="bg-[#FFFFFF1A] rounded-2xl p-4 shadow-lg mb-4"
    >
      <View className="flex-row items-center justify-between mb-3">
        {/* Icon */}
        <View className="flex-row items-center">
          <View className="h-12 w-12 rounded-full bg-[#EBE9FF] items-center justify-center">
            <MaterialCommunityIcons name={iconName as any} size={24} color="#121030" />
          </View>
          {item.recommended && (
            <View className="ml-3 bg-[#10B981]/20 px-2 py-1 rounded border border-[#10B981]/30">
              <Text className="text-[#10B981] text-[10px] font-JosefinSansBold uppercase tracking-wider">Top Match</Text>
            </View>
          )}
        </View>

        {/* Tag */}
        <View
          style={{ backgroundColor: `${tagColor}20`, borderRadius: 50 }}
          className="px-3 py-1.5 rounded-full"
        >
          <Text
            style={{ color: tagColor }}
            className="text-xs font-JosefinSansSemiBold"
          >
            {item.timingTag?.replace("_", " ") || "Recovery"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="font-JosefinSansBold text-white text-lg mb-1">
          {item.title}
        </Text>

        <Text className="text-[#FFFFFFCC] font-JosefinSansMedium text-sm leading-5 mb-3">
          {item.description}
        </Text>

        <View className="flex-row items-center">
          <SvgXml xml={clock} width={16} height={16} color="#A895FF" />
          <Text className="text-[#FFFFFFCC] text-xs ml-2 font-JosefinSansSemiBold">
            {durationText}
          </Text>
        </View>

        {item.recommended && item.recommendationReason && (
          <View className="mt-3 bg-[#10B981]/10 rounded-xl p-2.5 border border-[#10B981]/20 flex-row items-start">
            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#10B981" style={{ marginTop: 2 }} />
            <Text className="text-[#10B981] font-JosefinSansMedium text-xs ml-2 flex-1">
              {item.recommendationReason}
            </Text>
          </View>
        )}
      </View>

      <SleepRecoveryModal
        open={open}
        close={() => setOpen(false)}
        keyofsleeprecovery={thekey}
      />
    </TouchableOpacity>
  );
};

export default SleepRecoveryCard;
