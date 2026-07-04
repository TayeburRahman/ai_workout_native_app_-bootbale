import { plusicon } from "@/assets/icon";
import { useGetmyhealthQuery } from "@/src/redux/page/homedataApi";
import responsive from "@/src/utils/responsive";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import CircularProgress from "../card/CircularProgress";
import LevelProcess from "../card/LevelProcess";
import AddNutritionModal from "./AddNutritionModal";

const Nutrition = () => {
  const { data: myHealthData, isLoading, error } = useGetmyhealthQuery();
  console.log("the data of sleep", myHealthData?.data?.nutrition?.remaining);
  const [open, setOpen] = useState(false);
  const dataNutition = [
    {
      name: "Carbs",
      process: myHealthData?.data?.nutrition?.progress?.carbs || 0,
      target: myHealthData?.data?.nutrition?.carbs || 0,
      activecolor: "#1EB0A3",
    },
    {
      name: "Protein",
      process: myHealthData?.data?.nutrition?.progress?.protein || 0,
      target: myHealthData?.data?.nutrition?.protein || 0,
      activecolor: "#1BB10B",
    },
    {
      name: "Fat",
      process: myHealthData?.data?.nutrition?.progress?.fat || 0,
      target: myHealthData?.data?.nutrition?.fat || 0,
      activecolor: "#D88220",
    },
  ];

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-[#FFFFFF] font-JosefinSansBold text-xl">
          Nutrition
        </Text>
        <View className="flex-row gap-[3%]">
          <Pressable
            onPress={() => setOpen(true)}
            className="w-10 h-10 bg-[#A895FF] rounded-full items-center justify-center"
          >
            <SvgXml xml={plusicon} width={20} height={20} color={"#121030"} />
          </Pressable>
        </View>
      </View>

      <View className="bg-[#FFFFFF1A] border border-[#59557A] py-4 rounded-xl w-full px-4 flex-row items-center justify-between">
        <View style={{ width: responsive.scale(178) }}>
          {dataNutition.map((item, indx) => (
            <View key={indx}>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg text-[#FFFFFF] font-JosefinSansMedium">
                  {item.name}
                </Text>
                <Text className="text-lg text-[#FFFFFF] font-JosefinSansMedium">
                  {Number((item.target * item.process) / 100).toFixed(2)}/
                  {Number(item.target).toFixed(2)}
                </Text>
              </View>
              <LevelProcess item={item} />
            </View>
          ))}
        </View>

        <View>
          <CircularProgress
            radius={65}
            strokeWidth={15}
            unit={""}
            value={myHealthData?.data?.nutrition?.calories || 0}
            label="Kcal Total"
            progress={myHealthData?.data?.nutrition?.progress?.protein || 0}
            activeColor={"#A895FF"}
            inactiveColor={"#FFFFFF1A"}
          />
        </View>
      </View>
      <AddNutritionModal open={open} close={() => setOpen(false)} />
    </View>
  );
};

export default Nutrition;
