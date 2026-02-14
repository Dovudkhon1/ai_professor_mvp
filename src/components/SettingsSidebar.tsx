import React, { useState } from "react";
import { Globe, User, Settings, ChevronRight, X } from "lucide-react";
import Image from "next/image";

type SettingsSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

type SettingType = "language" | "avatar" | "profile" | null;

export default function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
    const [activeSetting, setActiveSetting] = useState<SettingType>(null);
    const [language, setLanguage] = useState("O'zbekcha");
    const [selectedAvatar, setSelectedAvatar] = useState("Professor-John.png");

    // Profile State
    const [profile, setProfile] = useState({
        age: "",
        country: "",
        specialty: "",
        interest: "",
        info: "",
    });

    if (!isOpen) return null;

    const avatars = [
        { name: "John", file: "Professor-John.png" },
        { name: "Katherine", file: "Professor-Katherine.png" },
        { name: "Nelly", file: "Professor-Nelly.png" },
        { name: "Qobiljon", file: "Professor-Qobiljon.png" },
        { name: "Johnson", file: "Professor-Johson.png" },
        { name: "Awais", file: "Professor-Awais.png" },
    ];

    return (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div
                className="absolute top-16 left-0 bottom-0 flex"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Level 1: Main Settings Menu */}
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Sozlamalar</h3>
                    </div>
                    <nav className="flex-1 p-2 space-y-1">
                        <button
                            onClick={() => setActiveSetting(activeSetting === "language" ? null : "language")}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeSetting === "language" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5" />
                                <span className="font-medium">Til</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeSetting === "language" ? "rotate-90" : ""}`} />
                        </button>

                        <button
                            onClick={() => setActiveSetting(activeSetting === "avatar" ? null : "avatar")}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeSetting === "avatar" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5" />
                                <span className="font-medium">Avatar</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeSetting === "avatar" ? "rotate-90" : ""}`} />
                        </button>

                        <button
                            onClick={() => setActiveSetting(activeSetting === "profile" ? null : "profile")}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeSetting === "profile" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Profil</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeSetting === "profile" ? "rotate-90" : ""}`} />
                        </button>
                    </nav>
                </div>

                {/* Level 2: Nested Sub-menu */}
                {activeSetting && (
                    <div className="w-80 bg-gray-50 border-r border-gray-200 shadow-xl overflow-y-auto">
                        <div className="p-4 h-full">
                            {activeSetting === "language" && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tilni tanlang</h4>
                                    {["O'zbekcha", "Ruscha", "Inglizcha"].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all ${language === lang
                                                ? "bg-white border-indigo-500 ring-1 ring-indigo-500 text-indigo-700 font-medium shadow-sm"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeSetting === "avatar" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Avatarni tanlang</h4>
                                    </div>
                                    {avatars.map((av) => (
                                        <button
                                            key={av.file}
                                            onClick={() => setSelectedAvatar(av.file)}
                                            className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-[3/4] ${selectedAvatar === av.file
                                                ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2"
                                                : "border-transparent hover:border-gray-300"
                                                }`}
                                        >
                                            <Image
                                                src={`/avatars/${av.file}`}
                                                alt={av.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-xs font-medium text-center backdrop-blur-sm">
                                                {av.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeSetting === "profile" && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Profilni tahrirlash</h4>

                                    <div className="flex justify-center mb-6">
                                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold border-2 border-indigo-200">
                                            U
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Yosh</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                placeholder="Yoshingizni kiriting"
                                                value={profile.age}
                                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Mamlakat</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                placeholder="Mamlakatni kiriting"
                                                value={profile.country}
                                                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Mutaxassislik</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                placeholder="masalan, Iqtisodiyot"
                                                value={profile.specialty}
                                                onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Qiziqishlar</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                placeholder="Qiziqishlar"
                                                value={profile.interest}
                                                onChange={(e) => setProfile({ ...profile, interest: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Qo'shimcha ma'lumot</label>
                                            <textarea
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-h-[80px]"
                                                placeholder="O'zingiz haqingizda..."
                                                value={profile.info}
                                                onChange={(e) => setProfile({ ...profile, info: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
