import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetWorkoutByIdQuery } from "@/src/redux/page/workoutApi";
import { normalizeMediaUrl } from "@/src/utils/authRouting";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const WorkoutPreview = () => {
  const { id } = useLocalSearchParams();

  const { data: response, isLoading, isError } = useGetWorkoutByIdQuery(id as string);
  const workout = response?.data;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError || !workout) {
    return (
      <GradientBackground>
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Workout not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-white/20 px-4 py-2 rounded-xl">
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const fixedImageUrl = workout?.imageUrl ? normalizeMediaUrl(workout.imageUrl) : "";

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-5 flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20"
          >
            <FontAwesome6 name="arrow-left" size={18} color="#A78BFA" />
          </TouchableOpacity>
          <Text className="text-center font-JosefinSansSemiBold text-xl text-[#FFFFFF]">
            Workout Overview
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Hero Image */}
          {fixedImageUrl ? (
            <Image
              source={{ uri: fixedImageUrl }}
              className="w-full h-56 rounded-b-3xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-56 bg-white/5 rounded-b-3xl items-center justify-center">
              <Ionicons name="image-outline" size={48} color="#FFFFFF33" />
            </View>
          )}

          <View className="px-5 pt-6 pb-24">
            {/* Title & Description */}
            <Text className="text-white text-3xl font-JosefinSansBold mb-2">
              {workout.title}
            </Text>
            {workout.description && (
              <Text className="text-gray-300 text-sm font-JosefinSansRegular mb-6">
                {workout.description}
              </Text>
            )}

            {/* Quick Stats */}
            <View className="flex-row justify-between mb-8">
              <View className="bg-white/5 p-4 rounded-2xl flex-1 mr-2 items-center border border-white/10">
                <Ionicons name="time-outline" size={24} color="#A78BFA" className="mb-2" />
                <Text className="text-white font-JosefinSansBold">{workout.durationMinutes} min</Text>
                <Text className="text-gray-400 text-xs mt-1">Duration</Text>
              </View>
              <View className="bg-white/5 p-4 rounded-2xl flex-1 mx-1 items-center border border-white/10">
                <Ionicons name="flame-outline" size={24} color="#F59E0B" className="mb-2" />
                <Text className="text-white font-JosefinSansBold capitalize">{workout.intensity}</Text>
                <Text className="text-gray-400 text-xs mt-1">Intensity</Text>
              </View>
              <View className="bg-white/5 p-4 rounded-2xl flex-1 ml-2 items-center border border-white/10">
                <Ionicons name="fitness-outline" size={24} color="#10B981" className="mb-2" />
                <Text className="text-white font-JosefinSansBold">{workout.exercises?.length || 0}</Text>
                <Text className="text-gray-400 text-xs mt-1">Exercises</Text>
              </View>
            </View>

            {/* Equipment */}
            {workout.equipment && workout.equipment.length > 0 && workout.equipment[0] !== "none" && (
              <View className="mb-8">
                <Text className="text-white text-lg font-JosefinSansBold mb-3">Equipment Required</Text>
                <View className="flex-row flex-wrap gap-2">
                  {workout.equipment.map((eq: string, idx: number) => (
                    <View key={idx} className="bg-[#1A1F40] px-4 py-2 rounded-full border border-gray-700">
                      <Text className="text-gray-300 text-sm capitalize font-JosefinSansMedium">{eq.replace("_", " ")}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Exercises List Preview */}
            <View className="mb-6">
              <Text className="text-white text-lg font-JosefinSansBold mb-4">Plan Overview</Text>
              {workout.exercises?.map((ex: any, index: number) => (
                <View key={index} className="flex-row items-center bg-white/5 p-4 rounded-2xl mb-3 border border-white/10">
                  <View className="w-10 h-10 bg-[#A78BFA]/20 rounded-full items-center justify-center mr-4">
                    <Text className="text-[#A78BFA] font-bold">{index + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-JosefinSansSemiBold text-base">{ex.name}</Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {ex.sets} sets × {ex.reps} reps {ex.weight ? `• ${ex.weight}kg` : ""}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Start Button */}
        <View className="absolute bottom-0 left-0 right-0 p-5 bg-[#0C1234]/90 pb-8">
          <TouchableOpacity
            onPress={() => router.push(`/workout/session/${workout._id}` as any)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#8B5CF6", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 rounded-full items-center justify-center shadow-lg"
            >
              <View className="flex-row items-center">
                <Ionicons name="play" size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold text-lg tracking-wide">
                  Start Session
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default WorkoutPreview;
