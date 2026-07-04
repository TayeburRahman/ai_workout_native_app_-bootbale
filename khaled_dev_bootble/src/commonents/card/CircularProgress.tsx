import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  radius?: number;
  strokeWidth?: number;
  progress?: number;
  value?: number | string;
  label?: string;
  activeColor?: string;
  inactiveColor?: string;
  unit?: string;
}

const CircularProgress: React.FC<Props> = ({
  radius = 10,
  strokeWidth = 15,
  progress = 0,
  value,
  label,
  activeColor,
  inactiveColor,
  unit,
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View className=" items-center justify-center ">
      <Svg height={radius * 2} width={radius * 2}>
        {/* Background Circle */}
        <Circle
          stroke={inactiveColor}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Active Progress Circle */}
        <Circle
          stroke={activeColor}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${radius}, ${radius}`}
        />
      </Svg>

      {/* Center Text */}
      <View className=" absolute items-center ">
        <Text className="font-JosefinSansSemiBold text-xl text-[#FFFFFF]">
          {value}
          {unit}
        </Text>
        {label && (
          <Text className="font-JosefinSansSemiBold text-base text-[#FFFFFFB2]">
            {label}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CircularProgress;
