export const API_BASE_URL = "/api/proxy/";

export const getLocaleFromCookies = (): string => {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/locale=([^;]+)/);
    return match ? match[1] : "ua";
  }
  return "ua";
};
