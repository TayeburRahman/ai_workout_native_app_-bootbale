import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

interface ActionItem {
  title: string;
  reason: string;
  type?: string;
  priority?: string;
  deepLink?: string;
}

interface ActionPlan {
  now: ActionItem[];
  later: ActionItem[];
  skip: ActionItem[];
}

const DailyActionBlock = ({ actionPlan }: { actionPlan?: ActionPlan }) => {
  if (!actionPlan) return null;

  const hasNow = actionPlan.now && actionPlan.now.length > 0;
  const hasLater = actionPlan.later && actionPlan.later.length > 0;
  const hasSkip = actionPlan.skip && actionPlan.skip.length > 0;

  if (!hasNow && !hasLater && !hasSkip) return null;

  const ActionRow = ({ item, isSkip = false }: { item: ActionItem; isSkip?: boolean }) => {
    const handlePress = () => {
      if (item.deepLink) {
        router.push(item.deepLink as any);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={!item.deepLink || isSkip}
        className={`flex-row items-center p-3 rounded-xl mb-2 border ${
          isSkip
            ? "bg-[#2A2B3D] border-[#393E5A]"
            : item.priority === "high"
            ? "bg-[#FF6D2A1A] border-[#FF6D2A33]"
            : "bg-white/5 border-white/10"
        }`}
      >
        <View className="flex-1">
          <Text
            className={`text-base font-JosefinSansSemiBold ${
              isSkip ? "text-white/50" : "text-white"
            } mb-1`}
          >
            {item.title}
          </Text>
          <Text className="text-xs font-JosefinSansRegular text-white/60">
            {item.reason}
          </Text>
        </View>

        {!isSkip && item.deepLink && (
          <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
            <FontAwesome6 name="arrow-right" size={12} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-lg font-JosefinSansSemiBold">
          Action Plan
        </Text>
      </View>

      {hasNow && (
        <View className="mb-3">
          <Text className="text-xs font-JosefinSansMedium text-[#FF6D2A] uppercase tracking-wider mb-2">
            Do Now
          </Text>
          {actionPlan.now.map((item, idx) => (
            <ActionRow key={`now-${idx}`} item={item} />
          ))}
        </View>
      )}

      {hasLater && (
        <View className="mb-3">
          <Text className="text-xs font-JosefinSansMedium text-[#A5B4FC] uppercase tracking-wider mb-2">
            Later Today
          </Text>
          {actionPlan.later.map((item, idx) => (
            <ActionRow key={`later-${idx}`} item={item} />
          ))}
        </View>
      )}

      {hasSkip && (
        <View className="mb-1">
          <Text className="text-xs font-JosefinSansMedium text-white/40 uppercase tracking-wider mb-2">
            Skip / Rest
          </Text>
          {actionPlan.skip.map((item, idx) => (
            <ActionRow key={`skip-${idx}`} item={item} isSkip />
          ))}
        </View>
      )}
    </View>
  );
};

export default DailyActionBlock;
