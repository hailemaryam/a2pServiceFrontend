export default function AboutUs() {
    return (
        <section id="about" className="py-24 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-6">
                            Empowering Businesses with Reliable SMS Solutions
                        </h2>
                        <div className="space-y-6">
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                A2P Systems is a leading provider of enterprise-grade SMS messaging solutions. We specialize in helping businesses connect with their customers through reliable, fast, and secure communication channels.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Our platform is designed to handle high-volume messaging needs while providing the tools and insights required to launch successful SMS campaigns. With a focus on the Ethiopian market, we support local languages and provide seamless integration with local networks.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <div>
                                    <h4 className="text-4xl font-bold text-brand-500 mb-2">99.9%</h4>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime Guarantee</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-bold text-brand-500 mb-2">10M+</h4>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages Monthly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 lg:mt-0 relative group">
                        {/* Messaging Ecosystem Visualization */}
                        <div className="relative h-[450px] bg-white dark:bg-gray-800/50 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden p-8 flex items-center justify-center">

                            {/* Central Hub */}
                            <div className="relative z-20 w-32 h-32 bg-brand-500 rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl shadow-brand-500/40 animate-pulse-slow">
                                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs font-black tracking-widest uppercase">A2P HUB</span>
                            </div>

                            {/* Connections Layer */}
                            <div className="absolute inset-0 z-10">
                                <svg className="w-full h-full" viewBox="0 0 400 400">
                                    {/* Lines to Clients */}
                                    <line x1="200" y1="200" x2="80" y2="100" className="stroke-gray-200 dark:stroke-gray-700 stroke-2" />
                                    <line x1="200" y1="200" x2="80" y2="300" className="stroke-gray-200 dark:stroke-gray-700 stroke-2" />

                                    {/* Lines to Networks */}
                                    <line x1="200" y1="200" x2="320" y2="100" className="stroke-gray-200 dark:stroke-gray-700 stroke-2" />
                                    <line x1="200" y1="200" x2="320" y2="300" className="stroke-gray-200 dark:stroke-gray-700 stroke-2" />

                                    {/* Animated Pulses */}
                                    <circle r="4" fill="#E57A38">
                                        <animateMotion dur="2s" repeatCount="indefinite" path="M 80,100 L 200,200" />
                                    </circle>
                                    <circle r="4" fill="#E57A38">
                                        <animateMotion dur="2.5s" repeatCount="indefinite" path="M 80,300 L 200,200" />
                                    </circle>
                                    <circle r="4" fill="#10B981">
                                        <animateMotion dur="1.8s" repeatCount="indefinite" path="M 200,200 L 320,100" />
                                    </circle>
                                    <circle r="4" fill="#10B981">
                                        <animateMotion dur="2.2s" repeatCount="indefinite" path="M 200,200 L 320,300" />
                                    </circle>
                                </svg>
                            </div>

                            {/* Node Icons */}
                            <div className="absolute top-16 left-12 z-20 flex flex-col items-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-gray-400 group-hover:text-brand-500 transition-colors">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">API Clients</span>
                            </div>

                            <div className="absolute bottom-16 left-12 z-20 flex flex-col items-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-gray-400 group-hover:text-brand-500 transition-colors">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Web Dashboard</span>
                            </div>

                            <div className="absolute top-16 right-12 z-20 flex flex-col items-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-gray-400 group-hover:text-emerald-500 transition-colors">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ethio Telecom</span>
                            </div>

                            <div className="absolute bottom-16 right-12 z-20 flex flex-col items-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-gray-400 group-hover:text-emerald-500 transition-colors">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Safaricom</span>
                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                        </div>

                        <style>{`
                            @keyframes pulse-slow {
                                0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 122, 56, 0.4); }
                                50% { transform: scale(1.05); box-shadow: 0 0 40px 10px rgba(229, 122, 56, 0.2); }
                            }
                            .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                        `}</style>
                    </div>
                </div>
            </div>
        </section>
    );
}
