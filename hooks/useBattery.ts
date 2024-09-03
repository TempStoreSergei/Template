import { computed, onMounted, reactive } from 'vue';

// Define the translations for both languages
const translations = {
  en: {
    hours: 'hours',
    minutes: 'minutes',
    fullyCharged: 'Fully Charged',
    charging: 'Charging',
    notCharging: 'Not Charging',
  },
  ru: {
    hours: 'часов',
    minutes: 'минут',
    fullyCharged: 'Полностью заряжено',
    charging: 'Зарядка',
    notCharging: 'Не заряжается',
  },
};

// Define the type for Battery
export type Battery = {
  charging: boolean; // Current battery charging status
  chargingTime: number; // Time left to fully charge in seconds
  dischargingTime: number; // Time left to discharge in seconds
  /** Battery level in range 0.0 to 1.0 */
  level: number;
  [key: string]: any;
};

export const useBattery = () => {
  // Locale can be changed to 'ru' for Russian
  const locale = reactive({ current: 'en' });

  const battery = reactive<Battery>({
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    level: 1,
  });

  // Check if the browser supports Battery API
  const isSupported = navigator && 'getBattery' in navigator;

  // Update battery state
  const updateBattery = (target: Battery) => {
    for (const key in battery) {
      battery[key] = target[key];
    }
    battery.level = battery.level * 100;
  };

  // Calculate remaining discharging time
  const calcDischargingTime = computed(() => {
    const hour = battery.dischargingTime / 3600;
    const minute = (battery.dischargingTime / 60) % 60;
    return `${~~hour} ${translations[locale.current].hours} ${~~minute} ${translations[locale.current].minutes}`;
  });

  // Battery status
  const batteryStatus = computed(() => {
    if (battery.charging && battery.level >= 100) {
      return translations[locale.current].fullyCharged;
    } else if (battery.charging) {
      return translations[locale.current].charging;
    } else {
      return translations[locale.current].notCharging;
    }
  });

  onMounted(async () => {
    const BatteryManager: Battery = (await (navigator as any).getBattery?.()) || {};
    updateBattery(BatteryManager);

    // Update battery state on events
    BatteryManager.onchargingchange = ({ target }) => updateBattery(target);
    BatteryManager.onchargingtimechange = ({ target }) => updateBattery(target);
    BatteryManager.ondischargingtimechange = ({ target }) => updateBattery(target);
    BatteryManager.onlevelchange = ({ target }) => updateBattery(target);
  });

  return {
    battery,
    isSupported,
    batteryStatus,
    calcDischargingTime,
    locale, // Expose locale to allow switching
  } as const;
};
