import LegalLayout from "../../layout/LegalLayout";

export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service">
            <section className="mb-8">
                <p>Last Updated: February 12, 2026</p>
                <p>
                    Welcome to Fast SMS. By using our services, you agree to comply with
                    and be bound by the following terms and conditions.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">1. Use of Service</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                    You agree to use our A2P SMS platform only for lawful purposes. You
                    are prohibited from sending spam, harassing messages, or any content
                    that violates local or international laws.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">2. Account Responsibility</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account
                    and password. You agree to accept responsibility for all activities
                    that occur under your account.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">3. Payment Terms</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                    Service fees are based on the selected package or pay-as-you-go rates.
                    All payments are non-refundable unless otherwise stated or required by
                    law.
                </p>
            </section>

            <section className="mb-8 font-sans">
                <h2 className="text-2xl font-bold mb-4">4. Termination</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                    We reserve the right to terminate or suspend your account at our sole
                    discretion, without notice, for conduct that we believe violates these
                    Terms of Service or is harmful to other users or our business.
                </p>
            </section>

            <section className="mb-12 font-sans">
                <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                    Fast SMS shall not be liable for any indirect, incidental, special, or
                    consequential damages resulting from the use or inability to use our
                    services.
                </p>
            </section>
        </LegalLayout>
    );
}
