export default function ContactUs() {
    return (
        <section id="contact" className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-6">
                        Get in Touch
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Have questions about our SMS packages or need a custom solution? Our team is here to help you get started.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Email */}
                    <div className="flex flex-col items-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-500 text-white mb-6 shadow-lg shadow-brand-500/20">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">support@a2psystem.com</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">We respond within 24 hours</p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col items-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-500 text-white mb-6 shadow-lg shadow-brand-500/20">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Call Us</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">+251 911 234 567</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Mon - Fri, 8am - 6pm</p>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-500 text-white mb-6 shadow-lg shadow-brand-500/20">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visit Us</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Addis Ababa, Ethiopia</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Bole Road, Mega Building</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
