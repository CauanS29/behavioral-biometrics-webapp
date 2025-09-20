export const environment = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;
