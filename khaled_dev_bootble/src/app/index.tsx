import { Images } from "@/assets/extra/images";
import GradientBackground from "@/src/commonents/background/GradientBackground";
import { useLazyGetMyProfileQuery } from "@/src/redux/Auth/authApi";
import { setCredentials, logoutUser } from "@/src/redux/Auth/authSlice";
import { getPostAuthRoute, getResponseUser } from "@/src/utils/authRouting";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  const [triggerGetProfile] = useLazyGetMyProfileQuery();
  const [statusText, setStatusText] = useState("Initializing Bootble...");

  useEffect(() => {
    const runStartupChecks = async () => {
      try {
        // Step 1: Read token from SecureStore
        setStatusText("Loading session security...");
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (!storedToken) {
          console.log("[STARTUP] No stored token found. Redirecting to sign in.");
          setStatusText("No active session. Loading Sign In...");
          setTimeout(() => {
            router.replace("/signin");
          }, 800);
          return;
        }

        // Initialize state credentials if cached locally
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            dispatch(setCredentials({ user: parsedUser, token: storedToken }));
          } catch (e) {
            console.error("[STARTUP] Failed to parse cached user", e);
          }
        }

        // Step 2: Validate token and fetch fresh profile from backend
        setStatusText("Validating account details...");
        const profileResult = await triggerGetProfile(undefined, false).unwrap();
        const user = getResponseUser(profileResult);

        if (!user) {
          console.log("[STARTUP] Token validation failed. Cleared credentials.");
          setStatusText("Session expired. Directing to Sign In...");
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("user");
          dispatch(logoutUser());
          setTimeout(() => {
            router.replace("/signin");
          }, 800);
          return;
        }

        // Step 3: Check premium subscription status via RevenueCat
        setStatusText("Synchronizing subscription settings...");
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          console.log("[STARTUP] RevenueCat customer info synced successfully", customerInfo);
        } catch (e) {
          console.warn("[STARTUP] RevenueCat sync bypassed during startup:", e);
        }

        // Step 4: Route based on account verification and onboarding completion status
        setStatusText("Preparing personalized recommendations...");
        const nextRoute = getPostAuthRoute(profileResult);
        console.log(`[STARTUP] Determined startup destination route: ${nextRoute}`);

        setTimeout(() => {
          router.replace(nextRoute);
        }, 800);
      } catch (err: any) {
        console.error("[STARTUP] Startup initialization failed with error:", err);
        setStatusText("Session validation failed. Loading Sign In...");
        
        // Cleanup expired or invalid credentials
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        dispatch(logoutUser());

        setTimeout(() => {
          router.replace("/signin");
        }, 800);
      }
    };

    // Tiny visual delay to ensure fonts and layout are settled before running startup checks
    const delayTimer = setTimeout(() => {
      runStartupChecks();
    }, 500);

    return () => clearTimeout(delayTimer);
  }, []);

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center px-10">
        {/* Logo and Brand Title */}
        <View className="items-center mb-10">
          <Image
            source={Images.logo}
            className="w-48 h-48 mb-4"
            resizeMode="contain"
          />
          <Text className="text-white text-3xl font-bold tracking-widest">
            BOOTBLE
          </Text>
          <Text className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-JosefinSansMedium">
            Personalized Fitness & Recovery
          </Text>
        </View>

        {/* Loading Spinner */}
        <ActivityIndicator size="large" color="#A78BFA" className="mb-4" />

        {/* Dynamic Status Text */}
        <Text className="text-[#A78BFA] text-center text-sm font-JosefinSansRegular tracking-wide">
          {statusText}
        </Text>
      </View>
    </GradientBackground>
  );
}
