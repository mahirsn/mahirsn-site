"use client";

import { useState } from "react";
import { PrayerData } from "@/lib/prayer-times";
import { CountdownHero } from "@/components/imsakiye/CountdownHero";
import { MonthlySchedule } from "@/components/imsakiye/MonthlySchedule";
import { CityCard } from "@/components/imsakiye/CityCard";
import { StatusSidebar } from "@/components/imsakiye/StatusSidebar";

interface ImsakiyeClientWrapperProps {
    dailyData: Record<string, PrayerData>;
    monthlyData: Record<string, PrayerData[]>;
}

export function ImsakiyeClientWrapper({ dailyData, monthlyData }: ImsakiyeClientWrapperProps) {
    const [selectedCity, setSelectedCity] = useState("Istanbul");

    return (

        <div className="w-full">
            <div className="container mx-auto px-4 pt-8">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">
                    İmsakiye-i Bir100Sixteen
                </h1>
            </div>

            {/* Hero Section with Countdown - Full Width */}
            <CountdownHero
                data={dailyData}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
            />

            <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    {/* Main Content: City Cards */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Şehirler (Bugün)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(dailyData).map(([city, cityData]) => (
                                <CityCard key={city} cityName={city} data={cityData} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Status & Notifications */}
                    <div className="lg:col-span-1">
                        <StatusSidebar data={dailyData} />
                    </div>
                </div>

                {/* Monthly Schedule Section - controlled by selectedCity */}
                <MonthlySchedule
                    data={monthlyData}
                    selectedCity={selectedCity}
                />
            </div>
        </div>
    );
}
