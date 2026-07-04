import { RootState } from "@/src/redux/store";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import OffShift from "./OffShift";
import Onshift from "./Onshift";
import ShiftCycle from "./ShiftCycle";

const CalenderPage = () => {
  const [activeButton, setActiveButton] = useState("Schedule");
  const datefilter = useSelector(
    (state: RootState) => state.global.global.datefilter,
  );

  console.log("Selected Date:", datefilter);
  return (
    <View>
      <View className="mt-6 mb-4 bg-[#FFFFFF1A] border border-[#59557A] py-1 rounded-lg w-full px-1 flex-row justify-between items-center">
        {["Schedule", "On-Shift", "Off-Shift"].map((item, indx) => (
          <TouchableOpacity
            key={indx}
            onPress={() => setActiveButton(item)}
            className={`${activeButton === item ? "bg-[#A895FF]" : "bg-transparent"} w-[32%] justify-center items-center rounded-lg py-2`}
          >
            <Text
              className={`${activeButton === item ? "text-[#121030]" : "text-[#FFFFFF]"} font-JosefinSansSemiBold text-base`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        {activeButton === "Schedule" && <ShiftCycle />}
        {activeButton === "On-Shift" && <Onshift />}
        {activeButton === "Off-Shift" && <OffShift />}
      </View>
    </View>
  );
};

export default CalenderPage;
