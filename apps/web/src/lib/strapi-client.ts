/**
 * Strapi API Client Wrapper
 */

const API_URL = process.env.STRAPI_URL || import.meta.env?.STRAPI_URL || "http://localhost:1337";

/**
 * Fetch generic data from Strapi API
 */
export async function fetchApi<T>(
  path: string,
  urlParamsObject: Record<string, any> = {}
): Promise<T> {
  try {
    // Build query string if urlParamsObject is provided
    const token = process.env.STRAPI_TOKEN || import.meta.env?.STRAPI_TOKEN;
    const cleanToken = typeof token === "string" && /^[\x00-\x7F]+$/.test(token) ? token.trim() : null;

    const options = {
      headers: {
        "Content-Type": "application/json",
        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      },
    };

    let queryString = "";
    if (Object.keys(urlParamsObject).length > 0) {
      const qs = await import("qs");
      queryString = "?" + qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    }

    const requestUrl = `${API_URL}/api${path}${queryString}`;

    const response = await fetch(requestUrl, options);
    if (!response.ok) {
      throw new Error(`Please check if Strapi is running and the token is valid. Status: ${response.status}`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching Strapi API path ${path}:`, error);
    throw error;
  }
}

/**
 * Fetch services from Strapi
 */
export async function getServices(locale: string = "vi"): Promise<any[]> {
  try {
    const data = await fetchApi<any>("/services", {
      locale,
      populate: "*",
    });
    if (data?.data && data.data.length > 0) return data.data;
  } catch (e) {
    // Return rich fallback mock data when Strapi is offline
  }

  const isEn = locale === 'en';
  return [
    {
      id: 1,
      attributes: {
        title: isEn ? "GenAI Commercial Video Production" : "Sản Xuất Video Quảng Cáo AI (GenAI Video Ads)",
        description: isEn ? "Cinematic TVC and viral video ads powered by Google Veo 3.1, Midjourney v6, and Runway Gen-3." : "Sản xuất TVC điện ảnh và video ngắn truyền thông đỉnh cao với Google Veo 3.1, Midjourney v6 và Runway Gen-3.",
        icon: "video",
        tags: ["Veo 3.1", "Midjourney", "Commercial Ads", "4K Production"],
        slug: "genai-commercial-video"
      }
    },
    {
      id: 2,
      attributes: {
        title: isEn ? "Virtual KOL & Digital Human Creation" : "Thiết Kế & Vận Hành Virtual KOL / AI Avatar",
        description: isEn ? "Next-gen hyper-realistic 3D AI influencers with natural voice synthesis and real-time facial tracking." : "Tạo dựng hình mẫu ảnh hưởng ảo 3D siêu thực với giọng nói AI tự nhiên và chuyển động khuôn mặt theo thời gian thực.",
        icon: "user-check",
        tags: ["3D Avatar", "Voice Cloning", "Livestream AI", "Brand Ambassador"],
        slug: "virtual-kol-creation"
      }
    },
    {
      id: 3,
      attributes: {
        title: isEn ? "AI VFX & Motion Graphics" : "Kỹ Thảo Kỹ Thuật Số & Motion Graphics AI",
        description: isEn ? "Futuristic motion graphics and spatial visual effects crafted specifically for high-end luxury brands." : "Hiệu ứng thị giác tương lai và chuyển động đồ họa cao cấp dành riêng cho các thương hiệu hàng đầu.",
        icon: "layers",
        tags: ["Motion Design", "Visual Effects", "VFX", "Spatial UI"],
        slug: "ai-vfx-motion"
      }
    },
    {
      id: 4,
      attributes: {
        title: isEn ? "AI Brand Storytelling & Creative Direction" : "Chiến Lược Thương Hiệu & Kịch Bản AI",
        description: isEn ? "Emotional, high-converting storytelling scripts combined with custom-trained GenAI visual pipelines." : "Xây dựng kịch bản cảm xúc kết hợp quy trình sản xuất hình ảnh AI đào tạo riêng theo nhận diện thương hiệu.",
        icon: "sparkles",
        tags: ["Storytelling", "AI Pipeline", "Brand Strategy"],
        slug: "ai-brand-storytelling"
      }
    }
  ];
}

/**
 * Fetch case studies (works) from Strapi
 */
export async function getCaseStudies(locale: string = "vi"): Promise<any[]> {
  try {
    const data = await fetchApi<any>("/case-studies", {
      locale,
      populate: "deep",
    });
    if (data?.data && data.data.length > 0) return data.data;
  } catch (e) {
    // Return rich fallback mock data when Strapi is offline
  }

  const isEn = locale === 'en';
  return [
    {
      id: 1,
      attributes: {
        title: isEn ? "Kakao Wcopilot AI Campaign" : "Chiến Dịch Quảng Bá Kakao Wcopilot",
        client: "Kakao Mobility",
        category: "GenAI Video Ads",
        description: isEn ? "High-energy futuristic commercial created 100% using AI visual engines for Kakao Mobility." : "TVC phong cách viễn tưởng sản xuất 100% bằng công nghệ AI cho thương hiệu Kakao Mobility.",
        metrics: "+350% Engagement | 12M+ Views",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        slug: "kakao-wcopilot-ai-campaign"
      }
    },
    {
      id: 2,
      attributes: {
        title: isEn ? "Cyberpunk Virtual KOL 'AURA'" : "Virtual KOL 3D 'AURA' - Thời Trang Tương Lai",
        client: "Fashion House APAC",
        category: "Virtual KOL",
        description: isEn ? "Creation of digital ambassador AURA for APAC Autumn/Winter fashion collection launch." : "Tạo hình và vận hành KOL ảo AURA đại diện bộ sưu tập thời trang Thu-Đông khu vực APAC.",
        metrics: "500K+ Followers | $1.2M Earned Media",
        image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
        slug: "cyberpunk-virtual-kol-aura"
      }
    },
    {
      id: 3,
      attributes: {
        title: isEn ? "NeuraCar AI Spatial Launch" : "Sự Kiện Ra Mắt Xe Điện NeuraCar AI",
        client: "Neura Motors",
        category: "AI VFX",
        description: isEn ? "3D visual projections and futuristic launch film for next-gen autonomous electric vehicle." : "Trình diễn hình ảnh 3D và phim ngắn ra mắt dòng xe điện tự lái thế hệ mới.",
        metrics: "Top 1 Trending Tech Release",
        image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
        slug: "neuracar-ai-spatial-launch"
      }
    }
  ];
}
