import { useLogoutMutation } from "@/src/redux/Auth/authApi";
import { logoutUser } from "@/src/redux/Auth/authSlice";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Modal, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose }) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      // Call backend to invalidate session
      await logout().unwrap();
      
      // Delete SecureStore data
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");

      // Clear Redux state
      dispatch(logoutUser());
      router.replace("/signin");

      console.log("Logout successful");
    } catch (error) {
      console.log("Logout error:", error);
      // Still clear local session if backend fails to prevent being stuck
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
      dispatch(logoutUser());
      router.replace("/signin");
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-[80%] bg-[#352E60] p-[3%] rounded-2xl">
          <Text className="text-lg text-[#fff] font-PoppinsSemiBold text-center w-[70%] mx-auto">
            Are you sure you want to logout?
          </Text>

          <View className="flex-row items-center justify-center my-4">
            <TouchableOpacity
              className="px-[3%] py-[1%] border border-[#514D76] rounded-lg mr-[2%]"
              onPress={onClose}
            >
              <Text className="text-[#fff] font-PoppinsSemiBold text-base">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-[3%] py-[1%] border border-red-400 rounded-lg mr-[2%] flex-row items-center justify-center min-w-[80px]"
              onPress={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#F87171" />
              ) : (
                <Text className="text-red-400 font-PoppinsSemiBold text-base">
                  Logout
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
