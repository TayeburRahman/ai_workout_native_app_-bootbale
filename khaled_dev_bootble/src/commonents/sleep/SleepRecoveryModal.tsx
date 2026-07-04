import { useGetSleepTipsQuery, usePostSleepRecoveryMutation } from "@/src/redux/page/sleepRecoveryApi";
import { useGetProfileDataQuery } from "@/src/redux/page/profiledataApi";
import { isSuccessfulResponse } from "@/src/utils/authRouting";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";

interface SleepRecoveryProps {
  open: boolean;
  close: () => void;
  keyofsleeprecovery: string;
  onSave?: (sleepData: SleepData) => void;
  initialData?: SleepData;
}

interface SleepData {
  startTime: string;
  endTime: string;
  quality: "poor" | "average" | "good";
  splitSleep: boolean;
  interruptedSleep: boolean;
}

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "HH:MM",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatTimeInput = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    else if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    else return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const handleTimeChange = (text: string) => {
    onChange(formatTimeInput(text));
  };

  const validateTime = (time: string): boolean => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <View className="mb-4 flex-1 mx-1">
      <Text className="text-white text-sm font-JosefinSansMedium mb-2">{label}</Text>
      <View className={`flex-row items-center border rounded-xl ${isFocused ? "border-[#A78BFA]" : "border-gray-600"} bg-[#1A1F3D]`}>
        <TextInput
          className="flex-1 text-white p-3 text-base font-JosefinSansSemiBold text-center"
          value={value}
          onChangeText={handleTimeChange}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          maxLength={5}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {!value && (
          <TouchableOpacity onPress={() => handleTimeChange(getCurrentTime())} className="absolute right-2 p-2">
            <Ionicons name="time-outline" size={18} color="#A78BFA" />
          </TouchableOpacity>
        )}
      </View>
      {value && !validateTime(value) && value.length === 5 && (
        <Text className="text-red-400 text-xs mt-1 text-center">Invalid format</Text>
      )}
    </View>
  );
};

