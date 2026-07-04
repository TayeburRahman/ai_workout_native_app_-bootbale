import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetWorkoutByIdQuery, usePostWorkoutcompletionMutation } from "@/src/redux/page/workoutApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// Type definitions for tracking state
interface TrackedSet {
  completed: boolean;
  reps: number;
  weight: number;
}
interface TrackedExercise {
  name: string;
  sets: TrackedSet[];
}

const WorkoutSession = () => {
  const { id } = useLocalSearchParams();
  const { data: response, isLoading, isError } = useGetWorkoutByIdQuery(id as string);
  const [postWorkoutCompletion, { isLoading: isSubmitting }] = usePostWorkoutcompletionMutation();

  const workout = response?.data;

  // Session State
  const [startTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Tracking State
  const [trackedExercises, setTrackedExercises] = useState<TrackedExercise[]>([]);
  
  // Completion Form State
  const [rpe, setRpe] = useState<number>(5);
  const [notes, setNotes] = useState("");

  // Initialize tracking state when workout loads
  useEffect(() => {
    if (workout?.exercises && trackedExercises.length === 0) {
      const initialTracking = workout.exercises.map((ex: any) => {
        const setsArray = [];
        for (let i = 0; i < (ex.sets || 1); i++) {
          setsArray.push({
            completed: false,
            reps: ex.reps || 0,
            weight: ex.weight || 0,
          });
        }
        return { name: ex.name, sets: setsArray };
      });
      setTrackedExercises(initialTracking);
    }
  }, [workout]);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleSetCompletion = (exIndex: number, setIndex: number) => {
    const newTracking = [...trackedExercises];
    newTracking[exIndex].sets[setIndex].completed = !newTracking[exIndex].sets[setIndex].completed;
    setTrackedExercises(newTracking);
  };

  const updateSetData = (exIndex: number, setIndex: number, field: "reps" | "weight", value: string) => {
    const newTracking = [...trackedExercises];
    newTracking[exIndex].sets[setIndex][field] = parseInt(value) || 0;
    setTrackedExercises(newTracking);
  };

  const handleSubmit = async () => {
    const endTime = new Date();
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    // Calculate overall completion percentage
    let totalSets = 0;
    let completedSetsCount = 0;
    
    // Format exercises for backend payload
    const finalExercises = trackedExercises.map((ex) => {
      const exCompletedSets = ex.sets.filter(s => s.completed).length;
      totalSets += ex.sets.length;
      completedSetsCount += exCompletedSets;

      return {
        name: ex.name,
        sets: ex.sets.length,
        completedSets: exCompletedSets,
        reps: ex.sets[0]?.reps || 0, // Sending target from first set
        weight: ex.sets[0]?.weight || 0,
        notes: "",
      };
    });

    const completionPercentage = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 100;

    const payload = {
      workoutId: workout._id,
      actualStartTime: startTime.toISOString(),
      actualEndTime: endTime.toISOString(),
      durationMinutes,
      intensity: workout.intensity || "medium",
      completionPercentage,
      notes,
      perceivedExertion: rpe,
      rating: Math.ceil(rpe / 2), // map 1-10 to 1-5
      exercises: finalExercises,
    };

    try {
      await postWorkoutCompletion(payload).unwrap();
      Alert.alert("Success", "Workout logged successfully! Great job.", [
        { text: "Done", onPress: () => router.replace("/workout") }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || "Failed to save workout.");
    }
  };

  if (isLoading) return <SkeletonLoader />;
  if (isError || !workout) return (
    <GradientBackground>
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-white">Failed to load session.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-white/20 px-4 py-2 rounded">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );

  // --- FINISHED VIEW (Completion Form) ---
  if (isFinished) {
    return (
      <GradientBackground>
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} className="flex-1">
            <ScrollView className="flex-1 px-5 pt-8">
              <View className="items-center mb-8">
                <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-4 border border-green-500/50">
                  <Ionicons name="checkmark-done" size={40} color="#10B981" />
                </View>
                <Text className="text-white text-3xl font-JosefinSansBold text-center">Workout Complete!</Text>
                <Text className="text-gray-300 mt-2 font-JosefinSansMedium">{workout.title}</Text>
              </View>

              <View className="flex-row justify-center gap-4 mb-8">
                <View className="bg-white/5 p-4 rounded-2xl items-center border border-white/10 w-1/3">
                  <Text className="text-gray-400 text-xs mb-1">Duration</Text>
                  <Text className="text-white font-JosefinSansBold text-xl">{Math.round(elapsedSeconds / 60)}m</Text>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-white font-JosefinSansBold text-lg mb-3">How hard was it? (RPE 1-10)</Text>
                <View className="flex-row justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/10">
                  <TouchableOpacity onPress={() => setRpe(Math.max(1, rpe - 1))} className="p-3">
                    <Ionicons name="remove-circle-outline" size={28} color="#A78BFA" />
                  </TouchableOpacity>
                  <Text className="text-white text-2xl font-JosefinSansBold">{rpe}</Text>
                  <TouchableOpacity onPress={() => setRpe(Math.min(10, rpe + 1))} className="p-3">
                    <Ionicons name="add-circle-outline" size={28} color="#A78BFA" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-400 text-center text-xs mt-2">
                  {rpe <= 3 ? "Very Light" : rpe <= 6 ? "Moderate" : rpe <= 8 ? "Hard" : "Max Effort"}
                </Text>
              </View>

              <View className="mb-8">
                <Text className="text-white font-JosefinSansBold text-lg mb-3">Notes</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="How did you feel? Any modifications?"
                  placeholderTextColor="#6B7280"
                  multiline
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[100px]"
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} className="mb-10">
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  className="h-14 rounded-full items-center justify-center"
                >
                  {isSubmitting ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Save & Finish</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // --- ACTIVE SESSION VIEW ---
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Sticky Header */}
        <View className="px-5 py-4 border-b border-white/10 bg-[#0C1234]/80 flex-row justify-between items-center z-10">
          <View>
            <Text className="text-gray-400 text-sm font-JosefinSansMedium">{workout.title}</Text>
            <Text className="text-[#A78BFA] text-2xl font-JosefinSansBold tracking-widest">{formatTime(elapsedSeconds)}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFinished(true)} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <Text className="text-white font-JosefinSansSemiBold">Finish</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-3 pt-4">
          {trackedExercises.map((ex, exIndex) => (
            <View key={exIndex} className="bg-white/5 rounded-2xl mb-4 border border-white/10 overflow-hidden">
              <View className="bg-white/10 px-4 py-3 flex-row items-center border-b border-white/5">
                <Text className="text-white font-JosefinSansBold text-lg flex-1">{ex.name}</Text>
              </View>
              
              <View className="p-2">
                {/* Header Row */}
                <View className="flex-row px-2 py-1 mb-1">
                  <Text className="text-gray-400 text-xs flex-[0.5] text-center">SET</Text>
                  <Text className="text-gray-400 text-xs flex-1 text-center">KG</Text>
                  <Text className="text-gray-400 text-xs flex-1 text-center">REPS</Text>
                  <Text className="text-gray-400 text-xs flex-[0.5] text-center">DONE</Text>
                </View>

                {/* Sets */}
                {ex.sets.map((set, setIndex) => (
                  <View key={setIndex} className={`flex-row items-center px-2 py-2 mb-1 rounded-xl ${set.completed ? "bg-green-500/10" : "bg-transparent"}`}>
                    <Text className="text-gray-300 font-JosefinSansSemiBold flex-[0.5] text-center">{setIndex + 1}</Text>
                    
                    <View className="flex-1 px-1">
                      <TextInput
                        value={set.weight ? set.weight.toString() : ""}
                        onChangeText={(val) => updateSetData(exIndex, setIndex, "weight", val)}
                        keyboardType="numeric"
                        placeholder="-"
                        placeholderTextColor="#4B5563"
                        className={`bg-black/20 text-center text-white py-2 rounded-lg font-JosefinSansMedium border ${set.completed ? "border-green-500/30" : "border-white/10"}`}
                        editable={!set.completed}
                      />
                    </View>

                    <View className="flex-1 px-1">
                      <TextInput
                        value={set.reps ? set.reps.toString() : ""}
                        onChangeText={(val) => updateSetData(exIndex, setIndex, "reps", val)}
                        keyboardType="numeric"
                        placeholder="-"
                        placeholderTextColor="#4B5563"
                        className={`bg-black/20 text-center text-white py-2 rounded-lg font-JosefinSansMedium border ${set.completed ? "border-green-500/30" : "border-white/10"}`}
                        editable={!set.completed}
                      />
                    </View>

                    <View className="flex-[0.5] items-center justify-center">
                      <TouchableOpacity
                        onPress={() => toggleSetCompletion(exIndex, setIndex)}
                        className={`w-8 h-8 rounded-lg items-center justify-center ${set.completed ? "bg-[#10B981]" : "bg-white/10 border border-white/20"}`}
                      >
                        {set.completed && <Ionicons name="checkmark" size={18} color="white" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default WorkoutSession;
