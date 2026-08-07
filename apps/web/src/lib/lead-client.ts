/**
 * Lead Form Client Helpers & API Service
 */

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  message: string;
  turnstileToken?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates lead form input client-side before sending
 */
export function validateLeadForm(data: LeadFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Vui lòng nhập họ và tên";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "Vui lòng nhập địa chỉ email";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Địa chỉ email không hợp lệ";
  }

  if (!data.message || !data.message.trim()) {
    errors.message = "Vui lòng nhập nội dung brief hoặc yêu cầu";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submits lead form data to backend custom endpoint /api/leads
 */
export async function submitLead(
  formData: FormData,
  baseUrl?: string
): Promise<ApiResponse> {
  const apiUrl = baseUrl || process.env.STRAPI_URL || import.meta.env?.STRAPI_URL || "http://localhost:1337";
  const targetUrl = `${apiUrl}/api/leads`;

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.error?.message || result.message || `Lỗi máy chủ (${response.status})`,
      };
    }

    return {
      success: true,
      message: result.message || "Gửi yêu cầu thành công!",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.",
    };
  }
}
