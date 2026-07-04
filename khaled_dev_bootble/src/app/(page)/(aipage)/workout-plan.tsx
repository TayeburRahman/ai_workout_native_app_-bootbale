import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import { useGetWorkoutPlanQuery } from "@/src/redux/page/aiApi";
import { FontAwesome6, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const scale = (size: number) => {
  const baseWidth = 375;
  return (screenWidth / baseWidth) * size;
};

const getImageSize = () => {
  if (screenWidth < 375) return { width: scale(140), height: scale(140) };
  else if (screenWidth < 414) return { width: scale(160), height: scale(160) };
  else if (screenWidth < 768) return { width: scale(180), height: scale(180) };
  else return { width: scale(220), height: scale(220) };
};

const getWorkoutIcon = (workout: string): string => {
  const workoutLower = workout?.toLowerCase() || "";
  if (workoutLower.includes("upper")) return "arm-flex";
  if (workoutLower.includes("lower")) return "seat-legroom-reduced";
  if (workoutLower.includes("full body")) return "dumbbell";
  if (workoutLower.includes("cardio")) return "heart-pulse";
  if (workoutLower.includes("yoga") || workoutLower.includes("stretching")) return "meditation";
  if (workoutLower.includes("recovery")) return "walk";
  if (workoutLower.includes("rest")) return "sleep";
  return "dumbbell";
};

const getWorkoutColor = (workout: string): string => {
  const workoutLower = workout?.toLowerCase() || "";
  if (workoutLower.includes("upper")) return "#FF6B6B";
  if (workoutLower.includes("lower")) return "#4ECDC4";
  if (workoutLower.includes("full body")) return "#FF6B6B";
  if (workoutLower.includes("cardio")) return "#4ECDC4";
  if (workoutLower.includes("yoga") || workoutLower.includes("stretching")) return "#A8E6CF";
  if (workoutLower.includes("recovery")) return "#FFD93D";
  if (workoutLower.includes("rest")) return "#6C5CE7";
  return "#A895FF";
};

const getIntensityColor = (intensity: string) => {
  if (intensity === "High") return "#ef4444";
  if (intensity === "Medium") return "#f59e0b";
  if (intensity === "Low") return "#3b82f6";
  if (intensity === "Recovery" || intensity === "Rest") return "#10b981";
  return "#9ca3af";
};

const PeriodSelector = ({
  selectedPeriod,
  onSelect,
}: {
  selectedPeriod: "week" | "month";
  onSelect: (period: "week" | "month") => void;
}) => (
  <View className="flex-row bg-[#FFFFFF1A] rounded-full p-1 mb-6 mt-4">
    <TouchableOpacity
      onPress={() => onSelect("week")}
      className={`flex-1 py-3 rounded-full ${selectedPeriod === "week" ? "bg-[#A895FF]" : ""}`}
    >
      <Text className={`text-center font-JosefinSansSemiBold ${selectedPeriod === "week" ? "text-white" : "text-white/60"}`}>
        Week
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => onSelect("month")}
      className={`flex-1 py-3 rounded-full ${selectedPeriod === "month" ? "bg-[#A895FF]" : ""}`}
    >
      <Text className={`text-center font-JosefinSansSemiBold ${selectedPeriod === "month" ? "text-white" : "text-white/60"}`}>
        Month
      </Text>
    </TouchableOpacity>
  </View>
);

