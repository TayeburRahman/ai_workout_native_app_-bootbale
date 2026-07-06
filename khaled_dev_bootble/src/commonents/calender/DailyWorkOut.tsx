import { clock } from "@/assets/icon";
import {
  useCompleteEventMutation,
  useRescheduleEventMutation,
} from "@/src/redux/page/calenderApi";
import { RootState } from "@/src/redux/store";
import responsive from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";

export interface WorkoutItem {
  id: string;
  type: "workout" | "meal" | "recovery";
  time: string;
  title: string;
  subtitle: string;
  status:
    | "suggested"
    | "completed"
    | "done"
    | "logged"
    | "expired"
    | "missed"
    | "downgraded"
    | "rescheduled";
  isRecommended?: boolean;
}

interface Props {
  item: WorkoutItem;
}

const DailyWorkOut: React.FC<Props> = ({ item }) => {
  const router = useRouter();
  const datefilter = useSelector(
    (state: RootState) => state.global.global.datefilter,
  );

  const [completeEvent, { isLoading: isCompleting }] =
    useCompleteEventMutation();
  const [rescheduleEvent, { isLoading: isRescheduling }] =
    useRescheduleEventMutation();

  const [showReschedule, setShowReschedule] = useState(false);
  const [newTime, setNewTime] = useState(item.time);

  // Status mapping to colors and styling
  const isCompleted =
    item.status === "completed" ||
    item.status === "done" ||
    item.status === "logged";
  const isDowngraded = item.status === "downgraded";
  const isMissed = item.status === "missed" || item.status === "expired";
  const isSuggested =
    item.status === "suggested" || item.status === "rescheduled";

  let indicatorColor = "#A895FF";
  let gradientColors: readonly [string, string, ...string[]] = [
    "#A895FF1C",
    "#FFFFFF0A",
  ];
  let timeColor = "text-[#A895FF]";

  if (isCompleted) {
    indicatorColor = "#10B981";
    gradientColors = ["#10B9811C", "#FFFFFF0A"];
    timeColor = "text-[#10B981]";
  } else if (isDowngraded) {
    indicatorColor = "#F5A524";
    gradientColors = ["#F5A5241C", "#FFFFFF0A"];
    timeColor = "text-[#F5A524]";
  } else if (isMissed) {
    indicatorColor = "#EF4444";
    gradientColors = ["#EF444415", "#FFFFFF0A"];
    timeColor = "text-[#EF4444]";
  }

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    try {
      await completeEvent({
        eventType: item.type,
        eventId: item.id,
        date: datefilter,
        time: item.time,
      }).unwrap();
    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || "Failed to complete task");
    }
  };

  const handleReschedule = async () => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newTime)) {
      Alert.alert("Invalid Time", "Please use HH:MM format (24-hour clock)");
      return;
    }

    try {
      await rescheduleEvent({
        eventType: item.type,
        eventId: item.id,
        newTime,
        date: datefilter,
      }).unwrap();
      setShowReschedule(false);
    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || "Failed to reschedule task");
    }
  };

  const handleDeepLink = () => {
    if (item.type === "workout") {
      router.push("/workout");
    } else if (item.type === "meal") {
      router.push("/home");
    } else if (item.type === "recovery") {
      router.push("/sleeprecovery");
    }
  };

  return (
    <View>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={{
          width: "100%",
          height: responsive.verticalScale(94),

          borderRadius: 16,
          overflow: "hidden",
          paddingTop: 12,
          paddingBottom: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: isCompleted
            ? "#10B98133"
            : isDowngraded
              ? "#F5A52433"
              : "#FFFFFF1A",
        }}
      >
        <View className="flex-row items-center w-full h-full px-1">
          {/* Left State Indicator Bar */}
          <View
            className="w-1.5 h-full rounded-full mr-3"
            style={{ backgroundColor: indicatorColor }}
          />

          {/* Time & Clock Icon */}
          <View className="w-16 items-center justify-center">
            <Text className={`${timeColor} text-lg font-JosefinSansBold`}>
              {item.time}
            </Text>
          </View>

          {/* Content */}
          <View className="flex-1 pr-2">
            <View className="flex-row items-center flex-wrap">
              <Text
                className={`text-white text-base font-JosefinSansSemiBold ${isCompleted ? "line-through text-white/50" : ""}`}
              >
                {item.title}
              </Text>

              {/* Badges */}
              {isDowngraded && (
                <View className="bg-[#F5A5241F] px-2 py-0.5 rounded-full ml-2">
                  <Text className="text-[#F5A524] text-[10px] font-JosefinSansBold">
                    ⚠️ Adjusted
                  </Text>
                </View>
              )}
              {isMissed && (
                <View className="bg-[#EF44441F] px-2 py-0.5 rounded-full ml-2">
                  <Text className="text-[#EF4444] text-[10px] font-JosefinSansBold">
                    🕒 Expired
                  </Text>
                </View>
              )}
              {item.isRecommended &&
                !isCompleted &&
                !isDowngraded &&
                !isMissed && (
                  <View className="bg-[#A895FF1F] px-2 py-0.5 rounded-full ml-2">
                    <Text className="text-[#A895FF] text-[10px] font-JosefinSansBold">
                      Recommended
                    </Text>
                  </View>
                )}
            </View>

            <View className="flex-row items-center mt-1">
              <SvgXml
                xml={clock}
                width={12}
                height={12}
                color={indicatorColor}
              />
              <Text
                className="text-[#FFFFFFB2] text-xs font-JosefinSansMedium ml-1 flex-1"
                numberOfLines={1}
              >
                {item.subtitle}
              </Text>
            </View>

            {/* Quick Action Deep Link */}
            {isSuggested && (
              <TouchableOpacity
                onPress={handleDeepLink}
                className="mt-2 flex-row items-center"
                activeOpacity={0.7}
              >
                <Text className="text-[#A895FF] text-xs font-JosefinSansSemiBold mr-1">
                  {item.type === "workout"
                    ? "Go to Workouts"
                    : item.type === "meal"
                      ? "Log Meal Details"
                      : "Start Recovery Session"}
                </Text>
                <Ionicons
                  name="arrow-forward-outline"
                  size={12}
                  color="#A895FF"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Interactive Checkmark and Reschedule Buttons */}
          <View className="flex-row items-center space-x-2 gap-2 pr-3">
            {!isCompleted && !isMissed && (
              <TouchableOpacity
                onPress={() => setShowReschedule(true)}
                className="p-1.5 bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-full"
                activeOpacity={0.7}
              >
                <Ionicons name="time-outline" size={18} color="#FFFFFFB2" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleComplete}
              disabled={isCompleted || isMissed || isCompleting}
              className={`p-1.5 border rounded-full ${
                isCompleted
                  ? "bg-[#10B9811C] border-[#10B981]"
                  : isMissed
                    ? "bg-transparent border-[#EF4444]"
                    : "bg-[#FFFFFF05] border-[#FFFFFF22]"
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  isCompleted
                    ? "checkmark-circle"
                    : isMissed
                      ? "close-circle-outline"
                      : "ellipse-outline"
                }
                size={20}
                color={
                  isCompleted ? "#10B981" : isMissed ? "#EF4444" : "#FFFFFF60"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Reschedule Modal */}
      <Modal visible={showReschedule} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-[#1D192B] border border-[#FFFFFF1A] rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-white text-lg font-JosefinSansBold mb-4 text-center">
              Reschedule Activity
            </Text>

            <Text className="text-[#FFFFFFB2] text-sm font-JosefinSansMedium mb-3 text-center">
              Enter new time (24-hour format)
            </Text>

            <TextInput
              value={newTime}
              onChangeText={setNewTime}
              placeholder="e.g. 14:30"
              placeholderTextColor="#FFFFFF40"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              className="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-2xl py-3 px-4 text-white text-center text-lg font-JosefinSansBold mb-6"
            />

            <View className="flex-row space-x-3 gap-3">
              <TouchableOpacity
                onPress={() => setShowReschedule(false)}
                className="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF1A] py-3 rounded-2xl items-center"
              >
                <Text className="text-white font-JosefinSansSemiBold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReschedule}
                disabled={isRescheduling}
                className="flex-1 bg-[#A895FF] py-3 rounded-2xl items-center"
              >
                <Text className="text-black font-JosefinSansBold">
                  {isRescheduling ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DailyWorkOut;
