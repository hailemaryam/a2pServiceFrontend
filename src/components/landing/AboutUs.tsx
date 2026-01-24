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
                    <div className="mt-12 lg:mt-0 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-500">
                            <div className="bg-gradient-to-br from-brand-500 to-brand-700 aspect-video flex items-center justify-center">
                                <span className="text-white text-6xl font-black opacity-20">A2P SYSTEM</span>
                            </div>
                        </div>
                        {/* Subtle decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
