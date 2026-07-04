export type MaybeRecord = Record<string, any> | null | undefined;

export const normalizeMediaUrl = (value: string) => {
  if (!value) return value;

  return value
    .replace("http://localhost:5000", "https://apiv2.bootble.com")
    .replace("http://13.61.182.113:5000", "https://apiv2.bootble.com")
    .replace("https://apiv2.bootble.com/api", "https://apiv2.bootble.com");
};

export const getResponseUser = (payload: MaybeRecord) => {
  return payload?.data?.user ?? payload?.user ?? payload?.data ?? null;
};

export const getResponseToken = (payload: MaybeRecord) => {
  return payload?.token ?? payload?.data?.token ?? null;
};

export const isSuccessfulResponse = (payload: MaybeRecord) => {
  return Boolean(
    payload?.success ||
      String(payload?.status ?? "").toLowerCase() === "success" ||
      getResponseToken(payload) ||
      getResponseUser(payload),
  );
};

export const getDisplayName = (user: MaybeRecord) => {
  return (
    user?.name ?? user?.fullName ?? user?.displayName ?? user?.email ?? "User"
  );
};

export const getProfilePhotoUri = (user: MaybeRecord) => {
  const photo = user?.profilePhoto;
  if (typeof photo !== "string" || !photo.trim()) return null;

  const normalized = normalizeMediaUrl(photo.trim());
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return null;
};

export const formatProfileMetric = (value: any) => {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "object") {
    const metricValue = value?.value ?? value?.amount ?? value?.number;
    const unit = value?.unit ? ` ${value.unit}` : "";
    return metricValue === null || metricValue === undefined
      ? ""
      : `${metricValue}${unit}`;
  }

  return String(value);
};

export const isEmailVerified = (user: MaybeRecord) => {
  const status = String(user?.accountStatus ?? user?.status ?? "").toLowerCase();
  if (status.includes("unverified") || status.includes("verify")) return false;

  return Boolean(
    user?.isEmailVerified ??
      user?.isVerified ??
      user?.emailVerified ??
      user?.verified,
  );
};

export const isOnboardingComplete = (user: MaybeRecord) => {
  const status = String(user?.accountStatus ?? user?.status ?? "").toLowerCase();
  if (status.includes("onboarding")) return false;

  return Boolean(
    user?.onboardingCompleted ??
      user?.onboardingComplete ??
      user?.isOnboardingComplete ??
      user?.profileCompleted ??
      user?.hasCompletedOnboarding,
  );
};

export const getPostAuthRoute = (payload: MaybeRecord) => {
  const user = getResponseUser(payload);

  if (!user) return "/signin";

  const status = String(user?.accountStatus ?? user?.status ?? "").toLowerCase();

  if (!isEmailVerified(user) || status === "unverified") return "/varify";
  if (!isOnboardingComplete(user) || status.includes("onboarding")) {
    return "/shiftSelection";
  }

  return "/home";
};
