
import { PrayerTimesData } from '../types';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';

export const getPrayerTimes = async (lat: number, lng: number): Promise<{ timings: PrayerTimesData, date: any }> => {
  const response = await fetch(`${ALADHAN_BASE}/timings?latitude=${lat}&longitude=${lng}&method=2`);
  const data = await response.json();
  return {
    timings: data.data.timings,
    date: data.data.date
  };
};

export const getQiblaDirection = async (lat: number, lng: number): Promise<number> => {
  const response = await fetch(`${ALADHAN_BASE}/qibla/${lat}/${lng}`);
  const data = await response.json();
  return data.data.direction;
};
