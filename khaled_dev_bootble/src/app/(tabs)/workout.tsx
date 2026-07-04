import { plusicon } from "@/assets/icon";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import AddWorkout from "@/src/commonents/workout/AddWorkout";
import AllWorkOut from "@/src/commonents/workout/AllWorkOut";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

const Workout = () => {
  const [open, setOpen] = useState(false);
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-[5%]">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="flex-row justify-between items-center mb-5">
              <View />
              <Text className="text-center font-JosefinSansSemiBold text-2xl text-[#FFFFFF]">
                Workout
              </Text>
              <View className="flex-row gap-[3%]">
                <Pressable
                  onPress={() => setOpen(true)}
                  className="w-10 h-10 bg-[#A895FF] rounded-full items-center justify-center"
                >
                  <SvgXml
                    xml={plusicon}
                    width={20}
                    height={20}
                    color={"#121030"}
                  />
                </Pressable>
              </View>
            </View>

            <AllWorkOut />
            <View className="h-48" />
          </ScrollView>
        </View>
        <AddWorkout open={open} close={() => setOpen(false)} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Workout;
