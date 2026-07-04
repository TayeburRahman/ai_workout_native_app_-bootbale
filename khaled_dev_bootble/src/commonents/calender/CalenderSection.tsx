import { setGlobalData } from "@/src/redux/globalSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

type DayType = "work" | "rotation" | "recovery";

interface DayItem {
  day: string;
  date: number;
  fullDate: Date;
  type: DayType;
}

const COLORS = {
  work: ["#F9941026", "#F9941066"],
  rotation: ["#8E4DD126", "#8E4DD166"],
  recovery: ["#1EB0A326", "#1EB0A366"],
};

const DOTS = {
  work: "#F5A524",
  rotation: "#7C5CFF",
  recovery: "#2DD4BF",
};

const CalenderSection = () => {
  const [weekDays, setWeekDays] = useState<DayItem[]>([]);
  const [selected, setSelected] = useState(1);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeButton, setActiveButton] = useState("chevron-forward");
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    generateWeek();
  }, [weekOffset]);

  const generateWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const mondayDiff = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayDiff + weekOffset * 7);

    const temp: DayItem[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      temp.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        fullDate: d,
        type: getDayType(d),
      });
    }

    setWeekDays(temp);
  };

  const getDayType = (date: Date): DayType => {
    const d = date.getDay();
    if (d === 1 || d === 2 || d === 3) return "work";
    if (d === 4) return "rotation";
    return "recovery";
  };

  function getCurrentMonthYear() {
    if (weekDays.length === 0) {
      const now = new Date();
      return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
    }
    const middleDay = weekDays[3]?.fullDate ?? weekDays[0].fullDate;
    return `${middleDay.toLocaleString("default", { month: "long" })} ${middleDay.getFullYear()}`;
  }

  return (
    <View className=" ">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-xl font-JosefinSansSemiBold">
          {getCurrentMonthYear()}
        </Text>

        <View className="flex-row space-x-3 gap-2">
          <ArrowButton
            onPress={() => {
              setWeekOffset((p) => p - 1);
              setActiveButton("chevron-back");
            }}
            icon="chevron-back"
            act={activeButton}
          />
          <ArrowButton
            onPress={() => {
              setWeekOffset((p) => p + 1);
              setActiveButton("chevron-forward");
            }}
            icon="chevron-forward"
            act={activeButton}
          />
        </View>
      </View>

      {/* LEGEND */}
      <View className="flex-row mb-4 space-x-4 gap-[4%]">
        <Legend color={DOTS.work} label="Work Days" />
        <Legend color={DOTS.rotation} label="Rotation days" />
        <Legend color={DOTS.recovery} label="RecoveryDays" />
      </View>

      {/* WEEK */}
      <View className="flex-row justify-between">
        {weekDays.map((item, index) => {
          const active = index === selected;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelected(index);
                const formattedDate = new Date(item.fullDate)
                  .toISOString()
                  .split("T")[0];

                setSelectedDate(formattedDate);
                dispatch(setGlobalData({ datefilter: formattedDate }));
              }}
              className="w-[13%]"
              activeOpacity={0.9}
            >
              <View
                className={`rounded-2xl py-4 items-center border`}
                style={{
                  backgroundColor: COLORS[item.type][0],
                  borderColor: COLORS[item.type][1],
                }}
              >
                <Text
                  className="text-lg mt-1 font-JosefinSansBold"
                  style={{ color: DOTS[item.type] }}
                >
                  {item.date}
                </Text>
                <Text className="text-xs text-[#C0BDC0] font-JosefinSansSemiBold">
                  {item.day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CalenderSection;

/* ---------- SMALL COMPONENTS ---------- */

const ArrowButton = ({ onPress, icon, act }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`${act === icon ? "bg-[#A895FF] border-[#A895FF]" : "bg-[#FFFFFF33] border-[#FFFFFF1A]"} border w-9 h-9 rounded-full items-center justify-center`}
  >
    <Ionicons name={icon} size={18} color="#FFFFFF" />
  </TouchableOpacity>
);

const Legend = ({ color, label }: any) => (
  <View className="flex-row items-center">
    <View
      className="w-2.5 h-2.5 rounded-full mr-2"
      style={{ backgroundColor: color }}
    />
    <Text style={{ color: color }} className="text-sm font-JosefinSansMedium">
      {label}
    </Text>
  </View>
);
