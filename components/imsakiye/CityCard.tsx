"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun } from "lucide-react";
import { PrayerData } from "@/lib/prayer-times";

interface CityCardProps {
    cityName: string;
    data: PrayerData | null;
}

export function CityCard({ cityName, data }: CityCardProps) {
    if (!data) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{cityName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Veri yüklenemedi.</p>
                </CardContent>
            </Card>
        );
    }

    const { timings, date } = data;

    return (
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{cityName}</CardTitle>
                <Badge variant="outline">{date.gregorian.date}</Badge>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center justify-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-orange-600 dark:text-orange-400">
                            <Sun className="h-4 w-4" />
                            <span className="text-sm font-medium">İmsak (Sahur)</span>
                        </div>
                        <span className="text-2xl font-bold">{timings.Fajr}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-indigo-600 dark:text-indigo-400">
                            <Moon className="h-4 w-4" />
                            <span className="text-sm font-medium">Akşam (İftar)</span>
                        </div>
                        <span className="text-2xl font-bold">{timings.Maghrib}</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground text-center">
                    <div>Güneş: {timings.Sunrise}</div>
                    <div>Öğle: {timings.Dhuhr}</div>
                    <div>İkindi: {timings.Asr}</div>
                    <div>Yatsı: {timings.Isha}</div>
                </div>
            </CardContent>
        </Card>
    );
}
