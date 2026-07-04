import { Dimensions } from "react-native";

const BASE_WIDTH = 430;
const BASE_HEIGHT = 930;

const { width, height } = Dimensions.get("window");

export const scale = (size: number) => (width / BASE_WIDTH) * size;
export const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export default {
  scale,
  verticalScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
