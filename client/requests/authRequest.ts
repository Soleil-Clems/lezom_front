import { customfetch } from '@/lib/customFetch';
import type { LoginType, RegisterType } from '@/schemas/auth.dto';

export const loginRequest = async (body: LoginType) => {
  return customfetch.post('auth/login', body);
};

export const registerRequest = async (body: RegisterType) => {
  return customfetch.post('users', body);
};

export const verifyOtpRequest = async (body: { userId: number; code: string }) => {
  return customfetch.post('auth/verify-otp', body);
};

export const resendOtpRequest = async (body: { userId: number }) => {
  return customfetch.post('auth/resend-otp', body);
};

export const forgotPasswordRequest = async (body: { email: string }) => {
  return customfetch.post('auth/forgot-password', body);
};

export const resetPasswordRequest = async (body: { token: string; password: string }) => {
  return customfetch.post('auth/reset-password', body);
};
