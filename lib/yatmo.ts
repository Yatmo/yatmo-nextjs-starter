// Server-side Yatmo calls, cached. The backend key never leaves the server.
import { unstable_cache } from 'next/cache';
import { createYatmoClient, type YatmoCountry, type YatmoSummary, type YatmoSummaryText } from '@yatmo/sdk';

export const COUNTRY = (process.env.YATMO_COUNTRY ?? 'BE') as YatmoCountry;
export const LANGUAGE = 'EN';
export const FRONTEND_KEY = process.env.NEXT_PUBLIC_YATMO_FRONTEND_KEY ?? '';

const THIRTY_DAYS = 30 * 24 * 3600;

function client() {
  const key = process.env.YATMO_BACKEND_KEY;
  if (!key) throw new Error('Set YATMO_BACKEND_KEY in .env.local (see .env.example)');
  return createYatmoClient({ key, country: COUNTRY, language: LANGUAGE });
}

/** The neighbourhood text and the nearest places of a listing, cached for 30 days: a neighbourhood rarely changes. */
export const getNeighbourhood = unstable_cache(
  async (latitude: number, longitude: number): Promise<{ text: YatmoSummaryText | null; summary: YatmoSummary | null }> => {
    const yatmo = client();
    const position = { latitude, longitude };
    const [text, summary] = await Promise.all([
      yatmo.summaryText(position).catch(() => null),
      yatmo.summary(position).catch(() => null),
    ]);
    return { text, summary };
  },
  ['yatmo-neighbourhood'],
  { revalidate: THIRTY_DAYS },
);
