import CustomTabBar from "@/src/commonents/tab/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="calender" options={{ title: "Calendar" }} />

      <Tabs.Screen name="workout" options={{ title: "Workout" }} />
      <Tabs.Screen name="sleeprecovery" options={{ title: "Sleep/Recovery" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
