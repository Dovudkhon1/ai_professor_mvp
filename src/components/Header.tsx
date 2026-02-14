import React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-50 h-16 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden">
                        <Image
                            src="/logos/platform_logo.png"
                            alt="IITTP Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
                        Intellektual iqtisodiy ta’lim va tahlil platformasi (IITTP)
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                {/* User profile or settings could go here */}
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    U
                </div>
            </div>
        </header>
    );
}
