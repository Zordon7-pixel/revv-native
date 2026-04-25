import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

const PII_URL_PARTS = [
  '/customers/',
  '/ros/',
  '/repair-orders/',
  '/estimate-items/',
  '/invoice/',
  '/photos/',
  '/payments/',
];

function beforeSend(event /*, hint */) {
  try {
    if (event && event.request) {
      const url = (event.request && event.request.url) || '';
      if (PII_URL_PARTS.some((p) => url.includes(p))) {
        event.request.data = '[scrubbed: PII path]';
      }
      if (event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.authorization;
        delete event.request.headers.Cookie;
        delete event.request.headers.cookie;
      }
    }
    if (event && event.user) {
      const safe = {};
      if (event.user.shop_id) safe.shop_id = event.user.shop_id;
      if (event.user.id) safe.id = event.user.id;
      event.user = safe;
    }
  } catch (_e) {
    // Defensive: never throw from beforeSend
  }
  return event;
}

export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[sentry] EXPO_PUBLIC_SENTRY_DSN not set — Sentry disabled');
    }
    return false;
  }
  Sentry.init({
    dsn,
    enableInExpoDevelopment: false,
    debug: false,
    environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release:
      Constants.expoConfig?.extra?.gitCommitSha ||
      Constants.manifest?.extra?.gitCommitSha ||
      'local',
    initialScope: { tags: { platform: 'mobile' } },
    beforeSend,
  });
  return true;
}

export const captureException = (err, ctx) =>
  Sentry.Native.captureException(err, ctx);
