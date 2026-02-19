"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrayerData } from "@/lib/prayer-times";
import { AlarmClock, Coffee, Moon } from "lucide-react";

interface StatusSidebarProps {
    data: Record<string, PrayerData>;
}

export function StatusSidebar({ data }: StatusSidebarProps) {
    const [activeAlerts, setActiveAlerts] = useState<{ city: string; type: 'iftar' | 'sahur'; time: string }[]>([]);

    useEffect(() => {
        const checkTimes = () => {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            const newAlerts: { city: string; type: 'iftar' | 'sahur'; time: string }[] = [];

            Object.entries(data).forEach(([city, cityData]) => {
                const [fajrHours, fajrMinutes] = cityData.timings.Fajr.split(":").map(Number);
                const [maghribHours, maghribMinutes] = cityData.timings.Maghrib.split(":").map(Number);

                // Check if it's currently Sahur time (within last 30 mins)
                if (currentHours === fajrHours && currentMinutes === fajrMinutes) {
                    newAlerts.push({ city, type: 'sahur', time: cityData.timings.Fajr });
                }

                // Check if it's currently Iftar time (within last 30 mins)
                if (currentHours === maghribHours && currentMinutes === maghribMinutes) {
                    newAlerts.push({ city, type: 'iftar', time: cityData.timings.Maghrib });
                }
            });

            setActiveAlerts(newAlerts);
        };

        const timer = setInterval(checkTimes, 20000); // Check every 20s
        checkTimes(); // Initial check

        return () => clearInterval(timer);
    }, [data]);

    return (
        <Card className="h-fit sticky top-4 border-l-4 border-l-indigo-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlarmClock className="h-5 w-5 text-indigo-500" />
                    Anlık Durum
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activeAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Şuan herhangi bir şehir için İftar/Sahur vakti değil.</p>
                    </div>
                ) : (
                    activeAlerts.map((alert, idx) => (
                        <div key={`${alert.city}-${idx}`} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 animate-pulse">
                            {alert.type === 'iftar' ? (
                                <Moon className="h-5 w-5 text-indigo-600 mt-1" />
                            ) : (
                                <Coffee className="h-5 w-5 text-orange-600 mt-1" />
                            )}
                            <div>
                                <h4 className="font-bold">{alert.city}</h4>
                                <p className="text-sm">
                                    {alert.type === 'iftar' ? 'İftar Vakti' : 'Sahur Vakti'} geldi! ({alert.time})
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
