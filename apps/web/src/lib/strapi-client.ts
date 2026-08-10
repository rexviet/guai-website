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

function normalizeVideoSource(videoObj: any, fallback: any) {
  if (!videoObj) return fallback;
  const videoFileUrl = videoObj.video_file?.url
    ? (videoObj.video_file.url.startsWith("http") ? videoObj.video_file.url : `${API_URL}${videoObj.video_file.url}`)
    : null;

  const mp4Url = videoFileUrl || videoObj.mp4_url || fallback.mp4_url;

  return {
    mp4_url: mp4Url,
    poster_url: videoFileUrl ? "" : (videoObj.poster_url || fallback.poster_url),
  };
}

/**
 * Fetch site settings from Strapi
 */
export async function getSiteSettings(locale: string = "vi"): Promise<any> {
  const fallback = {
    site_name: "GuAI Studio",
    tagline: locale === 'en' ? "SHAPING THE FUTURE OF CREATIVITY WITH AI" : "ĐỊNH HÌNH TƯƠNG LAI SÁNG TẠO BẰNG AI",
    banner_video: {
      mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.mp4",
      webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.webm",
      poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-poster-00001.jpg"
    },
    cta_video: {
      mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.mp4",
      webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.webm",
      poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-poster-00001.jpg"
    }
  };

  try {
    const data = await fetchApi<any>("/site-setting", {
      locale,
      populate: {
        banner_video: { populate: "*" },
        cta_video: { populate: "*" },
        logo: { populate: "*" },
        showreel_video: { populate: "*" }
      },
    });
    if (data?.data) {
      return {
        ...fallback,
        ...data.data,
        banner_video: normalizeVideoSource(data.data.banner_video, fallback.banner_video),
        cta_video: normalizeVideoSource(data.data.cta_video, fallback.cta_video),
      };
    }
  } catch (e) {
    // Return rich fallback mock data when Strapi is offline
  }

  return fallback;
}

/**
 * Fetch services from Strapi
 */
export async function getServices(locale: string = "vi"): Promise<any[]> {
  const isEn = locale === 'en';
  const fallbacks = [
    {
      documentId: 'mock-doc-1',
      id: 1,
      title: isEn ? "GenAI Commercial Video Production" : "Sản Xuất Video Quảng Cáo AI (GenAI Video Ads)",
      short_description: isEn ? "Cinematic TVC and viral video ads powered by Google Veo 3.1, Midjourney v6, and Runway Gen-3." : "Sản xuất TVC điện ảnh và video ngắn truyền thông đỉnh cao với Google Veo 3.1, Midjourney v6 và Runway Gen-3.",
      full_description: isEn ? "Full description for GenAI Commercial Video Production." : "Triển khai từ khâu ý tưởng đến sản phẩm hoàn chỉnh.\n\nDịch vụ bao gồm:\n- Tư vấn concept và định hướng phong cách video.\n- Lên ý tưởng, kịch bản và storyboard tùy dự án.\n- Tạo hình ảnh/scene bằng AI.\n- AI voice hoặc phối hợp voice-over theo yêu cầu.\n- Animation, motion, editing, subtitle và hậu kỳ.\n- Video TikTok, Reels, YouTube Shorts, product video, branded video và AI commercial.",
      icon: "video",
      slug: "genai-commercial-video",
      featured_video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-poster-00001.jpg"
      }
    },
    {
      documentId: 'mock-doc-2',
      id: 2,
      title: isEn ? "Virtual KOL & Digital Human Creation" : "Thiết Kế & Vận Hành Virtual KOL / AI Avatar",
      short_description: isEn ? "Next-gen hyper-realistic 3D AI influencers with natural voice synthesis and real-time facial tracking." : "Tạo dựng hình mẫu ảnh hưởng ảo 3D siêu thực với giọng nói AI tự nhiên và chuyển động khuôn mặt theo thời gian thực.",
      full_description: isEn ? "Full description for Virtual KOL." : "GuAI Studio phát triển AI KOL phù hợp với định vị, sản phẩm và khách hàng mục tiêu của doanh nghiệp.\n\nDịch vụ bao gồm:\n- Thiết kế AI KOL phù hợp với hình ảnh thương hiệu.\n- Xây dựng ngoại hình, phong cách, tính cách và đặc điểm nhận diện.\n- Định hướng giọng nói và phong cách giao tiếp.\n- Thiết lập character consistency cho hình ảnh/video.",
      icon: "user-check",
      slug: "virtual-kol-creation",
      featured_video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-poster-00001.jpg"
      }
    },
    {
      documentId: 'mock-doc-3',
      id: 3,
      title: isEn ? "AI VFX & Motion Graphics" : "Kỹ Thảo Kỹ Thuật Số & Motion Graphics AI",
      short_description: isEn ? "Futuristic motion graphics and spatial visual effects crafted specifically for high-end luxury brands." : "Hiệu ứng thị giác tương lai và chuyển động đồ họa cao cấp dành riêng cho các thương hiệu hàng đầu.",
      full_description: isEn ? "Full description for AI VFX & Motion Graphics." : "Nâng tầm hình ảnh thương hiệu bằng các hiệu ứng thị giác tương lai.\n\nDịch vụ bao gồm:\n- Thiết kế motion graphics.\n- Tạo dựng spatial visual effects.\n- 3D modeling và animation cơ bản.",
      icon: "layers",
      slug: "ai-vfx-motion",
      featured_video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-poster-00001.jpg"
      }
    },
    {
      documentId: 'mock-doc-4',
      id: 4,
      title: isEn ? "AI Brand Storytelling & Creative Direction" : "Chiến Lược Thương Hiệu & Kịch Bản AI",
      short_description: isEn ? "Emotional, high-converting storytelling scripts combined with custom-trained GenAI visual pipelines." : "Xây dựng kịch bản cảm xúc kết hợp quy trình sản xuất hình ảnh AI đào tạo riêng theo nhận diện thương hiệu.",
      full_description: isEn ? "Full description for AI Brand Storytelling." : "Dành cho thương hiệu cần một chiến dịch ra mắt sản phẩm, branding, seasonal campaign hoặc social campaign với concept thống nhất trên nhiều định dạng.\n\nDịch vụ bao gồm:\n- Nghiên cứu brief, thương hiệu và mục tiêu chiến dịch.\n- Phát triển creative concept / big idea.\n- Key message, content direction và visual direction.",
      icon: "sparkles",
      slug: "ai-brand-storytelling",
      featured_video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-poster-00001.jpg"
      }
    }
  ];

  try {
    const data = await fetchApi<any>("/services", {
      locale,
      populate: {
        featured_video: { populate: "*" },
        icon: { populate: "*" }
      },
    });
    if (data?.data && data.data.length > 0) {
      return data.data.map((item: any, idx: number) => ({
        ...fallbacks[idx % fallbacks.length],
        ...item,
        featured_video: normalizeVideoSource(item.featured_video, fallbacks[idx % fallbacks.length].featured_video),
      }));
    }
  } catch (e) {
    // Return rich fallback mock data when Strapi is offline
  }

  return fallbacks;
}

