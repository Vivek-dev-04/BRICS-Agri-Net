/**
 * Authentication Service & Types for Farmer Login
 */

export interface LoginCredentials {
  mobile: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    mobile: string;
    name?: string;
  };
  error?: string;
}

/**
 * Validates Indian 10-digit mobile number format
 * Valid Indian mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits
 */
export function validateIndianMobile(mobile: string): { isValid: boolean; error?: string } {
  const trimmed = mobile.trim().replace(/\D/g, "");

  if (!trimmed) {
    return { isValid: false, error: "Please enter your mobile number." };
  }

  if (trimmed.length !== 10) {
    return { isValid: false, error: "Please enter a valid 10-digit mobile number." };
  }

  if (!/^[6-9]/.test(trimmed)) {
    return { isValid: false, error: "Mobile number must start with 6, 7, 8, or 9." };
  }

  return { isValid: true };
}

/**
 * Validates password input
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || password.trim() === "") {
    return { isValid: false, error: "Please enter your password." };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters." };
  }

  return { isValid: true };
}

/**
 * Authentication endpoint integration point.
 * Sends credentials to the server-side API handler.
 */
export async function authenticateFarmer(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "We couldn't sign you in. Please check your mobile number and password and try again.",
      };
    }

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the authentication server. Please check your network and try again.",
    };
  }
}

export interface RegisterFormData {
  name: string;
  mobile: string;
  password: string;
  country: "IN" | "BR" | "RU" | "CN" | "ZA";
  state?: string;
  district?: string;
  village?: string;
  farmName?: string;
  latitude: number;
  longitude: number;
  areaAcres: number;
  crop: string;
  soilType?: string;
  irrigationType?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  farmId?: string;
}

export async function registerFarmer(
  formData: RegisterFormData
): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to register. Please check your details and try again.",
      };
    }

    return {
      success: true,
      message: data.message || "Registration completed successfully.",
      farmId: data.farmer?.id,
    };
  } catch {
    return {
      success: false,
      error: "Unable to connect to registration server. Please check your network connection.",
    };
  }
}

