import { useGetmyhealthQuery } from "@/src/redux/page/homedataApi";
import responsive from "@/src/utils/responsive";
import React from "react";
import { View } from "react-native";
import ThreeItemCard from "../card/ThreeItemCard";

const ThreeDataC = () => {
  const { data: myHealthData, isLoading, error } = useGetmyhealthQuery();
  // console.log("the data of sleep", myHealthData?.data?.scores);
  const items = [
    {
      radius: responsive.scale(45),
      strokeWidth: 15,
      unit: "%",
      value: myHealthData?.data?.scores?.recovery || 0,
      progress: myHealthData?.data?.scores?.recovery || 0,
      activeColor: "#86F0FB",
      inactiveColor: "#393E5A",
      title: "Recovery",
      subTitle: "Fatigue-adjusted target",
    },
    {
      radius: responsive.scale(45),
      strokeWidth: 15,
      unit: "h",
      value: myHealthData?.data?.scores?.sleep / 60 || 0,
      progress: myHealthData?.data?.scores?.sleep || 0,
      activeColor: "#9E8CFF",
      inactiveColor: "#393E5A",
      title: "Sleep",
      subTitle: "Quality: Excellent",
    },
    {
      radius: responsive.scale(45),
      strokeWidth: 15,
      unit: "%",
      value: myHealthData?.data?.scores?.readiness || 0,
      progress: myHealthData?.data?.scores?.readiness || 0,
      activeColor: "#1BB10B",
      inactiveColor: "#393E5A",
      title: "Readiness",
      subTitle: "Recovery-focused day",
    },
  ];

  return (
    <View className="flex-row justify-between gap-[2%] mb-5">
      {items.map((item, index) => (
        <ThreeItemCard key={index} {...item} />
      ))}
    </View>
  );
};

export default ThreeDataC;
