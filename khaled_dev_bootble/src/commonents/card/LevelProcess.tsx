import React from "react";
import { View } from "react-native";

type Props = {
  item: {
    name: string;
    process: number;
    target: number;
    activecolor: string;
  };
};

const LevelProcess = ({ item }: Props) => {
  const progress = item.process;
  console.log("hello++===", progress);

  return (
    <View className="mt-2 mb-4">
      <View className="w-full h-[10px] bg-[#3E3A66] rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: item.activecolor,
          }}
        />
      </View>
    </View>
  );
};

export default LevelProcess;
