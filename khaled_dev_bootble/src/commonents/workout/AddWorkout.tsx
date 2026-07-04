import { upload } from "@/assets/icon";
import { useCreateWorkoutMutation } from "@/src/redux/page/workoutApi";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";

interface AddWorkoutProps {
  open: boolean;
  close: () => void;
}

interface CreateWorkoutResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const AddWorkout: React.FC<AddWorkoutProps> = ({ open, close }) => {
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [errors, setErrors] = useState<{
    title?: string;
    duration?: string;
    image?: string;
    video?: string;
  }>({});

  const [createWorkout, { isLoading }] = useCreateWorkoutMutation();

  // Reset form when modal closes
  const resetForm = () => {
    setImage(null);
    setVideo(null);
    setVideoName(null);
    setTitle("");
    setDuration("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    close();
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload an image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        // Clear image error if any
        setErrors((prev) => ({ ...prev, image: undefined }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const pickVideo = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to upload a video.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled) {
        const videoUri = result.assets[0].uri;
        const fileName = videoUri.split("/").pop() || "video.mp4";

        setVideo(videoUri);
        setVideoName(fileName);
        // Clear video error if any
        setErrors((prev) => ({ ...prev, video: undefined }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video. Please try again.");
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoName(null);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!duration) {
      newErrors.duration = "Duration is required";
    } else {
      const durationNum = Number(duration);
      if (isNaN(durationNum) || durationNum <= 0) {
        newErrors.duration = "Please enter a valid duration";
      } else if (durationNum > 999) {
        newErrors.duration = "Duration cannot exceed 999 minutes";
      }
    }

    if (!image) {
      newErrors.image = "Please select an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateWorkout = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please check all fields and try again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("durationMinutes", duration);

    // Append image if exists
    if (image) {
      const filename = image.split("/").pop() || "workout.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: image,
        type,
        name: filename,
      } as any);
    }

    // Append video if exists (optional)
    if (video) {
      const filename = video.split("/").pop() || "video.mp4";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `video/${match[1]}` : "video/mp4";

      formData.append("video", {
        uri: video,
        type,
        name: filename,
      } as any);
    }

    try {
      const response = await createWorkout(formData).unwrap();
      console.log("the data post video ", response);

      // Handle successful response
      Alert.alert("Success", "Workout created successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            close();
          },
        },
      ]);
    } catch (error: any) {
      // Handle API errors
      const errorMessage =
        error?.data?.message || "Failed to create workout. Please try again.";

      Alert.alert("Error", errorMessage);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={handleClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-[#0C1234] w-[90%] max-h-[85%] rounded-3xl p-5"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* TITLE */}
              <Text className="text-center text-lg font-JosefinSansSemiBold text-white mb-4">
                Create New Workout
              </Text>

              {/* UPLOAD PHOTO */}
              <View className="items-center mb-5">
                <Pressable
                  onPress={pickImage}
                  className="items-center justify-center"
                  disabled={isLoading}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      className="w-24 h-24 rounded-full border-2 border-[#A89CFF]"
                    />
                  ) : (
                    <View className="w-24 h-24 rounded-full bg-[#1A214D] border-2 border-dashed border-[#A89CFF] items-center justify-center">
                      <SvgXml
                        xml={upload}
                        color="#A89CFF"
                        width={30}
                        height={30}
                      />
                    </View>
                  )}
                  <Text className="text-[#A89CFF] text-sm font-JosefinSansSemiBold mt-2">
                    {image ? "Change Photo" : "Upload Photo"}
                  </Text>
                </Pressable>
                {errors.image && (
                  <Text className="text-[#FF5C5C] text-xs mt-1 font-PoppinsRegular">
                    {errors.image}
                  </Text>
                )}
              </View>

              {/* TITLE INPUT */}
              <View className="mb-4">
                <Text className="text-white text-sm font-PoppinsMedium mb-1">
                  Title <Text className="text-[#FF5C5C]">*</Text>
                </Text>
                <TextInput
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="e.g., Morning Yoga, HIIT Workout"
                  placeholderTextColor="#8C90B6"
                  className={`bg-[#1A214D] text-white rounded-xl px-4 py-3 font-PoppinsRegular text-sm ${
                    errors.title ? "border border-[#FF5C5C]" : ""
                  }`}
                  editable={!isLoading}
                />
                {errors.title && (
                  <Text className="text-[#FF5C5C] text-xs mt-1 font-PoppinsRegular">
                    {errors.title}
                  </Text>
                )}
              </View>

              {/* SESSION DURATION */}
              <View className="mb-4">
                <Text className="text-white text-sm font-PoppinsMedium mb-1">
                  Duration (minutes) <Text className="text-[#FF5C5C]">*</Text>
                </Text>
                <TextInput
                  value={duration}
                  onChangeText={(text) => {
                    // Allow only numbers
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setDuration(numericValue);
                    if (errors.duration) {
                      setErrors((prev) => ({ ...prev, duration: undefined }));
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="e.g., 30"
                  placeholderTextColor="#8C90B6"
                  maxLength={3}
                  className={`bg-[#1A214D] text-white rounded-xl px-4 py-3 font-PoppinsRegular text-sm ${
                    errors.duration ? "border border-[#FF5C5C]" : ""
                  }`}
                  editable={!isLoading}
                />
                {errors.duration && (
                  <Text className="text-[#FF5C5C] text-xs mt-1 font-PoppinsRegular">
                    {errors.duration}
                  </Text>
                )}
              </View>

              {/* OPTIONAL VIDEO UPLOAD */}
              <View className="mb-4">
                <Text className="text-white text-sm font-PoppinsMedium mb-2">
                  Workout Video (Optional)
                </Text>
                <Text className="text-gray-400 text-xs font-PoppinsRegular mb-2">
                  Upload a demonstration video
                </Text>

                {!video ? (
                  <TouchableOpacity
                    onPress={pickVideo}
                    disabled={isLoading}
                    className="bg-[#1A214D] border border-dashed border-[#A89CFF] rounded-xl p-4 items-center justify-center"
                    style={{ minHeight: 100 }}
                  >
                    <SvgXml
                      xml={upload}
                      color="#A89CFF"
                      width={40}
                      height={40}
                    />
                    <Text className="text-[#A89CFF] text-sm font-JosefinSansSemiBold mt-2">
                      Tap to upload video
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="bg-[#1A214D] rounded-xl p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 bg-[#A89CFF]/20 rounded-lg items-center justify-center mr-3">
                          <SvgXml
                            xml={upload}
                            color="#A89CFF"
                            width={24}
                            height={24}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-white text-sm font-PoppinsMedium"
                            numberOfLines={1}
                            ellipsizeMode="middle"
                          >
                            {videoName || "Video selected"}
                          </Text>
                          <Text className="text-gray-400 text-xs font-PoppinsRegular">
                            Ready to upload
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={removeVideo}
                        className="bg-[#FF5C5C] px-3 py-1 rounded-full ml-2"
                      >
                        <Text className="text-white text-xs font-PoppinsMedium">
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {errors.video && (
                  <Text className="text-[#FF5C5C] text-xs mt-1 font-PoppinsRegular">
                    {errors.video}
                  </Text>
                )}
              </View>

              {/* BUTTONS */}
              <View className="flex-row justify-between mt-2 mb-2">
                <Pressable
                  onPress={handleClose}
                  className="bg-[#FF5C5C] flex-1 py-3 rounded-full mr-3"
                  disabled={isLoading}
                >
                  <Text className="text-white text-center font-semibold">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleCreateWorkout}
                  className={`bg-[#A89CFF] flex-1 py-3 rounded-full ${
                    isLoading ? "opacity-50" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#0C1234" />
                  ) : (
                    <Text className="text-[#0C1234] text-center font-semibold">
                      Save
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddWorkout;