/**
 * Fetch case studies (works) from Strapi
 */
export async function getCaseStudies(locale: string = "vi"): Promise<any[]> {
  const isEn = locale === 'en';
  const fallbacks = [
    {
      documentId: 'mock-doc-5',
      id: 1,
      title: isEn ? "Kakao Wcopilot AI Campaign" : "Chiến Dịch Quảng Bá Kakao Wcopilot",
      client: "Kakao Mobility",
      category: "GenAI Video Ads",
      description: isEn ? "High-energy futuristic commercial created 100% using AI visual engines for Kakao Mobility." : "TVC phong cách viễn tưởng sản xuất 100% bằng công nghệ AI cho thương hiệu Kakao Mobility.",
      metrics: "+350% Engagement | 12M+ Views",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      slug: "kakao-wcopilot-ai-campaign",
      video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959a5b7c779f4ff028f8f3_pexels life of pix 852286 1920x1080 60fps (1)-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959a5b7c779f4ff028f8f3_pexels life of pix 852286 1920x1080 60fps (1)-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959a5b7c779f4ff028f8f3_pexels life of pix 852286 1920x1080 60fps (1)-poster-00001.jpg"
      }
    },
    {
      documentId: 'mock-doc-6',
      id: 2,
      title: isEn ? "Cyberpunk Virtual KOL 'AURA'" : "Virtual KOL 3D 'AURA' - Thời Trang Tương Lai",
      client: "Fashion House APAC",
      category: "Virtual KOL",
      description: isEn ? "Creation of digital ambassador AURA for APAC Autumn/Winter fashion collection launch." : "Tạo hình và vận hành KOL ảo AURA đại diện bộ sưu tập thời trang Thu-Đông khu vực APAC.",
      metrics: "500K+ Followers | $1.2M Earned Media",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
      slug: "cyberpunk-virtual-kol-aura",
      video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/6495984d65a257fb519f0dac_pexels rdne stock project 8097473 1920x1080 30fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/6495984d65a257fb519f0dac_pexels rdne stock project 8097473 1920x1080 30fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/6495984d65a257fb519f0dac_pexels rdne stock project 8097473 1920x1080 30fps-poster-00001.jpg"
      }
    },
    {
      documentId: 'mock-doc-7',
      id: 3,
      title: isEn ? "NeuraCar AI Spatial Launch" : "Sự Kiện Ra Mắt Xe Điện NeuraCar AI",
      client: "Neura Motors",
      category: "AI VFX",
      description: isEn ? "3D visual projections and futuristic launch film for next-gen autonomous electric vehicle." : "Trình diễn hình ảnh 3D và phim ngắn ra mắt dòng xe điện tự lái thế hệ mới.",
      metrics: "Top 1 Trending Tech Release",
      image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
      slug: "neuracar-ai-spatial-launch",
      video: {
        mp4_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959d51c577f9fcdc252f82_pexels shvets production 7547019 3840x2160 25fps-transcode.mp4",
        webm_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959d51c577f9fcdc252f82_pexels shvets production 7547019 3840x2160 25fps-transcode.webm",
        poster_url: "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959d51c577f9fcdc252f82_pexels shvets production 7547019 3840x2160 25fps-poster-00001.jpg"
      }
    }
  ];

  try {
    const data = await fetchApi<any>("/case-studies", {
      locale,
      populate: {
        video: { populate: "*" },
        thumbnail: { populate: "*" }
      },
    });
    if (data?.data && data.data.length > 0) {
      return data.data.map((item: any, idx: number) => ({
        ...fallbacks[idx % fallbacks.length],
        ...item,
        video: normalizeVideoSource(item.video, fallbacks[idx % fallbacks.length].video),
      }));
    }
  } catch (e) {
    // Return rich fallback mock data when Strapi is offline
  }

  return fallbacks;
}
