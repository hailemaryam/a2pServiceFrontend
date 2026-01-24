export default function ContactUs() {
    return (
        <section id="contact" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-6">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                            Have questions about our SMS packages or need a custom solution? Our team is here to help you get started.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Us</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">support@a2psystem.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Call Us</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">+251 911 234 567</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visit Us</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">Addis Ababa, Ethiopia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="block w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="block w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">
                                    HOW CAN WE HELP?
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="block w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm"
                                    placeholder="Tell us about your requirements..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                onClick={(e) => e.preventDefault()}
                                className="w-full py-5 bg-brand-500 hover:bg-brand-600 text-white font-black rounded-2xl shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
