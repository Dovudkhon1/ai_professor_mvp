import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-neutral-900">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
          AI Professor
        </h1>
        <p className="max-w-md text-lg text-gray-600">
          Interactive learning with AI avatars. Choose your role to get started.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/student"
            className="flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
          >
            Student&apos;s Page
          </Link>
          <Link
            href="/professor"
            className="flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            Professor&apos;s Page
          </Link>
        </div>
      </main>
    </div>
  );
}
