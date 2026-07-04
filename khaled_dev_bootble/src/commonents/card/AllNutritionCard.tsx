import React from "react";
import { Text, View } from "react-native";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MacroPill = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
  return (
    <View className="flex-row items-center gap-2">
      <View
        className={`w-8 h-8 border-2 rounded-full items-center justify-center`}
        style={{ borderColor: color }}
      >
        <Text style={{ color }} className="text-xs font-JosefinSansBold">
          {label}
        </Text>
      </View>
      <Text className="text-[#FFFFFFB2] text-xs font-JosefinSansMedium">
        {value}g
      </Text>
    </View>
  );
};

const AllNutritionCard = ({ item }: any) => {
  // console.log(item);
  return (
    <View className=" flex-row items-center justify-between">
      {/* Left */}
      <View className="flex-1">
        <Text className="text-[#FFFFFFCC] font-JosefinSansRegular text-base">
          {item?.title}
        </Text>

        <Text className="text-[#FFFFFF] text-xl font-JosefinSansMedium mt-1">
          {item?.calories}{" "}
          <Text className="text-sm font-JosefinSansMedium">g</Text>
        </Text>

        {/* Macros */}
        <View className="flex-row gap-4 mt-2">
          <MacroPill label="C" value={item.carbs} color="#1EB0A3" />
          <MacroPill label="P" value={item.protein} color="#1BB10B" />
          <MacroPill label="F" value={item.fat} color="#D88220" />
        </View>
      </View>

      {/* Right */}
      <Text className="text-[#FFFFFFCC] text-base font-JosefinSansMedium">
        {formatDate(item.date)}
      </Text>
    </View>
  );
};

export default AllNutritionCard;
