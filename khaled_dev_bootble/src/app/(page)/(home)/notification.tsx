import GradientBackground from "@/src/commonents/background/GradientBackground";
import SkeletonLoader from "@/src/commonents/modarndesign/SkeletonLoader";
import {
  useDeleteAllNotificationMutation,
  useDeleteSingleNotificationMutation,
  useGetNotificationQuery,
  useGetUnreadCountNotificationQuery,
  usePatchMarkNotificationMutation,
  usePatchReadAllNotificationMutation,
  usePatchSingleNotificationMutation,
} from "@/src/redux/page/homedataApi";
import {
  useGetProfileDataQuery,
  useUpdateUserProfileMutation,
} from "@/src/redux/page/profiledataApi";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Type definitions based on API response
interface NotificationData {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  data?: {
    mealType?: string;
    foodName?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    quantity?: number;
  };
  priority: "LOW" | "MEDIUM" | "HIGH";
  read: boolean;
  actionUrl?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Map priority to colors
const priorityColors = {
  LOW: "#10B981",
  MEDIUM: "#F59E0B",
  HIGH: "#EF4444",
};

// Format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} day ago`;

  return date.toLocaleDateString();
};

// Map icon based on notification type
const getNotificationIcon = (type: string, icon?: string) => {
  if (icon) return icon;

  switch (type?.toUpperCase()) {
    case "SYSTEM":
      return "⚙️";
    case "MEAL":
      return "🍽️";
    case "WORKOUT":
      return "💪";
    case "REMINDER":
      return "⏰";
    default:
      return "📋";
  }
};

const getHierarchyTag = (notification: NotificationData) => {
  if (notification.priority === 'HIGH') return 'WARNING';
  if (notification.title?.includes('Upcoming') || notification.title?.includes('Reminder') || notification.type === 'REMINDER') return 'PROMPT';
  if (notification.title?.includes('Logged') || notification.title?.includes('Completed') || notification.title?.includes('Success')) return 'CONFIRMATION';
  if (notification.type === 'PROMOTIONAL') return 'PROMO';
  return 'INFO';
};

const getHierarchyTagColor = (tag: string) => {
  switch (tag) {
    case 'WARNING': return '#EF4444';
    case 'PROMPT': return '#F59E0B';
    case 'CONFIRMATION': return '#10B981';
    case 'PROMO': return '#EC4899';
    default: return '#3B82F6';
  }
};

