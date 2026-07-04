import {
  calender,
  fcalender,
  fhome,
  fmaditation,
  fprofile,
  fworkout,
  home,
  maditation,
  profile,
  workout,
} from "@/assets/icon";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgXml,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;

const BAR_HEIGHT = 90;
const DENT_RADIUS = 32;

const COLORS = {
  barTop: "#0C1234",
  barBottom: "#0C1234",
  bar: "#0F173D",
  purple: "#A895FF",
  gray: "#BDBDBD",
  white: "#E5E7EB",
};

const ICONS: Record<string, any> = {
  home: home,
  calender: calender,
  workout: workout,
  sleeprecovery: maditation,
  profile: profile,
};
const FICONS: Record<string, any> = {
  home: fhome,
  calender: fcalender,
  workout: fworkout,
  sleeprecovery: fmaditation,
  profile: fprofile,
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const dentX = useSharedValue(TAB_WIDTH / 2);

  useEffect(() => {
    dentX.value = withTiming(state.index * TAB_WIDTH + TAB_WIDTH / 2, {
      duration: 50,
    });
  }, [state.index]);
  const CORNER_RADIUS = 8;

  const animatedProps = useAnimatedProps(() => {
    const x = dentX.value;
    const r = DENT_RADIUS;
    const cr = CORNER_RADIUS;

    return {
      d: `
      M${cr} 0
      H${x - r - 20}

      C${x - r} 0 ${x - r} ${r * 1.3} ${x} ${r * 1.3}
      C${x + r} ${r * 1.3} ${x + r} 0 ${x + r + 20} 0

      H${width - cr}
      C${width} 0 ${width} ${cr} ${width} ${cr}

      V${BAR_HEIGHT}
      H0
      V${cr}
      C0 ${cr} 0 0 ${cr} 0
      Z
    `,
    };
  });

  return (
    <View style={styles.container}>
      {/* SVG BAR */}
      <Svg width={width} height={BAR_HEIGHT}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={COLORS.barTop} />
            <Stop offset="100%" stopColor={COLORS.barBottom} />
          </LinearGradient>
        </Defs>

        <AnimatedPath animatedProps={animatedProps} fill="url(#grad)" />
      </Svg>

      {/* FLOATING ICON */}
      <Animated.View
        style={[
          styles.floating,
          {
            transform: [
              {
                translateX: state.index * TAB_WIDTH + TAB_WIDTH / 2 - 28,
              },
            ],
          },
        ]}
      >
        <View style={styles.circle}>
          <SvgXml
            xml={FICONS[state.routes[state.index].name]}
            width={24}
            height={24}
            color={COLORS.purple}
          />
          {/* <Ionicons
            name={ICONS[state.routes[state.index].name]}
            size={24}
            color={COLORS.purple}
          /> */}
        </View>
      </Animated.View>

      {/* TABS */}
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = index === state.index;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate(route.name);
              }}
            >
              {!focused && (
                <SvgXml
                  xml={ICONS[route.name]}
                  width={22}
                  height={22}
                  color={COLORS.white}
                />
              )}
              <Text
                style={[
                  styles.label,
                  { color: focused ? COLORS.purple : COLORS.gray },
                ]}
                className="font-JosefinSansMedium "
              >
                {route.name === "sleeprecovery"
                  ? "SleepRecovery"
                  : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: BAR_HEIGHT,
  },

  floating: {
    position: "absolute",
    top: -26,
  },

  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.bar,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
  },

  row: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    height: BAR_HEIGHT,
  },

  tab: {
    width: TAB_WIDTH,

    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 14,
  },

  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});

//
