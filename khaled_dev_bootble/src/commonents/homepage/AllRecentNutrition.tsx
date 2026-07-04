import { useGetmyhealthQuery } from "@/src/redux/page/homedataApi";
import React from "react";
import { Text, View } from "react-native";
import AllNutritionCard from "../card/AllNutritionCard";

const AllRecentNutrition = () => {
  const { data: myHealthData, isLoading, error } = useGetmyhealthQuery();
  console.log("the data of sleep", myHealthData?.data?.recentMeals);

  return (
    <View className="">
      <Text className="text-[#FFFFFF] font-JosefinSansBold text-xl mb-5">
        All Nutrition
      </Text>
      <View className=" flex-col gap-5 ">
        {myHealthData?.data?.recentMeals &&
          myHealthData?.data?.recentMeals.map((item, indx) => (
            <View
              key={indx}
              className="bg-[#FFFFFF1A] border border-[#59557A] py-4 rounded-xl w-full px-4"
            >
              <AllNutritionCard item={item} />
            </View>
          ))}
      </View>
    </View>
  );
};

export default AllRecentNutrition;