const NotificationCard = ({
  notification,
  onPress,
  onDelete,
  onMarkRead,
  isSelected,
  isSelectionMode,
}: {
  notification: NotificationData;
  onPress: (notification: NotificationData) => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
}) => {
  const color = priorityColors[notification.priority] || "#8B5CF6";

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      className={`mb-4 mx-5 p-5 rounded-2xl border-l-4 ${
        !notification.read ? "bg-white/10" : "bg-white/5"
      } ${isSelected ? "border-2 border-purple-500" : ""}`}
      style={{ borderLeftColor: color }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Selection Indicator */}
        {isSelectionMode && (
          <View className="mr-3 justify-center">
            <View
              className={`w-6 h-6 rounded-full border-2 ${
                isSelected
                  ? "bg-purple-500 border-purple-500"
                  : "border-white/30"
              } justify-center items-center`}
            >
              {isSelected && (
                <FontAwesome6 name="check" size={12} color="#FFFFFF" />
              )}
            </View>
          </View>
        )}

        {/* Icon Container */}
        <View
          className="w-12 h-12 rounded-xl justify-center items-center mr-4"
          style={{ backgroundColor: color + "20" }}
        >
          <Text className="text-2xl">
            {getNotificationIcon(notification.type, notification.icon)}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="font-JosefinSansBold text-white text-lg flex-1 mr-2">
              {notification.title}
            </Text>
            {!notification.read && (
              <View className="w-3 h-3 rounded-full bg-purple-500 ml-1 mt-2" />
            )}
          </View>

          {/* Hierarchy Badge */}
          <View className="self-start px-2 py-0.5 rounded mb-2 border" style={{ borderColor: getHierarchyTagColor(getHierarchyTag(notification)), backgroundColor: getHierarchyTagColor(getHierarchyTag(notification)) + '20' }}>
            <Text className="text-[10px] font-JosefinSansSemiBold" style={{ color: getHierarchyTagColor(getHierarchyTag(notification)) }}>
              {getHierarchyTag(notification)}
            </Text>
          </View>

          <Text className="font-JosefinSansRegular text-white/80 text-sm mb-2 leading-5">
            {notification.message}
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <FontAwesome6 name="clock" size={12} color="#A78BFA" />
              <Text className="font-JosefinSans text-purple-300 text-xs ml-1">
                {formatTime(notification.createdAt)}
              </Text>
            </View>

            {!isSelectionMode && (
              <View className="flex-row">
                {!notification.read && (
                  <TouchableOpacity
                    onPress={() => onMarkRead(notification._id)}
                    className="w-8 h-8 rounded-full bg-white/10 justify-center items-center mr-2"
                  >
                    <FontAwesome6 name="check" size={14} color="#A78BFA" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => onDelete(notification._id)}
                  className="w-8 h-8 rounded-full bg-white/10 justify-center items-center"
                >
                  <FontAwesome6 name="trash" size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotificationPage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const scrollY = new Animated.Value(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Profile API for preferences
  const { data: profileResponse } = useGetProfileDataQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const preferences = profileResponse?.data?.notifications || {
    workoutReminders: true,
    mealReminders: true,
    sleepReminders: true,
    promotional: false,
  };

  const handleTogglePreference = async (key: string, value: boolean) => {
    try {
      await updateProfile({
        notifications: {
          ...preferences,
          [key]: value,
        },
      }).unwrap();
    } catch (error) {
      Alert.alert("Error", "Failed to update preference");
    }
  };

  // API hooks
  const {
    data: notificationResponse,
    isLoading: isLoadingNotificationData,
    isError,
    refetch,
  } = useGetNotificationQuery();

  const { data: unreadCountResponse, refetch: refetchUnreadCount } =
    useGetUnreadCountNotificationQuery();

  const [patchReadAll, { isLoading: isPatchingAll }] =
    usePatchReadAllNotificationMutation();
  const [patchSingle, { isLoading: isPatchingSingle }] =
    usePatchSingleNotificationMutation();
  const [patchMarkMany, { isLoading: isPatchingMany }] =
    usePatchMarkNotificationMutation();
  const [deleteSingle, { isLoading: isDeletingSingle }] =
    useDeleteSingleNotificationMutation();
  const [deleteAll, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationMutation();

  const notifications = useMemo(
    () => notificationResponse?.data?.notifications || [],
    [notificationResponse],
  );

  const unreadCount = useMemo(
    () => unreadCountResponse?.data?.count || 0,
    [unreadCountResponse],
  );

  const filteredNotifications = useMemo(() => {
    const priorityWeight: Record<string, number> = {
      URGENT: 3,
      HIGH: 2,
      MEDIUM: 1,
      LOW: 0
    };

    const filtered = notifications.filter((notification: NotificationData) => {
      if (activeTab === "all") return true;
      if (activeTab === "unread") return !notification.read;
      
      const type = notification.type?.toUpperCase() || "";
      if (activeTab === "health") {
        return ["WORKOUT", "MEAL", "SLEEP_RECOVERY", "REMINDER"].includes(type);
      }
      if (activeTab === "system") {
        return ["SYSTEM", "SECURITY", "ADMIN", "SUBSCRIPTION"].includes(type);
      }
      return false;
    });

    return filtered.sort((a: NotificationData, b: NotificationData) => {
      const priorityA = priorityWeight[a.priority || "MEDIUM"] || 0;
      const priorityB = priorityWeight[b.priority || "MEDIUM"] || 0;
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications, activeTab]);

  const tabs = useMemo(() => {
    const counts = {
      health: 0,
      system: 0,
    };

    notifications.forEach((notification: NotificationData) => {
      const type = notification.type?.toUpperCase() || "";
      if (["WORKOUT", "MEAL", "SLEEP_RECOVERY", "REMINDER"].includes(type)) {
        counts.health++;
      } else if (["SYSTEM", "SECURITY", "ADMIN", "SUBSCRIPTION"].includes(type)) {
        counts.system++;
      }
    });

    return [
      { id: "all", label: "All", count: notifications.length },
      { id: "unread", label: "Unread", count: unreadCount },
      { id: "health", label: "Health & Training", count: counts.health },
      { id: "system", label: "System & Security", count: counts.system },
    ];
  }, [notifications, unreadCount]);

  // Refresh both queries
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchUnreadCount()]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refetchUnreadCount]);

  const onRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const handleNotificationPress = useCallback(
    async (notification: NotificationData) => {
      const id = notification._id;
      if (isSelectionMode) {
        // Toggle selection in selection mode
        setSelectedIds((prev) => {
          if (prev.includes(id)) {
            return prev.filter((item) => item !== id);
          } else {
            return [...prev, id];
          }
        });
      } else {
        // Mark as read when pressed in normal mode
        try {
          if (!notification.read) {
            await patchSingle(id).unwrap();
            refetchUnreadCount();
          }
          
          // Deep link routing based on actionUrl or type
          if (notification.actionUrl) {
            router.push(notification.actionUrl as any);
          } else {
            const type = notification.type?.toUpperCase();
            const sourceId = (notification as any).sourceId;
            if (type === "WORKOUT") {
              if (sourceId) {
                router.push(`/workout/${sourceId}` as any);
              } else {
                router.push("/workout");
              }
            } else if (type === "MEAL") {
              router.push("/home");
            } else if (type === "SLEEP_RECOVERY") {
              router.push("/sleeprecovery");
            } else if (type === "SUBSCRIPTION") {
              router.push("/(page)/(profile)/subscription" as any);
            } else if (type === "CALENDAR") {
              router.push("/(page)/(calender)/calender" as any);
            }
          }
        } catch (error) {
          console.error("Failed to process notification press:", error);
        }
      }
    },
    [patchSingle, isSelectionMode, refetchUnreadCount],
  );

  const handleMarkRead = useCallback(
    async (id: string) => {
      try {
        setActionLoading(true);
        await patchSingle(id).unwrap();
        await refetchUnreadCount();
      } catch (error) {
        Alert.alert("Error", "Failed to mark notification as read");
      } finally {
        setActionLoading(false);
      }
    },
    [patchSingle, refetchUnreadCount],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      Alert.alert(
        "Delete Notification",
        "Are you sure you want to delete this notification?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                setActionLoading(true);
                await deleteSingle(id).unwrap();
                await refreshData();
              } catch (error) {
                Alert.alert("Error", "Failed to delete notification");
              } finally {
                setActionLoading(false);
              }
            },
          },
        ],
      );
    },
    [deleteSingle, refreshData],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      setActionLoading(true);

      if (selectedIds.length > 0 && isSelectionMode) {
        // Mark selected as read
        await patchMarkMany({ notificationIds: selectedIds }).unwrap();
        setSelectedIds([]);
        setIsSelectionMode(false);
      } else {
        // Mark all as read
        await patchReadAll().unwrap();
      }

      await refetchUnreadCount();
      Alert.alert("Success", "Notifications marked as read");
    } catch (error) {
      Alert.alert("Error", "Failed to mark notifications as read");
    } finally {
      setActionLoading(false);
    }
  }, [
    patchReadAll,
    patchMarkMany,
    selectedIds,
    isSelectionMode,
    refetchUnreadCount,
  ]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to delete all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              await deleteAll().unwrap();
              await refreshData();
              Alert.alert("Success", "All notifications cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear notifications");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  }, [deleteAll, refreshData]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length === 0) {
      Alert.alert("No Selection", "Please select notifications to delete");
      return;
    }

    Alert.alert(
      "Delete Selected",
      `Are you sure you want to delete ${selectedIds.length} notification(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              // Delete each selected notification
              await Promise.all(
                selectedIds.map((id) => deleteSingle(id).unwrap()),
              );
              setSelectedIds([]);
              setIsSelectionMode(false);
              await refreshData();
              Alert.alert("Success", "Selected notifications deleted");
            } catch (error) {
              Alert.alert("Error", "Failed to delete notifications");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  }, [selectedIds, deleteSingle, refreshData]);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
    setSelectedIds([]);
  }, []);

  const cancelSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  }, []);

  // Check if any action is loading
  const isLoading =
    isPatchingAll ||
    isPatchingSingle ||
    isPatchingMany ||
    isDeletingSingle ||
    isDeletingAll ||
    actionLoading;

  if (isLoadingNotificationData) {
    return <SkeletonLoader />;
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.8, 0.6],
    extrapolate: "clamp",
  });

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Loading Overlay */}
        {isLoading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50 justify-center items-center">
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        )}

        {/* Animated Header */}
        <Animated.View
          style={{ opacity: headerOpacity }}
          className="px-5 flex-row justify-between items-center pt-2 pb-4"
        >
          <TouchableOpacity
            onPress={
              isSelectionMode ? cancelSelectionMode : () => router.back()
            }
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20 active:bg-white/20"
            activeOpacity={0.7}
          >
            <FontAwesome6
              name={isSelectionMode ? "xmark" : "arrow-left"}
              size={18}
              color="#A78BFA"
            />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-JosefinSansBold text-2xl text-white">
              {isSelectionMode
                ? `${selectedIds.length} Selected`
                : "Notification"}
            </Text>
            {!isSelectionMode && unreadCount > 0 && (
              <Text className="font-JosefinSansRegular text-purple-300 text-xs mt-1">
                {unreadCount} unread notifications
              </Text>
            )}
          </View>

          <View className="flex-row">
            {!isSelectionMode && (
              <TouchableOpacity
                onPress={() => setSettingsModalVisible(true)}
                className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20 active:bg-white/20 mr-2"
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <FontAwesome6 name="gear" size={18} color="#A78BFA" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={toggleSelectionMode}
              className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20 active:bg-white/20"
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <FontAwesome6
                name={isSelectionMode ? "check" : "pen-to-square"}
                size={18}
                color="#A78BFA"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tabs - Hide in selection mode */}
        {!isSelectionMode && (
          <View className="h-10 mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-5"
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`mr-3 px-5 h-8 rounded-full border ${
                    activeTab === tab.id
                      ? "bg-purple-600 border-purple-500"
                      : "bg-white/10 border-white/20"
                  } flex-row items-center`}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text
                    className={`font-JosefinSansBold ${
                      activeTab === tab.id ? "text-white" : "text-white/80"
                    }`}
                  >
                    {tab.label}
                  </Text>
                  {tab.count > 0 && (
                    <View
                      className={`ml-2 px-2 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? "bg-white/20"
                          : "bg-purple-500/30"
                      }`}
                    >
                      <Text
                        className={`font-JosefinSansRegular text-xs ${
                          activeTab === tab.id
                            ? "text-white"
                            : "text-purple-300"
                        }`}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <View className="w-8" />
            </ScrollView>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-between px-5 mb-4">
          {isSelectionMode ? (
            <>
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                className="flex-1 mr-2 bg-white/10 border border-white/20 py-3 rounded-xl items-center active:bg-white/20"
                activeOpacity={0.7}
                disabled={isLoading || selectedIds.length === 0}
              >
                <FontAwesome6
                  name="check"
                  size={16}
                  color={selectedIds.length > 0 ? "#A78BFA" : "#6B7280"}
                />
                <Text
                  className={`font-JosefinSansRegular text-xs ${
                    selectedIds.length > 0 ? "text-white" : "text-gray-500"
                  }`}
                >
                  Mark Read
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteSelected}
                className="flex-1 ml-2 bg-white/10 border border-white/20 py-3 rounded-xl items-center active:bg-white/20"
                activeOpacity={0.7}
                disabled={isLoading || selectedIds.length === 0}
              >
                <FontAwesome6
                  name="trash"
                  size={16}
                  color={selectedIds.length > 0 ? "#EF4444" : "#6B7280"}
                />
                <Text
                  className={`font-JosefinSansRegular text-xs ${
                    selectedIds.length > 0 ? "text-white" : "text-gray-500"
                  }`}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                className="flex-1 mr-2 bg-white/10 border border-white/20 py-3 rounded-xl items-center active:bg-white/20"
                activeOpacity={0.7}
                disabled={isLoading || unreadCount === 0}
              >
                <FontAwesome6
                  name="check"
                  size={16}
                  color={unreadCount > 0 ? "#A78BFA" : "#6B7280"}
                />
                <Text
                  className={`font-JosefinSansRegular text-xs ${
                    unreadCount > 0 ? "text-white" : "text-gray-500"
                  }`}
                >
                  Mark All Read
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearAll}
                className="flex-1 ml-2 bg-white/10 border border-white/20 py-3 rounded-xl items-center active:bg-white/20"
                activeOpacity={0.7}
                disabled={isLoading || notifications.length === 0}
              >
                <FontAwesome6
                  name="trash"
                  size={16}
                  color={notifications.length > 0 ? "#EF4444" : "#6B7280"}
                />
                <Text
                  className={`font-JosefinSansRegular text-xs ${
                    notifications.length > 0 ? "text-white" : "text-gray-500"
                  }`}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Notifications List */}
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#A78BFA"
              colors={["#A78BFA"]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length > 0 ? (
            <>
              {filteredNotifications.map((notification: NotificationData) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onPress={handleNotificationPress}
                  onDelete={handleDelete}
                  onMarkRead={handleMarkRead}
                  isSelected={selectedIds.includes(notification._id)}
                  isSelectionMode={isSelectionMode}
                />
              ))}
            </>
          ) : (
            <View className="items-center justify-center py-20 px-10">
              <View className="w-24 h-24 bg-white/10 rounded-full justify-center items-center mb-6">
                <FontAwesome6 name="bell-slash" size={40} color="#A78BFA" />
              </View>
              <Text className="font-JosefinSansBold text-white text-xl text-center mb-2">
                No Notifications
              </Text>
              <Text className="font-JosefinSansRegular text-white/60 text-center mb-6">
                You're all caught up! Check back later for new updates.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="bg-purple-600 px-8 py-3 rounded-full active:bg-purple-700"
                activeOpacity={0.7}
              >
                <Text className="font-JosefinSansBold text-white">
                  Go to Home
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Spacer */}
          <View className="h-20" />
        </Animated.ScrollView>

        {/* Settings Modal */}
        <Modal
          visible={settingsModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSettingsModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-[#1C1C1E] rounded-t-3xl p-6 pb-10 border-t border-white/10">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="font-JosefinSansBold text-xl text-white">
                  Notification Preferences
                </Text>
                <TouchableOpacity
                  onPress={() => setSettingsModalVisible(false)}
                  className="w-8 h-8 bg-white/10 rounded-full justify-center items-center"
                >
                  <FontAwesome6 name="xmark" size={16} color="#A78BFA" />
                </TouchableOpacity>
              </View>

              <Text className="font-JosefinSansRegular text-white/60 mb-6">
                Customize which alerts you want to receive. Muted alerts will not send push notifications but may still appear in your feed if relevant.
              </Text>

              <View className="space-y-6">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <Text className="font-JosefinSansSemiBold text-white text-base">Workout Reminders</Text>
                    <Text className="font-JosefinSansRegular text-white/60 text-xs mt-1">Pre-shift limits, mobility blocks, and scheduled training</Text>
                  </View>
                  <Switch
                    value={preferences.workoutReminders}
                    onValueChange={(val) => handleTogglePreference("workoutReminders", val)}
                    trackColor={{ false: "#3F3F46", true: "#8B5CF6" }}
                    thumbColor="#FFFFFF"
                    disabled={isUpdatingProfile}
                  />
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <Text className="font-JosefinSansSemiBold text-white text-base">Meal Reminders</Text>
                    <Text className="font-JosefinSansRegular text-white/60 text-xs mt-1">Hydration targets, nutritional resets, and meal logging</Text>
                  </View>
                  <Switch
                    value={preferences.mealReminders}
                    onValueChange={(val) => handleTogglePreference("mealReminders", val)}
                    trackColor={{ false: "#3F3F46", true: "#8B5CF6" }}
                    thumbColor="#FFFFFF"
                    disabled={isUpdatingProfile}
                  />
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <Text className="font-JosefinSansSemiBold text-white text-base">Sleep & Recovery</Text>
                    <Text className="font-JosefinSansRegular text-white/60 text-xs mt-1">Wind-down prompts and readiness updates</Text>
                  </View>
                  <Switch
                    value={preferences.sleepReminders}
                    onValueChange={(val) => handleTogglePreference("sleepReminders", val)}
                    trackColor={{ false: "#3F3F46", true: "#8B5CF6" }}
                    thumbColor="#FFFFFF"
                    disabled={isUpdatingProfile}
                  />
                </View>
                
                <View className="h-[1px] w-full bg-white/10 my-2" />

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <Text className="font-JosefinSansSemiBold text-white text-base">Promotional Offers</Text>
                    <Text className="font-JosefinSansRegular text-white/60 text-xs mt-1">Discounts, subscription deals, and marketing</Text>
                  </View>
                  <Switch
                    value={preferences.promotional}
                    onValueChange={(val) => handleTogglePreference("promotional", val)}
                    trackColor={{ false: "#3F3F46", true: "#8B5CF6" }}
                    thumbColor="#FFFFFF"
                    disabled={isUpdatingProfile}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default NotificationPage;
