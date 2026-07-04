import responsive from "@/src/utils/responsive";
import React from "react";
import { Text, View } from "react-native";
import CircularProgress from "./CircularProgress";

interface Props {
  radius: number;
  strokeWidth: number;
  unit: string;
  value: number;
  progress: number;
  activeColor: string;
  inactiveColor: string;
  title: string;
  subTitle: string;
}
const ThreeItemCard: React.FC<Props> = ({
  radius,
  strokeWidth,
  unit,
  value,
  progress,
  activeColor,
  inactiveColor,
  title,
  subTitle,
}) => {
  return (
    <View
      className="bg-[#FFFFFF1A] border border-[#59557A] py-4 rounded-xl"
      style={{ width: responsive.scale(124) }}
    >
      <CircularProgress
        radius={radius}
        strokeWidth={strokeWidth}
        unit={unit}
        value={value}
        progress={progress}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />

      <Text className=" text-center my-2 font-JosefinSansRegular text-[#FFFFFF] text-lg">
        {title}
      </Text>
      <Text className="text-center text-base text-[#C0BFCD] font-JosefinSansMedium">
        {subTitle}
      </Text>
    </View>
  );
};

export default ThreeItemCard;
