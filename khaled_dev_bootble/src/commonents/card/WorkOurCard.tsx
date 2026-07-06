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
  recommended?: boolean;
  recommendationReason?: string;
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

      <View className="relative">
        <Image
          source={{ uri: fixedImageUrl }}
          className="w-full h-32 rounded-xl"
          resizeMode="cover"
        />
        {item.recommended && (
          <View className="absolute top-2 left-2 bg-[#10B981]/90 px-2 py-1 rounded-md border border-[#10B981]">
            <Text className="text-white text-[10px] font-JosefinSansBold uppercase tracking-wider">Top Match</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text className="text-[#FFFFFF] font-JosefinSansBold text-lg mt-2 ">
        {item.title}
      </Text>

      {/* Duration */}
      <View className="flex-row items-center mt-1 pb-1">
        <SvgXml xml={clock} width={14} height={14} color={"#A895FF"} />
        <Text className="text-[#FFFFFFB2] text-sm font-JosefinSansMedium ml-1">
          {item.durationMinutes} min Session
        </Text>
      </View>

      {/* Recommendation Reason */}
      {item.recommended && item.recommendationReason && (
        <View className="mt-1 bg-[#10B981]/10 rounded-lg p-1.5 border border-[#10B981]/20">
          <Text className="text-[#10B981] font-JosefinSansMedium text-[10px] leading-3 text-center">
            {item.recommendationReason}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default WorkOurCard;
