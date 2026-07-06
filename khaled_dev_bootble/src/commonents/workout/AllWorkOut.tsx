import { useGetProfileDataQuery } from "@/src/redux/page/profiledataApi";
import { useGetWorkoutsQuery } from "@/src/redux/page/workoutApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View, TouchableOpacity } from "react-native";
import WorkOurCard from "../card/WorkOurCard";
import SkeletonLoader from "../modarndesign/SkeletonLoader";

const AllWorkOut: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "my_workouts">("discover");

  const { data: profileData } = useGetProfileDataQuery();
  const currentUserId = profileData?.data?.user?._id;

  const {
    data: WorkoutData,
    isLoading: isLoadingWorkout,
    isError,
    refetch,
  } = useGetWorkoutsQuery();

  const allWorkouts = WorkoutData?.data || [];

  // Filter based on tab first
  const tabFilteredWorkouts = allWorkouts.filter((workout: any) => {
    if (activeTab === "discover") {
      // System generated ones have null userId
      return !workout.userId || workout.userId === null;
    } else {
      // User created ones
      return workout.userId?._id === currentUserId;
    }
  });

  const filteredWorkouts = tabFilteredWorkouts.filter((workout: any) =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoadingWorkout) {
    return <SkeletonLoader />;
  }

  const recommendedWorkouts = filteredWorkouts.filter((w: any) => w.recommended);
  const otherWorkouts = filteredWorkouts.filter((w: any) => !w.recommended);

  // Function to chunk array into rows for grid
  const chunkArray = (arr: any[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );
  };

  const recommendedRows = chunkArray(recommendedWorkouts, 2);
  const otherRows = chunkArray(otherWorkouts, 2);

  return (
    <View className="flex-1">
      {/* Tabs */}
      <View className="flex-row mb-5 border-b border-white/10">
        <TouchableOpacity
          onPress={() => setActiveTab("discover")}
          className={`pb-3 flex-1 items-center border-b-2 ${activeTab === "discover" ? "border-[#A895FF]" : "border-transparent"}`}
        >
          <Text className={`text-base font-JosefinSansSemiBold ${activeTab === "discover" ? "text-[#A895FF]" : "text-gray-400"}`}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("my_workouts")}
          className={`pb-3 flex-1 items-center border-b-2 ${activeTab === "my_workouts" ? "border-[#A895FF]" : "border-transparent"}`}
        >
          <Text className={`text-base font-JosefinSansSemiBold ${activeTab === "my_workouts" ? "text-[#A895FF]" : "text-gray-400"}`}>My Workouts</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="border border-[#FFFFFF33] bg-[#FFFFFF1A] flex-row items-center px-4 py-1 mb-4 rounded-2xl">
        <Ionicons name="search" size={18} color="#EBE9FF" />
        <TextInput
          placeholder="Search workouts..."
          placeholderTextColor="#FFFFFF99"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="ml-3 flex-1 text-white text-base font-JosefinSansSemiBold"
        />
      </View>

      {/* Results Count */}
      {searchQuery.length > 0 && (
        <Text className="text-[#FFFFFF99] text-sm font-JosefinSansMedium mb-2">
          Found {filteredWorkouts.length} workouts
        </Text>
      )}

      {/* ScrollView with grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {filteredWorkouts.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Ionicons name="fitness-outline" size={48} color="#FFFFFF33" />
            <Text className="text-[#FFFFFF99] text-lg font-JosefinSansMedium mt-4">
              No workouts found
            </Text>
          </View>
        ) : (
          <View>
            {/* Recommended Section */}
            {recommendedWorkouts.length > 0 && activeTab === "discover" && (
              <View className="mb-6">
                <View className="flex-row items-center mb-3">
                  <View className="w-1.5 h-6 bg-[#10B981] rounded-full mr-3" />
                  <Text className="font-JosefinSansBold text-xl text-white">Recommended for You</Text>
                </View>
                {recommendedRows.map((row, rowIndex) => (
                  <View
                    key={`rec-row-${rowIndex}`}
                    className="flex-row justify-between mb-4"
                  >
                    {row.map((item) => (
                      <WorkOurCard item={item} key={item._id} />
                    ))}
                    {row.length === 1 && <View className="w-[48%]" />}
                  </View>
                ))}
              </View>
            )}

            {/* General Library Section */}
            {otherWorkouts.length > 0 && (
              <View>
                {(recommendedWorkouts.length > 0 && activeTab === "discover") && (
                  <Text className="font-JosefinSansSemiBold text-lg text-white/70 mb-3">
                    Workout Library
                  </Text>
                )}
                {otherRows.map((row, rowIndex) => (
                  <View
                    key={`oth-row-${rowIndex}`}
                    className="flex-row justify-between mb-4"
                  >
                    {row.map((item) => (
                      <WorkOurCard item={item} key={item._id} />
                    ))}
                    {row.length === 1 && <View className="w-[48%]" />}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AllWorkOut;
