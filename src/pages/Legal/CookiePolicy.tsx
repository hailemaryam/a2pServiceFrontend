import LegalLayout from "../../layout/LegalLayout";

export default function CookiePolicy() {
    return (
        <LegalLayout title="Cookie Policy">
            <section className="mb-8">
                <p>Last Updated: February 12, 2026</p>
                <p>
                    This Cookie Policy explains how Fast SMS uses cookies and similar
                    technologies to recognize you when you visit our A2P SMS platform.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">1. What are Cookies?</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                    Cookies are small data files that are placed on your computer or mobile
                    device when you visit a website. Cookies are widely used by website
                    owners to make their websites work, or to work more efficiently, as
                    well as to provide reporting information.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">2. Why We Use Cookies</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                    We use first-party and third-party cookies for several reasons. Some
                    cookies are required for technical reasons in order for our platform to
                    operate, and we refer to these as "essential" or "strictly necessary"
                    cookies.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-400">
                    <li>
                        <strong>Essential Cookies:</strong> Necessary for the platform to
                        function correctly (e.g., authentication).
                    </li>
                    <li>
                        <strong>Preference Cookies:</strong> Used to remember your settings
                        (e.g., dark mode vs light mode).
                    </li>
                    <li>
                        <strong>Analytics Cookies:</strong> Help us understand how visitors
                        interact with our platform by collecting and reporting information
                        anonymously.
                    </li>
                </ul>
            </section>

            <section className="mb-12 font-sans">
                <h2 className="text-2xl font-bold mb-4">4. How to Manage Cookies</h2>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                    You can set or amend your web browser controls to accept or refuse
                    cookies. If you choose to reject cookies, you may still use our
                    platform, though your access to some functionality and areas may be
                    restricted.
                </p>
            </section>
        </LegalLayout>
    );
}
