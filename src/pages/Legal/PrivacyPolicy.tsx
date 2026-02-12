import LegalLayout from "../../layout/LegalLayout";

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy">
            <section className="mb-8">
                <p>Last Updated: February 12, 2026</p>
                <p>
                    At Fast SMS, we take your privacy seriously. This Privacy Policy
                    explains how we collect, use, disclose, and safeguard your information
                    when you use our A2P SMS platform.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400">
                    We collect information that you provide directly to us when you
                    register for an account, such as:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-400">
                    <li>Name and contact information</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Company/Business details</li>
                    <li>Payment information</li>
                </ul>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400">
                    We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-400">
                    <li>Provide and maintain our SMS services</li>
                    <li>Process your transactions</li>
                    <li>Send administrative information and service updates</li>
                    <li>Respond to your inquiries and offer support</li>
                    <li>Comply with legal and regulatory requirements</li>
                </ul>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                    We implement a variety of security measures to maintain the safety of
                    your personal information. Your data is stored behind secured networks
                    and is only accessible by a limited number of persons who have special
                    access rights to such systems.
                </p>
            </section>

            <section className="mb-12 font-sans">
                <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us
                    through our contact form on the landing page.
                </p>
            </section>
        </LegalLayout>
    );
}
