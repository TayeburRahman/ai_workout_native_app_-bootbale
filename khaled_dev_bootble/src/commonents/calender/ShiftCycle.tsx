import { useGetCalenderQuery } from "@/src/redux/page/calenderApi";
import { RootState } from "@/src/redux/store";
import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import SkeletonLoader from "../modarndesign/SkeletonLoader";
import CalenderSection from "./CalenderSection";
import DailyWorkOut from "./DailyWorkOut";
type DayType = "Work Day" | "Rotation Day" | "Recovery Day";
export interface WorkoutItem {
  time: string;
  title: string;
  subtitle: string;
}

const ShiftCycle: React.FC = () => {
  const datefilter = useSelector(
    (state: RootState) => state.global.global.datefilter,
  );

  // console.log("Selected Date:", datefilter);

  const filter = "all";

  const {
    data: calendershift,
    isLoading,
    isError,
  } = useGetCalenderQuery({
    datefilter,
    filter,
  });

  // console.log(calendershift?.data?.events);
  if (isLoading) {
    return <SkeletonLoader />;
  }
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(datefilter));

  // console.log("Selected Date:", formattedDate);

  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const getDayType = (date: Date): DayType => {
    const d = date.getDay();
    if (d === 1 || d === 2 || d === 3) return "Work Day";
    if (d === 4) return "Rotation Day";
    return "Recovery Day";
  };
  const today = new Date();

  return (
    <View className="flex-1">
      <CalenderSection />

      {/* Header */}
      <View className="my-4">
        <View className="flex-row items-center gap-3">
          <Text className="text-white text-lg font-JosefinSansSemiBold">
            {formattedDate}
          </Text>

          <View className="bg-[#F994101A] px-3 py-1 rounded-full">
            <Text className="text-[#F99410] text-sm font-JosefinSansMedium">
              {getDayType(new Date(datefilter))}
            </Text>
          </View>
        </View>
      </View>

      {/* Cards */}
      {calendershift?.data?.events &&
        calendershift?.data?.events.map((item, index) => (
          <DailyWorkOut key={index} item={item} />
        ))}
    </View>
  );
};

export default ShiftCycle;
