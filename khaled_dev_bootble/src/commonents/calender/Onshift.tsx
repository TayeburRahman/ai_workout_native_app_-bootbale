import { useGetCalenderQuery } from "@/src/redux/page/calenderApi";
import { RootState } from "@/src/redux/store";
import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import SkeletonLoader from "../modarndesign/SkeletonLoader";
import CalenderSection from "./CalenderSection";
import DailyWorkOut from "./DailyWorkOut";
import { Ionicons } from "@expo/vector-icons";

type DayType = "Work Day" | "Rotation Day" | "Recovery Day";

const Onshift: React.FC = () => {
  const datefilter = useSelector(
    (state: RootState) => state.global.global.datefilter,
  );

  const filter = "on_shift";

  const {
    data: calendershift,
    isLoading,
    isError,
  } = useGetCalenderQuery({
    datefilter,
    filter,
  });

  const [timeText, setTimeText] = useState("");

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(datefilter));

  const getDayType = (date: Date): DayType => {
    const d = date.getDay();
    if (d === 1 || d === 2 || d === 3) return "Work Day";
    if (d === 4) return "Rotation Day";
    return "Recovery Day";
  };

  // Shift status and countdown timer logic
  useEffect(() => {
    if (!calendershift?.data) return;

    const updateCountdown = () => {
      const isToday = new Date(datefilter).toDateString() === new Date().toDateString();
      if (!isToday) {
        setTimeText(`Shift scheduled: ${calendershift.data.shiftStart} - ${calendershift.data.shiftEnd}`);
        return;
      }

      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();

      const parseTimeToMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const startMin = parseTimeToMinutes(calendershift.data.shiftStart || "08:00");
      const endMin = parseTimeToMinutes(calendershift.data.shiftEnd || "16:00");

      if (nowMin < startMin) {
        const diff = startMin - nowMin;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeText(`Shift starts in ${h > 0 ? `${h}h ` : ""}${m}m`);
      } else if (nowMin >= startMin && nowMin < endMin) {
        const diff = endMin - nowMin;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeText(`Shift ends in ${h > 0 ? `${h}h ` : ""}${m}m`);
      } else {
        const diff = nowMin - endMin;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeText(`Shift ended ${h > 0 ? `${h}h ` : ""}${m}m ago`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [calendershift, datefilter]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const dayTypeStr = getDayType(new Date(datefilter));
  const readiness = calendershift?.data?.readiness ?? 75;
  const isWorkDay = calendershift?.data?.dayType === "work";

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <CalenderSection />

      {/* Date Header */}
      <View className="my-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Text className="text-white text-lg font-JosefinSansSemiBold">
              {formattedDate}
            </Text>

            <View className="bg-[#F994101A] px-3 py-1 rounded-full">
              <Text className="text-[#F99410] text-sm font-JosefinSansMedium">
                {dayTypeStr}
              </Text>
            </View>
          </View>

          {/* Readiness Indicator */}
          {isWorkDay && (
            <View className="flex-row items-center bg-[#FFFFFF0A] border border-[#FFFFFF1A] px-3 py-1.5 rounded-2xl">
              <Ionicons
                name="heart-half-sharp"
                size={16}
                color={readiness >= 70 ? "#10B981" : readiness >= 50 ? "#F5A524" : "#EF4444"}
              />
              <Text className="text-white text-xs font-JosefinSansBold ml-1.5">
                Readiness: {readiness}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Fatigue Warning Banner */}
      {isWorkDay && readiness < 65 && (
        <View className="bg-[#EF444415] border border-[#EF444433] rounded-2xl p-4 mb-4 flex-row items-start">
          <Ionicons name="warning" size={20} color="#EF4444" className="mt-0.5" />
          <View className="ml-3 flex-1">
            <Text className="text-white text-sm font-JosefinSansBold">
              High Fatigue Level Detected
            </Text>
            <Text className="text-[#FFFFFFB2] text-xs font-JosefinSansMedium mt-0.5">
              Your workouts have been automatically downgraded to light, active recovery stretches to prioritize sleep safety and prevent overtraining.
            </Text>
          </View>
        </View>
      )}

      {/* Shift Countdown / Info Panel */}
      {isWorkDay && calendershift?.data?.shiftStart && (
        <View className="bg-[#A895FF15] border border-[#A895FF33] rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[#FFFFFFB2] text-xs font-JosefinSansMedium">
                ON-SHIFT ORCHESTRATION
              </Text>
              <Text className="text-white text-base font-JosefinSansBold mt-1">
                {timeText}
              </Text>
            </View>
            <Ionicons name="time" size={24} color="#A895FF" />
          </View>
        </View>
      )}

      {/* Events / Recommended Schedule */}
      <View className="pb-8">
        {calendershift?.data?.events && calendershift.data.events.length > 0 ? (
          calendershift.data.events.map((item: any, index: number) => (
            <DailyWorkOut key={item.id || index} item={item} />
          ))
        ) : (
          <View className="bg-[#FFFFFF05] border border-[#FFFFFF10] rounded-2xl py-8 items-center justify-center">
            <Ionicons name="calendar-outline" size={32} color="#FFFFFF40" />
            <Text className="text-[#FFFFFF80] text-sm font-JosefinSansMedium mt-2">
              No tasks scheduled for this day
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Onshift;
