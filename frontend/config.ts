/**
 * Configuration file for RankCatalyst frontend
 * Contains all environment variables that would normally be in .env.local
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  appName: 'RankCatalyst',
  webgazerSampleInterval: 150, // milliseconds
  defaultMaxQuestions: 15,
};

