
export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
}

export interface PrayerData {
    timings: PrayerTimes;
    date: {
        readable: string;
        hijri: {
            date: string;
            day: string;
            month: {
                number: number;
                en: string;
                ar: string;
            };
            weekday: {
                en: string;
                ar: string;
            };
        };
        gregorian: {
            date: string;
            weekday: {
                en: string;
            };
        };
    };
}

export const CITIES = [
    { name: "Batman", country: "Turkey" },
    { name: "Kocaeli", country: "Turkey" },
    { name: "Kayseri", country: "Turkey" },
    { name: "Ankara", country: "Turkey" },
    { name: "Istanbul", country: "Turkey" },
];

export async function getPrayerTimes(city: string, country: string = "Turkey"): Promise<PrayerData | null> {
    try {
        const res = await fetch(
            `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=13`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch prayer times for ${city}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getMonthlyPrayerTimes(city: string, country: string = "Turkey", month?: number, year?: number): Promise<PrayerData[] | null> {
    try {
        const now = new Date();
        const m = month || now.getMonth() + 1;
        const y = year || now.getFullYear();

        const res = await fetch(
            `http://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=13&month=${m}&year=${y}`,
            { next: { revalidate: 86400 } } // Cache for 24 hours
        );

        if (!res.ok) {
            // Fallback or retry logic could go here
            throw new Error(`Failed to fetch monthly prayer times for ${city}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllCitiesPrayerTimes() {
    const promises = CITIES.map((city) => getPrayerTimes(city.name, city.country));
    const results = await Promise.all(promises);

    const data: Record<string, PrayerData> = {};

    results.forEach((result, index) => {
        if (result) {
            data[CITIES[index].name] = result;
        }
    });

    return data;
}

export async function getAllCitiesMonthlyPrayerTimes() {
    const promises = CITIES.map((city) => getMonthlyPrayerTimes(city.name, city.country));
    const results = await Promise.all(promises);

    const data: Record<string, PrayerData[]> = {};

    results.forEach((result, index) => {
        if (result) {
            data[CITIES[index].name] = result;
        }
    });

    return data;
}

export async function getAllCitiesRamadanPrayerTimes() {
    const promises = CITIES.map(async (city) => {
        // Fetch Feb and March 2026
        const feb = await getMonthlyPrayerTimes(city.name, city.country, 2, 2026);
        const mar = await getMonthlyPrayerTimes(city.name, city.country, 3, 2026);

        if (!feb || !mar) return null;

        // Combine
        const allDays = [...feb, ...mar];

        // Filter for Ramadan Range: Feb 19 - Mar 20 (approx 30 days)
        // Ramazan Starts: Feb 19
        // Ramazan Ends: Mar 19/20
        const ramadanDays = allDays.filter(day => {
            const [d, m, y] = day.date.gregorian.date.split("-").map(Number);
            // Check if date is within Feb 19 - Mar 20

            // Feb 19+
            if (m === 2 && d >= 19) return true;
            // Mar 1-19 (Total 29 Days)
            if (m === 3 && d <= 19) return true;

            return false;
        });

        return ramadanDays;
    });

    const results = await Promise.all(promises);

    const data: Record<string, PrayerData[]> = {};

    results.forEach((result, index) => {
        if (result) {
            data[CITIES[index].name] = result;
        }
    });

    return data;
}
