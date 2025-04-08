export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

export const AuthTimeConstants = {
  ACCESS_TOKEN: {
    EXPIRES_IN: '60m', // For JWT
    COOKIE_MAX_AGE: 3600000, // 15min in ms (for cookies)
  },
  REFRESH_TOKEN: {
    EXPIRES_IN: '7d', // For JWT
    COOKIE_MAX_AGE: 604800000, // 7 days in ms
  },
} as const;
