import { getAllCitiesPrayerTimes, getAllCitiesRamadanPrayerTimes } from "@/lib/prayer-times";
import { ImsakiyeClientWrapper } from "@/components/imsakiye/ImsakiyeClientWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "İmsakiye-ül Bir100Sixteen | İftar ve Sahur Vakitleri",
    description: "İstanbul, Ankara, İzmir ve diğer şehirler için güncel Ramazan imsakiyesi. İftar ve sahur vakitleri, geri sayım ve namaz saatleri.",
};

export default async function ImsakiyePage() {
    // Fetch both daily data (for hero/cards) and monthly data (for the schedule)
    // We can optimize this but for now concurrent fetching is fine
    const [dailyData, monthlyData] = await Promise.all([
        getAllCitiesPrayerTimes(),
        getAllCitiesRamadanPrayerTimes()
    ]);

    return (
        <ImsakiyeClientWrapper dailyData={dailyData} monthlyData={monthlyData} />
    );
}
