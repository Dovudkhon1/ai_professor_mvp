import React from "react";
import { Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Topic } from "@/app/page";

type SidebarProps = {
    topics: Topic[];
    activeTopic: Topic;
    onSelectTopic: (topic: Topic) => void;
};

export default function Sidebar({ topics, activeTopic, onSelectTopic }: SidebarProps) {
    const newsItems = [
        {
            title: "S&P 500 rekord darajaga yetdi",
            summary: "Texnologiya sektori asosiy indeksni yangi cho'qqiga olib chiquvchi bozor o'sishi davom etmoqda.",
            date: "Bugun",
        },
        {
            title: "Fed foiz stavkasi qarori",
            summary: "Federal zaxira tizimi inflyatsiya pasayishi fonida yil oxirida foiz stavkalarini pasaytirishga ishora qilmoqda.",
            date: "Kecha",
        },
    ];

    return (
        <aside className="w-[400px] h-full overflow-y-auto border-r border-gray-200 bg-gray-50 flex flex-col hidden lg:flex flex-shrink-0">
            {/* History Section - Styled like suggested videos */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    <span>Tarix</span>
                </div>
                <div className="space-y-3">
                    {topics.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelectTopic(item)}
                            className={`group flex gap-3 cursor-pointer p-2 rounded-xl transition-colors ${activeTopic.id === item.id ? "bg-white shadow-sm ring-1 ring-gray-200" : "hover:bg-gray-200"
                                }`}
                        >
                            <div className="h-20 w-32 bg-gray-300 rounded-lg flex-shrink-0 relative overflow-hidden">
                                <Image
                                    src={item.thumbnailUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className={`text-sm font-medium line-clamp-2 leading-tight ${activeTopic.id === item.id ? "text-indigo-700" : "text-gray-900"
                                    }`}>
                                    {item.title}
                                </h4>
                                <span className="text-xs text-gray-500 mt-1 line-clamp-1">{item.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Section */}
            <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>Yangiliklar va Tahlil</span>
                </div>
                <div className="space-y-4">
                    {newsItems.map((news, idx) => (
                        <div
                            key={idx}
                            className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h4 className="text-sm font-bold text-gray-900 mb-1">
                                {news.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-3">
                                {news.summary}
                            </p>
                            <div className="mt-2 text-[10px] text-gray-400 font-medium">
                                {news.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
