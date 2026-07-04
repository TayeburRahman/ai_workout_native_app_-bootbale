import { clock } from "@/assets/icon";
import { normalizeMediaUrl } from "@/src/utils/authRouting";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { router } from "expo-router";
interface WorkoutItem {
  _id: string;
  category: string;
  createdAt: string;
  description: string | null;
  durationMinutes: number;
  equipment: any[];
  exercises: any[];
  imageUrl: string;
  intensity: string;
  isActive: boolean;
  isPublic: boolean;
  tags: any[];
  updatedAt: string;
  videoUrl: string | null;
  userId: {
    _id: string;
    name: string;
  };
  title: string;
}
interface Props {
  item: WorkoutItem;
}

const WorkOurCard: React.FC<Props> = ({ item }) => {
  const fixedImageUrl = item?.imageUrl ? normalizeMediaUrl(item.imageUrl) : "";

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/workout/${item._id}` as any);
      }}
      className="w-[48%] mb-5 border border-[#FFFFFF33] bg-[#FFFFFF1A] rounded-2xl p-2"
    >
      {/* Workout Image */}

      <Image
        source={{ uri: fixedImageUrl }}
        className="w-full h-32 rounded-xl"
        resizeMode="cover"
      />

      {/* Title */}
      <Text className="text-[#FFFFFF] font-JosefinSansBold text-lg mt-2 ">
        {item.title}
      </Text>

      {/* Duration */}
      <View className="flex-row items-center mt-1 pb-2">
        <SvgXml xml={clock} width={14} height={14} color={"#A895FF"} />
        <Text className="text-[#FFFFFFB2] text-sm font-JosefinSansMedium ml-1">
          {item.durationMinutes} min Session
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WorkOurCard;
