"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PrayerData } from "@/lib/prayer-times";
import { cn } from "@/lib/utils";

interface MonthlyScheduleProps {
    data: Record<string, PrayerData[]>;
    selectedCity: string;
}

export function MonthlySchedule({ data, selectedCity }: MonthlyScheduleProps) {
    const schedule = data[selectedCity] || [];

    // Get today's date string for highlighting
    const today = new Date().toISOString().split("T")[0];

    // Helper to standardise date format for comparison since API format might vary slightly
    const isToday = (dateStr: string) => {
        // API returns DD-MM-YYYY
        const [day, month, year] = dateStr.split("-");
        const apiDate = `${year}-${month}-${day}`;
        // Basic check, might need robust parsing if format changes
        return apiDate === today;
    };

    return (
        <Card className="w-full mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>2026 Ramazan İmsakiyesi - {selectedCity}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="p-3 font-medium">Hicri / Miladi Tarih</th>
                                <th className="p-3 font-medium text-center">İmsak (Sahur)</th>
                                <th className="p-3 font-medium text-center">Güneş</th>
                                <th className="p-3 font-medium text-center">Öğle</th>
                                <th className="p-3 font-medium text-center">İkindi</th>
                                <th className="p-3 font-medium text-center">Akşam (İftar)</th>
                                <th className="p-3 font-medium text-center">Yatsı</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((day, idx) => {
                                // Check if today: The API returns `DD-MM-YYYY` in `gregorian.date`. 
                                // We need to compare with local today.
                                const isRowToday = isToday(day.date.gregorian.date);

                                return (
                                    <tr
                                        key={idx}
                                        className={cn(
                                            "border-b transition-colors hover:bg-muted/50",
                                            isRowToday && "bg-indigo-50 dark:bg-indigo-950/30 font-medium border-l-4 border-l-indigo-500"
                                        )}
                                    >
                                        <td className="p-3">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{day.date.gregorian.date}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {(() => {
                                                        // Diyanet Calendar: Ramadan Starts Feb 19, 2026
                                                        const [dayStr, monthStr, yearStr] = day.date.gregorian.date.split("-");
                                                        const currentDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
                                                        const ramadanStart = new Date(2026, 1, 19); // Feb 19

                                                        // Calculate day difference
                                                        const diffTime = currentDate.getTime() - ramadanStart.getTime();
                                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                        const ramadanDay = diffDays + 1;

                                                        if (ramadanDay >= 1 && ramadanDay <= 30) {
                                                            return <span className="text-indigo-600 dark:text-indigo-400 font-bold">Ramazan {ramadanDay}. Gün</span>;
                                                        } else {
                                                            // For other days, just show the Hijri date from API
                                                            return <span>{day.date.hijri.day} {day.date.hijri.month.en}</span>;
                                                        }
                                                    })()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center font-bold text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/10 rounded-sm">
                                            {day.timings.Fajr.split(" ")[0]}
                                        </td>
                                        <td className="p-3 text-center">{day.timings.Sunrise.split(" ")[0]}</td>
                                        <td className="p-3 text-center">{day.timings.Dhuhr.split(" ")[0]}</td>
                                        <td className="p-3 text-center">{day.timings.Asr.split(" ")[0]}</td>
                                        <td className="p-3 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-sm">
                                            {day.timings.Maghrib.split(" ")[0]}
                                        </td>
                                        <td className="p-3 text-center">{day.timings.Isha.split(" ")[0]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
