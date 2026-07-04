// ===== USER TYPE =====
export interface User {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  onboardingCompleted?: boolean;
  accountStatus?: string;
  status?: string;
  goalType?: string;
  shiftType?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  location?: {
    city?: string;
    country?: string;
  };
  height?: string | number | { unit?: string; value?: number | null };
  weight?: string | number | { unit?: string; value?: number | null };
  profilePhoto?: string | Record<string, any>;
  subscription?: {
    plan?: string;
    status?: string;
    trialEnds?: string;
  };
}

export interface ApiEnvelope<T> {
  status?: string;
  success?: boolean;
  message?: string;
  token?: string;
  data?: T;
  user?: User;
}

// ==========sign in=======
export interface SignInPayload {
  email: string;
  password: string;
}
export interface SignInResponse extends ApiEnvelope<{ user: User; token?: string }> {
  token?: string;
}

// ===== Sign-up RESPONSE =====
export interface SignUpResponse extends ApiEnvelope<{ user: User; token?: string }> {
  token?: string;
}

// ===== Sign-up INPUT =====
export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

// ==== ProfileResponse =====

export interface ProfileResponse extends ApiEnvelope<{ user: User }> {
  data?: {
    user: User & {
      emailNotifications?: boolean;
      isBlocked?: boolean;
      agreeToTerms?: boolean;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
      height?: { unit?: string; value?: number | null };
      weight?: { unit?: string; value?: number | null };
      healthTargets?: {
        calories?: number;
        workout?: number;
        steps?: number;
        sleep?: number;
        water?: number;
      };
    };
  };
  user?: User;
}

// ===========varification

export interface VerifyCodeRequest {
  email: string;
  otp: string;
  purpose: string;
}

// ========= verification response

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
}

export interface LogOutResponse {
  success: boolean;
  message: string;
}

// ==========forget password
export interface ForgetRequest {
  email: string;
}
// =========response forgetpassword
export interface ForgetResponse {
  success: boolean;
  message: string;
}
//password change reset password ResetPasswordResponse, ResetPasswordRequest
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// =======================================================================================================
// End Authentication
// =======================================================================================================