const WorkoutBriefModal = ({ visible, item, onClose }: { visible: boolean, item: any, onClose: () => void }) => {
  if (!item) return null;
  const color = getWorkoutColor(item.workout);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable className="flex-1 bg-black/80 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-[#0C1234] rounded-t-3xl pt-6 px-5 pb-8 min-h-[60%] max-h-[90%]">
          
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-2xl font-JosefinSansBold">{item.displayDay || item.day}</Text>
              <Text className="text-[#A78BFA] text-base font-JosefinSansSemiBold mt-1">{item.workout}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-white/10 p-2 rounded-full">
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Meta tags */}
            <View className="flex-row flex-wrap gap-2 mb-6">
              <View className="bg-white/10 px-3 py-1.5 rounded-full flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#A78BFA" />
                <Text className="text-white text-xs font-JosefinSansSemiBold ml-1">{item.duration || 0} min</Text>
              </View>
              <View className="bg-white/10 px-3 py-1.5 rounded-full flex-row items-center border border-white/5" style={{ borderColor: getIntensityColor(item.intensity) }}>
                <Ionicons name="flame-outline" size={14} color={getIntensityColor(item.intensity)} />
                <Text className="text-white text-xs font-JosefinSansSemiBold ml-1">{item.intensity || "Auto"} Intensity</Text>
              </View>
            </View>

            {/* Coaching Notes */}
            {item.notes && (
              <View className="mb-6 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="chatbubbles" size={16} color="#A78BFA" />
                  <Text className="text-[#A78BFA] font-JosefinSansBold ml-2 text-sm">Coach's Notes</Text>
                </View>
                <Text className="text-white/80 font-JosefinSansRegular leading-5 text-sm">{item.notes}</Text>
              </View>
            )}

            {/* Exercises List */}
            {item.exercises && item.exercises.length > 0 ? (
              <View className="mb-6">
                <Text className="text-white text-lg font-JosefinSansBold mb-3">Generated Exercises</Text>
                {item.exercises.map((ex: any, idx: number) => (
                  <View key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2 flex-row items-center">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}20` }}>
                      <Text className="text-white font-JosefinSansBold text-xs">{idx + 1}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-JosefinSansSemiBold text-sm mb-1">{ex.name}</Text>
                      <View className="flex-row items-center">
                        <Text className="text-gray-400 text-xs capitalize">{ex.body_part}</Text>
                        <Text className="text-gray-600 text-xs mx-2">•</Text>
                        <Text className="text-gray-400 text-xs capitalize">{ex.equipment || "Bodyweight"}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center py-8 opacity-50">
                <Ionicons name="bed-outline" size={48} color="white" />
                <Text className="text-white font-JosefinSansMedium mt-4">Rest & Recover</Text>
              </View>
            )}
          </ScrollView>

          {/* Start Session Action */}
          {item.exercises && item.exercises.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                onClose();
                router.push({
                  pathname: "/(page)/workout/session/[id]",
                  params: { id: item.workout.replace(/\s+/g, '_').toLowerCase() }
                } as any);
              }}
              className="mt-6 rounded-full py-4 items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <Text className="text-white font-JosefinSansBold text-base">Start Session</Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const Workout_plan = () => {
  const [imageSize] = useState(getImageSize());
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const { data: profileData, isLoading: isLoadingProfileData } = useGetMyProfileQuery();
  const { data: workOutData, isLoading: isLoadingWorkout } = useGetWorkoutPlanQuery({
    goal: profileData?.data?.user?.goalType || "maintenance",
    period: selectedPeriod,
  });

  const processedData = useMemo(() => {
    if (!workOutData?.data) return null;
    const data = workOutData.data;

    let totalWorkouts = 0;
    let totalMinutes = 0;
    let workoutDays = 0;

    if (selectedPeriod === "week") {
      data.schedule?.forEach((item: any) => {
        totalMinutes += item.duration || 0;
        if (item.duration > 0) workoutDays++;
      });
      totalWorkouts = workoutDays;
    } else {
      const weekMap = new Map();
      data.schedule?.forEach((item: any) => {
        totalMinutes += item.duration || 0;
        if (item.duration > 0) workoutDays++;

        const weekMatch = item.day.match(/Week (\d+)/);
        if (weekMatch) {
          const weekNum = weekMatch[1];
          if (!weekMap.has(weekNum)) weekMap.set(weekNum, []);
          weekMap.get(weekNum).push(item);
        }
      });
      totalWorkouts = workoutDays;
    }

    return {
      ...data,
      totalWorkouts,
      totalMinutes,
      workoutDays,
    };
  }, [workOutData, selectedPeriod]);

  const sections = useMemo(() => {
    if (!processedData?.schedule || selectedPeriod === "week") return [];

    const weekMap = new Map();
    processedData.schedule.forEach((item: any) => {
      const weekMatch = item.day.match(/Week (\d+)/);
      if (weekMatch) {
        const weekNum = weekMatch[1];
        const dayName = item.day.replace(/Week \d+ /, "");

        if (!weekMap.has(weekNum)) {
          weekMap.set(weekNum, { title: `Week ${weekNum}`, data: [] });
        }
        weekMap.get(weekNum).data.push({ ...item, displayDay: dayName });
      }
    });

    return Array.from(weekMap.values());
  }, [processedData, selectedPeriod]);

  if (isLoadingWorkout || isLoadingProfileData) {
    return <SkeletonLoader />;
  }

  const getDayAbbreviation = (day: string) => {
    const dayMatch = day.match(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/);
    if (dayMatch) return dayMatch[1].substring(0, 3).toUpperCase();
    return day.substring(0, 3).toUpperCase();
  };

  const renderWorkoutCard = ({ item }: { item: any }) => {
    const displayDay = item.displayDay || item.day;
    const icon = getWorkoutIcon(item.workout);
    const color = getWorkoutColor(item.workout);

    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        className="mb-3"
        onPress={() => setSelectedDay(item)}
      >
        <LinearGradient
          colors={["#1a1a2e3a", "#2323423f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-4 border border-white/10"
        >
          <View className="flex-row items-center">
            {/* Day Indicator */}
            <View className="w-12 h-12 rounded-full bg-white/10 justify-center items-center mr-4">
              <Text className="text-white text-sm font-JosefinSansBold">{getDayAbbreviation(item.day)}</Text>
            </View>

            {/* Workout Info */}
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-white/60 text-sm font-JosefinSansRegular mr-2">{displayDay}</Text>
                {item.duration > 0 && (
                  <View className="bg-[#A895FF]/20 px-2 py-0.5 rounded-full mr-2">
                    <Text className="text-[#A895FF] text-[10px] font-JosefinSansSemiBold">{item.duration} min</Text>
                  </View>
                )}
                {item.intensity && (
                  <View className="px-2 py-0.5 rounded-full border border-white/10" style={{ backgroundColor: `${getIntensityColor(item.intensity)}20` }}>
                    <Text style={{ color: getIntensityColor(item.intensity) }} className="text-[10px] font-JosefinSansSemiBold">
                      {item.intensity}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-white text-base font-JosefinSansSemiBold">{item.workout}</Text>
            </View>

            {/* Icon */}
            <View className="w-10 h-10 rounded-full bg-white/5 justify-center items-center">
              <MaterialCommunityIcons name={icon as any} size={scale(20)} color={color} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView className="flex-1">
        <View className="px-[5%] flex-row justify-between items-center py-4 z-10">
          <TouchableOpacity onPress={() => router.back()} className="w-[38] h-[38] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full justify-center items-center">
            <FontAwesome6 name="arrow-left" size={scale(18)} color="#A895FF" />
          </TouchableOpacity>
          <Text className="text-center font-JosefinSansSemiBold text-[#FFFFFF]" style={{ fontSize: scale(24) }}>AI Program</Text>
          <View className="w-[38]" />
        </View>

        <View className="absolute inset-0 flex-1 items-center justify-center opacity-30">
          <Image source={Images.gpt} resizeMode="contain" style={imageSize} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-[5%]" contentContainerStyle={{ paddingBottom: scale(30) }}>
          <PeriodSelector selectedPeriod={selectedPeriod} onSelect={setSelectedPeriod} />

          {processedData && (
            <LinearGradient
              colors={["#8A75E6", "#6B4FE0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6 mb-6 rounded-2xl shadow-lg"
            >
              <Text className="text-white text-3xl font-JosefinSansBold mb-2">{processedData.title}</Text>
              <Text className="text-white text-sm font-JosefinSansRegular opacity-90 mb-4 leading-5">{processedData.description}</Text>

              <View className="flex-row justify-between mt-2">
                <View className="items-center flex-1">
                  <Text className="text-white text-2xl font-JosefinSansBold">{processedData.workoutDays}</Text>
                  <Text className="text-white text-xs font-JosefinSansRegular opacity-80 mt-1">Workouts</Text>
                </View>
                <View className="w-[1] bg-white opacity-30" />
                <View className="items-center flex-1">
                  <Text className="text-white text-2xl font-JosefinSansBold">{processedData.totalMinutes}</Text>
                  <Text className="text-white text-xs font-JosefinSansRegular opacity-80 mt-1">Total Mins</Text>
                </View>
                <View className="w-[1] bg-white opacity-30" />
                <View className="items-center flex-1">
                  <Text className="text-white text-2xl font-JosefinSansBold">{selectedPeriod === "week" ? "7" : "28"}</Text>
                  <Text className="text-white text-xs font-JosefinSansRegular opacity-80 mt-1">Days Plan</Text>
                </View>
              </View>
            </LinearGradient>
          )}

          <View className="mb-4">
            <Text className="text-white text-xl font-JosefinSansSemiBold mb-2">{selectedPeriod === "week" ? "Weekly Schedule" : "Monthly Program"}</Text>
            <Text className="text-[#A78BFA] text-sm font-JosefinSansRegular mb-4">Tap on any day to view the AI coaching brief</Text>
          </View>

          {selectedPeriod === "week"
            ? processedData?.schedule?.map((item: any, index: number) => <View key={index}>{renderWorkoutCard({ item })}</View>)
            : sections.map((section) => (
                <View key={section.title} className="mb-6">
                  <LinearGradient
                    colors={["#A895FF30", "#6B4FE030"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-xl p-3 mb-3"
                  >
                    <Text className="text-white text-lg font-JosefinSansBold text-center">{section.title}</Text>
                  </LinearGradient>
                  {section.data.map((item: any, index: number) => <View key={index}>{renderWorkoutCard({ item })}</View>)}
                </View>
              ))}
        </ScrollView>

        <WorkoutBriefModal 
          visible={!!selectedDay} 
          item={selectedDay} 
          onClose={() => setSelectedDay(null)} 
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Workout_plan;
