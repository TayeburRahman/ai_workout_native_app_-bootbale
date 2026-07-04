import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  onError?: (error: string) => void;
  onSkip?: () => void;
  videoUrl: string | null;
  workoutTitle?: string;
}

const WorkoutVideo: React.FC<Props> = ({
  visible,
  onClose,
  onError,
  onSkip,
  videoUrl,
  workoutTitle = "Workout",
}) => {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          handleClose();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [visible]);

  // Reset state when video changes
  useEffect(() => {
    if (visible && videoUrl) {
      setIsLoading(true);
      setError(null);
      setIsPlaying(true);
      setIsBuffering(false);

      // Auto-hide controls after 3 seconds
      setShowControls(true);
      startControlsTimeout();

      // Start pulse animation for loading
      startPulseAnimation();
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [visible, videoUrl]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const startControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 3000);
  };

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsBuffering(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleError = useCallback(
    (error: any) => {
      console.error("Video loading error:", error);
      setIsLoading(false);
      setIsBuffering(false);
      const errorMessage =
        "Failed to load video. Please check your connection.";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    },
    [onError],
  );

  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);

      if (status.error) {
        console.error("Playback error:", status.error);
        handleError(status.error);
      }
    }
  }, []);

  const togglePlayback = useCallback(async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }

        // Animate play/pause button
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error("Toggle playback error:", error);
      }
    }
  }, [isPlaying]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.unloadAsync();
      videoRef.current.loadAsync({ uri: videoUrl! }, { shouldPlay: true });
    }
  }, [videoUrl]);

  const handleClose = useCallback(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pauseAsync();
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [isPlaying, onClose]);

  const handleScreenTap = useCallback(() => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    startControlsTimeout();
  }, []);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      handleClose();
      onSkip();
    }
  }, [onSkip, handleClose]);

  // Create animated rotation for loading
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView className="flex-1 bg-black">
        {/* Animated Gradient Background */}
        <LinearGradient
          colors={["#000000", "#1a0033", "#000000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        >
          {/* Animated particles effect */}
          <Animated.View
            className="absolute w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"
            style={{
              top: height * 0.2,
              left: width * 0.1,
              transform: [{ scale: pulseAnim }],
            }}
          />
          <Animated.View
            className="absolute w-60 h-60 rounded-full bg-blue-600/20 blur-3xl"
            style={{
              bottom: height * 0.2,
              right: width * 0.1,
              transform: [{ scale: Animated.multiply(pulseAnim, 1.3) }],
            }}
          />
        </LinearGradient>

        {/* Header with Glass Effect */}
        <Animated.View className="absolute top-0 left-0 right-0 z-20">
          <BlurView intensity={80} tint="dark" className="overflow-hidden">
            <View className="flex-row justify-between items-center px-6 pt-12 pb-4">
              <View className="flex-row items-center">
                <View className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
                <View>
                  <Text className="text-white text-2xl font-bold tracking-tight">
                    Workout Video
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-white/60 text-sm font-medium">
                      {workoutTitle}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                {/* Skip Button with Animation */}
                {onSkip && (
                  <TouchableOpacity
                    onPress={handleSkip}
                    activeOpacity={0.7}
                    className="mr-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 overflow-hidden"
                  >
                    <LinearGradient
                      colors={[
                        "rgba(255,255,255,0.1)",
                        "rgba(255,255,255,0.05)",
                      ]}
                      className="absolute inset-0"
                    />
                    <Text className="text-white font-semibold">Skip Video</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleClose}
                  activeOpacity={0.7}
                  className="w-11 h-11 rounded-full bg-white/10 items-center justify-center border border-white/20"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Video Container */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleScreenTap}
          className="flex-1 justify-center items-center px-4"
        >
          <Animated.View
            className="w-full rounded-3xl  overflow-hidden bg-black/60 border border-white/20 shadow-2xl"
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            {/* Video Player */}
            <View className="relative" style={{ height: height * 0.45 }}>
              {videoUrl ? (
                <>
                  <Video
                    ref={videoRef}
                    source={{ uri: videoUrl }}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={visible}
                    isLooping
                    useNativeControls={false}
                    onLoadStart={handleLoadStart}
                    onLoad={handleLoad}
                    onError={handleError}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    progressUpdateIntervalMillis={500}
                  />

                  {/* Loading/Buffering Overlay with Animation */}
                  {(isLoading || isBuffering) && !error && (
                    <View className="absolute inset-0 bg-black/70 items-center justify-center">
                      <BlurView
                        intensity={0}
                        className="p-8 rounded-3xl items-center"
                      >
                        <Animated.View
                          style={{ transform: [{ rotate: spin }] }}
                        >
                          <Ionicons name="fitness" size={50} color="#7C3AED" />
                        </Animated.View>
                        <Text className="text-white/90 text-lg font-bold mt-4">
                          {isLoading ? "Preparing Your Workout" : "Buffering"}
                        </Text>
                        <Text className="text-white/60 text-sm mt-2 text-center">
                          {isLoading
                            ? "Getting your video ready..."
                            : "Loading smoothly..."}
                        </Text>
                        <ActivityIndicator
                          size="large"
                          color="#7C3AED"
                          className="mt-4"
                        />
                      </BlurView>
                    </View>
                  )}

                  {/* Error Overlay with Glass Effect */}
                  {error && (
                    <View className="absolute inset-0 bg-black/80 items-center justify-center px-6">
                      <BlurView
                        intensity={0}
                        className="p-8 rounded-3xl items-center w-full"
                      >
                        <View className="w-20 h-20 rounded-full bg-red-500/20 items-center justify-center mb-4 border-2 border-red-500/30">
                          <Ionicons
                            name="alert-circle"
                            size={40}
                            color="#EF4444"
                          />
                        </View>
                        <Text className="text-white text-2xl font-bold mb-2">
                          Oops!
                        </Text>
                        <Text className="text-white/70 text-center mb-6 text-base">
                          {error}
                        </Text>
                        <View className="flex-row space-x-3 w-full">
                          <TouchableOpacity
                            onPress={handleSkip}
                            className="flex-1 bg-white/10 py-4 rounded-xl border border-white/20"
                          >
                            <Text className="text-white font-semibold text-center">
                              Skip
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleRetry}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl"
                          >
                            <Text className="text-white font-semibold text-center">
                              Retry
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </BlurView>
                    </View>
                  )}

                  {/* Custom Controls Overlay with Animation */}
                  {!isLoading && !error && !isBuffering && showControls && (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={togglePlayback}
                      className="absolute inset-0 items-center justify-center"
                    >
                      <Animated.View
                        className="w-24 h-24 rounded-full bg-black/50 items-center justify-center border-2 border-white/30"
                        style={{ transform: [{ scale: scaleAnim }] }}
                      >
                        <BlurView
                          intensity={0}
                          className="w-full h-full rounded-full items-center justify-center"
                        >
                          <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={50}
                            color="white"
                          />
                        </BlurView>
                      </Animated.View>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View className="flex-1 items-center justify-center">
                  <BlurView
                    intensity={60}
                    className="p-8 rounded-3xl items-center"
                  >
                    <View className="w-24 h-24 rounded-full bg-white/5 items-center justify-center mb-6 border-2 border-white/10">
                      <Ionicons name="videocam-off" size={50} color="#666" />
                    </View>
                    <Text className="text-white/70 text-xl font-medium mb-2">
                      No Video Available
                    </Text>
                    <Text className="text-white/40 text-sm text-center mb-6">
                      This workout doesn't have a video demonstration
                    </Text>
                    {onSkip && (
                      <TouchableOpacity
                        onPress={handleSkip}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl"
                      >
                        <Text className="text-white font-semibold text-lg">
                          Start Workout
                        </Text>
                      </TouchableOpacity>
                    )}
                  </BlurView>
                </View>
              )}
            </View>

            {/* Video Info Bar with Glass Effect */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <BlurView
                intensity={60}
                className="px-5 py-4 border-t border-white/20"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className={`w-2.5 h-2.5 rounded-full mr-3 ${
                        error
                          ? "bg-red-500"
                          : isLoading || isBuffering
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    >
                      {(isLoading || isBuffering) && (
                        <Animated.View
                          className="w-2.5 h-2.5 rounded-full bg-yellow-500"
                          style={{
                            opacity: pulseAnim,
                          }}
                        />
                      )}
                    </View>
                    <Text className="text-white/80 text-sm font-medium">
                      {error
                        ? "Connection Error"
                        : isLoading
                          ? "Loading..."
                          : isBuffering
                            ? "Buffering..."
                            : isPlaying
                              ? "Now Playing"
                              : "Paused"}
                    </Text>
                  </View>

                  {videoUrl && !error && (
                    <TouchableOpacity
                      onPress={togglePlayback}
                      className="w-9 h-9 rounded-full bg-white/10 items-center justify-center border border-white/20"
                      disabled={isLoading || isBuffering}
                    >
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={18}
                        color={isLoading || isBuffering ? "#666" : "white"}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </BlurView>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default WorkoutVideo;
