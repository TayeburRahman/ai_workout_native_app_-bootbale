import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function GradientBackground({ children }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#0C1234", "#301868", "#0C1234"]}
        locations={[0, 1, 0]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1, overflow: "hidden" }}
      >
        {/* TOP GLOW */}
        <View className="absolute -top-2 left-0 right-0 items-center">
          <LinearGradient
            colors={["#301868", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: "100%",
              height: 220,
            }}
          />
        </View>

        {/* BOTTOM SHADOW */}

        <LinearGradient
          colors={["#3E1A7C", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0.6, y: 0.4 }}
          className="absolute bottom-0 left-0 w-full h-[70%]"
        />

        {/* SCREEN CONTENT */}
        {children}
      </LinearGradient>
    </View>
  );
}