const SleepRecoveryModal: React.FC<SleepRecoveryProps> = ({
  open,
  close,
  keyofsleeprecovery,
  onSave,
  initialData,
}) => {
  const [sleepData, setSleepData] = useState<SleepData>({
    startTime: "",
    endTime: "",
    quality: "average",
    splitSleep: false,
    interruptedSleep: false,
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(15);

  const isSleepMode = ["night_sleep", "daytime_sleep", "nap"].includes(keyofsleeprecovery);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [postSleepRecovery, { isLoading }] = usePostSleepRecoveryMutation();
  const { data: profileData } = useGetProfileDataQuery();
  const { data: sleepTipsResponse } = useGetSleepTipsQuery(undefined, { skip: !open });

  const shiftType = profileData?.data?.user?.shiftType || "standard";
  const aiTips = sleepTipsResponse?.data;
  const recommendedWindows = aiTips?.recommendedWindows || [];

  useEffect(() => {
    if (initialData) {
      setSleepData(initialData);
    } else {
      setSleepData({ startTime: "", endTime: "", quality: "average", splitSleep: false, interruptedSleep: false });
      setErrors({});
    }
  }, [initialData, open]);

  const applyAIWindow = (window: any) => {
    setSleepData(prev => ({
      ...prev,
      startTime: window.start,
      endTime: window.end,
      splitSleep: window.type === "nap" ? true : prev.splitSleep
    }));
  };

  const validateForm = (): boolean => {
    if (!isSleepMode) return true; // Recovery mode uses auto-calculated times

    const newErrors: { [key: string]: string } = {};
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!sleepData.startTime || !timeRegex.test(sleepData.startTime)) newErrors.startTime = "Invalid start time";
    if (!sleepData.endTime || !timeRegex.test(sleepData.endTime)) newErrors.endTime = "Invalid end time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    let finalStartTime = sleepData.startTime;
    let finalEndTime = sleepData.endTime;

    if (!isSleepMode) {
      const end = new Date();
      const start = new Date(end.getTime() - selectedDuration * 60000);
      
      finalEndTime = `${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`;
      finalStartTime = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`;
    }

    onSave?.(sleepData);
    try {
      const payload = {
        activityKey: keyofsleeprecovery,
        startTime: finalStartTime,
        endTime: finalEndTime,
        quality: sleepData.quality,
        splitSleep: sleepData.splitSleep,
        interruptedSleep: sleepData.interruptedSleep,
        shiftContext: shiftType,
      };

      const res = await postSleepRecovery(payload).unwrap();
      if (isSuccessfulResponse(res)) {
        close();
      } else {
        Alert.alert(res.message);
      }
    } catch (err: any) {
      Alert.alert(err?.data?.message || "Failed to log sleep.");
    }
  };

  const calculateDuration = (): string | null => {
    if (sleepData.startTime && sleepData.endTime && sleepData.startTime.length === 5 && sleepData.endTime.length === 5) {
      const [startHour, startMin] = sleepData.startTime.split(":").map(Number);
      const [endHour, endMin] = sleepData.endTime.split(":").map(Number);
      if (isNaN(startHour) || isNaN(endHour)) return null;

      const startTotal = startHour * 60 + startMin;
      let endTotal = endHour * 60 + endMin;

      if (endTotal < startTotal) endTotal += 24 * 60;

      const durationMinutes = endTotal - startTotal;
      return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
    }
    return null;
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={close}>
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-[#0C1234] rounded-t-3xl pt-6 px-5 pb-8 min-h-[70%]">
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              
              {/* Header */}
              <View className="mb-6 flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-2xl font-JosefinSansBold">
                    {isSleepMode ? "Sleep Tracker" : "Recovery Logger"}
                  </Text>
                  <Text className="text-[#A78BFA] text-sm font-JosefinSansSemiBold mt-1 capitalize">{shiftType.replace("_", " ")} Schedule</Text>
                </View>
                <TouchableOpacity onPress={close} className="bg-white/10 p-2 rounded-full">
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {isSleepMode ? (
                <>
                  {/* AI Recommendation Box */}
                  {recommendedWindows.length > 0 && (
                    <View className="mb-6 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-2xl p-4">
                      <View className="flex-row items-center mb-3">
                        <Ionicons name="sparkles" size={16} color="#A78BFA" />
                        <Text className="text-[#A78BFA] font-JosefinSansBold ml-2 text-sm">AI Suggested Windows</Text>
                      </View>
                      {recommendedWindows.map((win: any, idx: number) => (
                        <TouchableOpacity 
                          key={idx} 
                          onPress={() => applyAIWindow(win)}
                          className="bg-black/20 p-3 rounded-xl flex-row justify-between items-center mb-2 border border-white/5"
                        >
                          <View>
                            <Text className="text-white font-JosefinSansSemiBold text-sm">{win.label}</Text>
                            <Text className="text-gray-400 text-xs mt-1">{win.duration} Expected</Text>
                          </View>
                          <View className="bg-[#A78BFA] px-3 py-1 rounded-full">
                            <Text className="text-white font-bold text-xs">{win.start} - {win.end}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Time Inputs */}
                  <View className="flex-row justify-between mb-2">
                    <TimeInput label="Bed Time" value={sleepData.startTime} onChange={(v) => setSleepData({ ...sleepData, startTime: v })} />
                    <TimeInput label="Wake Time" value={sleepData.endTime} onChange={(v) => setSleepData({ ...sleepData, endTime: v })} />
                  </View>

                  {/* Duration Display */}
                  {calculateDuration() && (
                    <View className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl items-center flex-row justify-between">
                      <Text className="text-green-400 text-sm font-JosefinSansMedium">Total Sleep Logged</Text>
                      <Text className="text-green-400 text-xl font-JosefinSansBold">{calculateDuration()}</Text>
                    </View>
                  )}
                </>
              ) : (
                <View className="mb-6">
                  <Text className="text-white text-sm font-JosefinSansMedium mb-3">Duration Completed</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[5, 10, 15, 20].map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        onPress={() => setSelectedDuration(duration)}
                        className={`px-4 py-2 rounded-full border ${selectedDuration === duration ? 'bg-[#A78BFA] border-[#A78BFA]' : 'bg-transparent border-gray-600'}`}
                      >
                        <Text className={`font-JosefinSansSemiBold ${selectedDuration === duration ? 'text-white' : 'text-gray-300'}`}>
                          {duration} min
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Advanced Shift Context Options */}
              <Text className="text-white text-lg font-JosefinSansBold mb-3">Sleep Details</Text>
              
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                <View className="flex-row justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-white font-JosefinSansSemiBold text-base">Split Sleep</Text>
                    <Text className="text-gray-400 text-xs mt-1">Is this part of a bi-phasic sleep schedule or nap?</Text>
                  </View>
                  <Switch 
                    value={sleepData.splitSleep} 
                    onValueChange={(v) => setSleepData({ ...sleepData, splitSleep: v })}
                    trackColor={{ false: "#374151", true: "#A78BFA" }}
                  />
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 pr-4">
                    <Text className="text-white font-JosefinSansSemiBold text-base">Interrupted Sleep</Text>
                    <Text className="text-gray-400 text-xs mt-1">Did you wake up frequently during this block?</Text>
                  </View>
                  <Switch 
                    value={sleepData.interruptedSleep} 
                    onValueChange={(v) => setSleepData({ ...sleepData, interruptedSleep: v })}
                    trackColor={{ false: "#374151", true: "#A78BFA" }}
                  />
                </View>
              </View>

              {/* Quality Segment */}
              <View className="mb-8">
                <Text className="text-white text-sm font-JosefinSansMedium mb-3">Sleep Quality</Text>
                <View className="flex-row bg-white/5 rounded-xl p-1 border border-white/10">
                  {["poor", "average", "good"].map((q) => (
                    <TouchableOpacity
                      key={q}
                      onPress={() => setSleepData({ ...sleepData, quality: q as any })}
                      className={`flex-1 py-3 rounded-lg items-center ${sleepData.quality === q ? "bg-[#A78BFA]" : "bg-transparent"}`}
                    >
                      <Text className={`capitalize font-JosefinSansSemiBold ${sleepData.quality === q ? "text-white" : "text-gray-400"}`}>
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity onPress={handleSave} disabled={isLoading} className="mb-4">
                <View className={`h-14 rounded-full items-center justify-center ${isLoading ? "bg-gray-600" : "bg-[#10B981]"}`}>
                  <Text className="text-white font-bold text-lg">{isLoading ? "Saving..." : "Log Sleep Recovery"}</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SleepRecoveryModal;
