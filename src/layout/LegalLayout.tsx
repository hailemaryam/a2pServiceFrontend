import { ReactNode } from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";

interface LegalLayoutProps {
    children: ReactNode;
    title: string;
}

export default function LegalLayout({ children, title }: LegalLayoutProps) {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center">
                            <Link to="/landing" className="flex items-center gap-3">
                                <img
                                    src="/images/logo/favicon.png"
                                    alt="Fast SMS Logo"
                                    className="h-10 w-auto"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/favicon.png";
                                    }}
                                />
                                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    FAST<span className="text-brand-500">SMS</span>
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeTogglerTwo />
                            <Link
                                to="/landing"
                                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 tracking-widest"
                            >
                                BACK TO HOME
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-12 tracking-tight">
                        {title}
                    </h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-500 hover:prose-a:text-brand-600 transition-colors">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                                FAST<span className="text-brand-500">SMS</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-600">
                            &copy; {new Date().getFullYear()} Fast SMS. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
