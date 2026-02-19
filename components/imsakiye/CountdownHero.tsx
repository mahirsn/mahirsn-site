"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PrayerData } from "@/lib/prayer-times";
import { motion } from "framer-motion";

interface CountdownHeroProps {
    data: Record<string, PrayerData>;
    selectedCity: string;
    onCityChange: (city: string) => void;
}

export function CountdownHero({ data, selectedCity, onCityChange }: CountdownHeroProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; city: string } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const cityData = data[selectedCity];
            if (!cityData) return;

            const now = new Date();
            const ramadanStart = new Date(2026, 1, 19); // Feb 19, 2026
            const diffToRamadan = ramadanStart.getTime() - now.getTime();

            // If before Ramadan Start (and giving a buffer so we switch to Sahur logic on the night of 18th)
            // Actually, usually users want to see "Ramadan Starts In..." 
            // Let's say if we are more than 24h away, show Ramadan Start.
            // Or better: just utilize the generic logic but check if we should override the "Next Event" name.

            // Official logic:
            // First Sahur is on the night of Feb 18 leading to Feb 19.
            // First Iftar is Feb 19 Evening.

            const prayers = [
                { name: "İmsak (Sahur)", time: cityData.timings.Fajr },
                { name: "Akşam (İftar)", time: cityData.timings.Maghrib },
            ];

            // Convert prayer times to Date objects
            const upcomingPrayers = prayers.map((p) => {
                const [hours, minutes] = p.time.split(":").map(Number);
                const prayerDate = new Date(now);
                prayerDate.setHours(hours, minutes, 0, 0);
                return { ...p, date: prayerDate };
            });

            // Find next prayer
            let next = upcomingPrayers.find((p) => p.date > now);

            if (!next) {
                // Fallback for next day
                const imsak = upcomingPrayers.find(p => p.name === "İmsak (Sahur)");
                if (imsak) {
                    const tomorrow = new Date(imsak.date);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    next = { ...imsak, date: tomorrow };
                }
            }

            if (next) {
                // Feature: Check if "Ramazan Başlangıcı" (Start of Ramadan)
                // If now < Feb 19 Imsak, we can technically say "Countdown to Ramadan" or similar.
                // But specifically, if it is Feb 17 or 18, the "Next Prayer" might be Iftar/Sahur of Shaban days.
                // User asked "arrange whole site accordingly".
                // If valid fasting hasn't started, "Vakit: Iftar" might be confusing?
                // But people fast in Shaban too.
                // However, let's add a special override if it is > 1 day away from Ramadan.

                // Let's keep it simple: reliable countdown to *next prayer* is always useful.
                // But we can add a label "Ramazan'a X Gün Kaldı" if relevant.

                // For now, adhere to standard prayer times logic from API as it is correct for any day.
                // Just use the derived "next" object.

                // One fix: If next is Imsak on Feb 19, ensure label says "First Sahur".
                if (next.date.getMonth() === 1 && next.date.getDate() === 19 && next.name === "İmsak (Sahur)") {
                    next.name = "İlk Sahur (Ramazan Başlangıcı)";
                }

                setNextPrayer({ name: next.name, time: next.time, city: selectedCity });
                const diff = next.date.getTime() - now.getTime();

                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                // Override days if needed (current logic only shows H:M:S)
                // If diff > 24 hours (e.g. 1.5 days), hours will wrap.
                const totalHours = Math.floor(diff / (1000 * 60 * 60));

                setTimeLeft({ hours: totalHours, minutes, seconds });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [data, selectedCity]);

    if (!timeLeft || !nextPrayer) {
        return null; // Or loading skeleton
    }

    return (

        <div className="w-full mb-12 relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] opacity-20 bg-cover bg-center" />
            <div className="relative z-10 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex gap-2 justify-center mb-6">
                        {Object.keys(data).map(city => (
                            <button
                                key={city}
                                onClick={() => onCityChange(city)}
                                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${selectedCity === city ? "bg-white text-indigo-900" : "bg-white/10 hover:bg-white/20 text-white"}`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>

                    <h2 className="text-xl md:text-2xl font-light tracking-wide mb-2 opacity-90">
                        {nextPrayer.city} için {nextPrayer.name} Vaktine Kalan Süre
                    </h2>

                    <div className="flex items-center justify-center gap-4 md:gap-8 my-6 font-mono">
                        <div className="flex flex-col">
                            <span className="text-4xl md:text-6xl font-bold shadow-black drop-shadow-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-xs uppercase tracking-widest opacity-60">Saat</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-bold -mt-4">:</span>
                        <div className="flex flex-col">
                            <span className="text-4xl md:text-6xl font-bold shadow-black drop-shadow-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-xs uppercase tracking-widest opacity-60">Dakika</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-bold -mt-4">:</span>
                        <div className="flex flex-col">
                            <span className="text-4xl md:text-6xl font-bold shadow-black drop-shadow-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-xs uppercase tracking-widest opacity-60">Saniye</span>
                        </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="text-lg">Vakit: <span className="font-bold">{nextPrayer.time}</span></span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
