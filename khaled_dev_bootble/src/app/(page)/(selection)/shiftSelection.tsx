import { mooncloud, moonsun, suncloud } from "@/assets/icon";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import { useGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import { useShiftselectMutation } from "@/src/redux/page/selectApi";
import { isSuccessfulResponse } from "@/src/utils/authRouting";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

type ShiftType = "fixed_night" | "rotating" | "early_morning";

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Sleep: {
    bg: "bg-[#FFAE001A]",
    text: "text-[#FFAE00]",
  },
  Recovery: {
    bg: "bg-[#1BB10B1A]",
    text: "text-[#1BB10B]",
  },
  Workout: {
    bg: "bg-[#A9DFFF1A]",
    text: "text-[#A9DFFF]",
  },
  Calendar: {
    bg: "bg-[#FF6D2A1A]",
    text: "text-[#FF6D2A]",
  },
};

const ShiftSelection = () => {
  const [selected, setSelected] = useState<ShiftType | null>(null);

  // Fetch profile to check saved shift and onboarding status
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetMyProfileQuery();

  // Mutation to select/update shift
  const [selectshift, { isLoading: isSaving }] = useShiftselectMutation();

  const isEditMode = profileData?.data?.user?.onboardingCompleted === true;

  // Pre-select the user's currently saved shift on mount
  useEffect(() => {
    const savedShift = profileData?.data?.user?.shiftType;
    if (
      savedShift &&
      ["fixed_night", "rotating", "early_morning"].includes(savedShift)
    ) {
      setSelected(savedShift as ShiftType);
    }
  }, [profileData]);

  const handleSelectShift = async () => {
    try {
      if (!selected) {
        return alert("Please select a shift schedule");
      }

      const res = await selectshift({
        shiftType: selected,
      }).unwrap();

      if (isSuccessfulResponse(res)) {
        if (isEditMode) {
          alert("Work schedule updated & plan recalculated!");
          router.back();
        } else {
          router.replace("/goalsection");
        }
      } else {
        alert("Unable to update shift selection. Please try again.");
      }
    } catch (err: any) {
      alert(
        err?.data?.message || "An error occurred while saving your selection.",
      );
    }
  };

  const ShiftCard = ({
    id,
    title,
    description,
    impactDetails,
    tags,
    icon,
  }: {
    id: ShiftType;
    title: string;
    description: string;
    impactDetails: string[];
    tags: string[];
    icon: any;
  }) => {
    const isActive = selected === id;

    return (
      <TouchableOpacity
        disabled={isSaving}
        activeOpacity={0.9}
        onPress={() => setSelected(id)}
        className={`mb-4 rounded-2xl p-4 border ${
          isActive
            ? "border-[#8B7CFF] bg-white/10"
            : "border-white/10 bg-white/5"
        }`}
      >
        <View className="flex-row items-center mb-2">
          <View className="w-10 h-10 rounded-full bg-[#EBE9FF] items-center justify-center mr-3">
            <SvgXml xml={icon} width={20} height={20} color={"#121030"} />
          </View>

          <Text className="text-white text-base font-JosefinSansMedium">
            {title}
          </Text>
        </View>

        <Text className="text-white/60 text-sm font-JosefinSansMedium mb-3">
          {description}
        </Text>

        {/* Downstream Impact List */}
        <View className="mb-3 pl-1">
          {impactDetails.map((detail, idx) => (
            <Text
              key={idx}
              className="text-xs font-JosefinSansRegular text-[#A5B4FC] mb-1"
            >
              • {detail}
            </Text>
          ))}
        </View>

        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <View
              key={tag}
              className={`px-3 py-1 rounded-full ${
                TAG_STYLES[tag]?.bg || "bg-white/10"
              }`}
            >
              <Text
                className={`text-xs font-JosefinSansSemiBold ${
                  TAG_STYLES[tag]?.text || "text-white/70"
                }`}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoadingProfile) {
    return <SkeletonLoader />;
  }

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 px-5">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mt-6 mb-6 relative">
            {isEditMode && (
              <TouchableOpacity
                disabled={isSaving}
                onPress={() => router.back()}
                className="w-10 h-10 bg-white/10 rounded-full justify-center items-center backdrop-blur-sm border border-white/20 absolute left-0 top-0 z-10"
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrow-left" size={16} color="#A5B4FC" />
              </TouchableOpacity>
            )}

            <Text className="text-white text-2xl font-JosefinSansMedium text-center">
              {isEditMode ? "Update Work Schedule" : "Shift Selection"}
            </Text>
            <Text className="text-white/60 text-base font-JosefinSansRegular text-center mt-1">
              {isEditMode
                ? "Modify shift configurations & recalculate plan"
                : "Select your main work schedule"}
            </Text>
          </View>

          {/* Cards */}
          <ShiftCard
            id="fixed_night"
            title="Fixed Nights"
            description="Consistent overnight schedule, usually 10pm–6am."
            impactDetails={[
              "Shifts sleep advice & overnight routines",
              "Alters meal timing rules & workout windows",
              "Adjusts circadian alignment parameters",
            ]}
            tags={["Sleep", "Workout", "Recovery"]}
            icon={mooncloud}
          />

          <ShiftCard
            id="rotating"
            title="Rotating Shifts"
            description="Schedule changes weekly or bi-weekly."
            impactDetails={[
              "Triggers weekly calendar schedule adjustments",
              "Modifies pre-shift meal timing rules",
              "Adapts recovery prompts and sleep suggestions",
            ]}
            tags={["Sleep", "Workout", "Recovery", "Calendar"]}
            icon={moonsun}
          />

          <ShiftCard
            id="early_morning"
            title="Early Mornings"
            description="Starting before 6am, early wake times."
            impactDetails={[
              "Establishes early morning sleep & wake timings",
              "Alters breakfast rules & workout windows",
              "Triggers early recovery notifications",
            ]}
            tags={["Sleep", "Workout", "Calendar"]}
            icon={suncloud}
          />

          {/* Continue / Save Button */}
          <View className="mt-auto mb-6">
            <TouchableOpacity
              disabled={!selected || isSaving}
              onPress={handleSelectShift}
              className={`h-14 rounded-full items-center justify-center ${
                selected && !isSaving ? "bg-[#AFA4FF]" : "bg-white/20"
              }`}
            >
              <Text className="text-black font-JosefinSansMedium">
                {isSaving
                  ? "Saving & Recalculating..."
                  : isEditMode
                    ? "Save & Recalculate Plan"
                    : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ShiftSelection;
