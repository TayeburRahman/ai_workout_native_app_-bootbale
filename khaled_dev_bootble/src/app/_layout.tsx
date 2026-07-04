import { Fonts } from "@/assets/fonts/fonts";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../../global.css";
import { store } from "../redux/store";
export default function RootLayout() {
  const [fontsLoaded] = useFonts(Fonts);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    // Only log warnings and errors to prevent console spam
    Purchases.setLogLevel(LOG_LEVEL.WARN);
    
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_awcWYMgIkDsrSzSaMmNoprpiiiF" });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_jJQhRoZLJzcESXttbDPFwuSYiWi" });
    }
    
    // We intentionally do not call getOfferings() or getCustomerInfo() here 
    // to prevent unhandled RevenueCat configuration errors (empty offerings)
    // from crashing the app during development boot up.
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1 }}
          edges={["bottom"]}
          className="bg-[#0C1234]"
        >
          <StatusBar barStyle="light-content" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
async function getCustomerInfo() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("===============");
    console.log(customerInfo);
    console.log("📢 customerInfo", JSON.stringify(customerInfo, null, 2));
  } catch (error) {
    console.warn("⚠️ Error fetching customer info from RevenueCat:", error);
  }
}

async function getOfferings() {
  try {
    const offering = await Purchases.getOfferings();
    if (
      offering.current !== null &&
      offering.current.availablePackages.length !== 0
    ) {
      console.log("Offering", JSON.stringify(offering, null, 2));
    }
  } catch (error) {
    console.warn("⚠️ Error fetching offerings from RevenueCat:", error);
  }
}

