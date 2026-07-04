import { logoutUser, setCredentials } from "@/src/redux/Auth/authSlice";
import { getPostAuthRoute } from "@/src/utils/authRouting";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export const useAuthBootstrap = () => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const hasNavigated = useRef(false); // 🛑 prevents loop

  useEffect(() => {
    const bootstrap = async () => {
      if (hasNavigated.current) return;

      try {
        const token = await SecureStore.getItemAsync("token");
        const userString = await SecureStore.getItemAsync("user");

        if (token && userString) {
          const user = JSON.parse(userString);
          dispatch(
            setCredentials({
              token,
              user,
            }),
          );

          hasNavigated.current = true;
          router.replace(getPostAuthRoute({ data: { user } }));
        } else {
          dispatch(logoutUser());

          hasNavigated.current = true;
          router.replace("/signin");
        }
      } catch (error) {
        console.warn("Auth bootstrap failed", error);
        dispatch(logoutUser());

        hasNavigated.current = true;
        router.replace("/signin");
      } finally {
        setReady(true);
      }
    };

    bootstrap();
  }, []);

  return ready;
};
