import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        <div className="px-6 lg:px-20 py-14">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <div className="max-w-2xl">
            <div className="text-2xl font-medium pt-3">
              Last Updated: 14/11/2025
            </div>
          </div>
          <div className="py-6 text-black">
            <p>
              Your privacy matters to us. This Privacy Policy explains how{" "}
              <b>Read Verse</b> collects, uses, stores, and protects your
              information. By using Read Verse, you agree to the practices
              described in this Policy.
            </p>
          </div>
          <div className="max-w-4xl py-2">
            <h3 className="text-3xl font-semibold text-black">
              1. Information We Collect
            </h3>
          </div>
          <div className="max-w-2xl py-2">
            <div className="text-2xl font-medium pt-3 text-black">
              1.1 Information You Provide
            </div>
          </div>
          <div className="py-6 pl-7 text-black">
            <ul className="list-disc">
              <li>Name</li>
              <li>Email address</li>
              <li>Password</li>
              <li>
                Payment information (processed securely by third-party
                processors)
              </li>
              <li>Author/Seller profile details</li>
              <li>Uploaded content (for Publishers/Self-Publishers)</li>
            </ul>
          </div>
          <div className="max-w-2xl py-2">
            <div className="text-2xl font-medium pt-3 text-black">
              1.2 Automatically Collected Data
            </div>
          </div>
          <div className="py-6 pl-7 text-black">
            <ul className="list-disc">
              <li>Device information</li>
              <li>Browser type</li>
              <li>IP address</li>
              <li>Usage and activity logs</li>
              <li>Cookies and tracking data</li>
            </ul>
          </div>
          <div className="max-w-2xl py-2">
            <div className="text-2xl font-medium pt-3 text-black">
              1.3 Transaction Data
            </div>
          </div>
          <div className="py-6 pl-7 text-black">
            <ul className="list-disc">
              <li>Purchase history</li>
              <li>Payout records (for Sellers)</li>
              <li>Refunds or support requests</li>
            </ul>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                2. How We Use Your Information
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>Read Verse uses your information to:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Provide access to the platform</li>
                  <li>Process purchases and payments</li>
                  <li>Deliver seller payouts</li>
                  <li>Improve platform performance and features</li>
                  <li>Respond to customer support requests</li>
                  <li>Prevent fraud and maintain security</li>
                  <li>Send important updates or service messages</li>
                </ul>
              </div>
              <p>*We do not sell your personal information.</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                3. How We Share Information
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>We may share your data with:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Payment processors (for purchases and payouts)</li>
                  <li>Analytics providers (to improve the platform)</li>
                  <li>Cloud hosting services</li>
                  <li>Law enforcement when required by law</li>
                </ul>
              </div>
              <p>*We do not share personal data with advertisers.</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">4. Cookies & Tracking</h3>
            </div>
            <div className="py-6 text-black">
              <p>We use cookies to:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Analyze site usage</li>
                  <li>Remember login sessions</li>
                  <li>Improve recommendations</li>
                  <li>Provide a consistent user experience</li>
                </ul>
              </div>
              <p>
                You may disable cookies in your browser, but some features may
                not work properly.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                5. Data Storage & Security
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                We use industry-standard security measures to protect your
                information. However, no online service is 100% secure, and we
                cannot guarantee absolute protection against breaches.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">6. Your Rights</h3>
            </div>
            <div className="py-6 text-black">
              <p>
                Depending on your location (GDPR, CCPA, etc.), you may have
                rights such as:
              </p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Accessing your data</li>
                  <li>Correcting your data</li>
                  <li>Requesting deletion</li>
                  <li>Opting out of marketing emails</li>
                  <li>Downloading your data</li>
                </ul>
              </div>
              <p>To make a request, contact privacy@readverse.com</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">7. Children’s Privacy</h3>
            </div>
            <div className="py-6 text-black">
              <p>
                Read Verse is not intended for children under 13 (or under the
                minimum legal age in your region). We do not knowingly collect
                their information.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">8. Data Retention</h3>
            </div>
            <div className="py-6 text-black">
              <p>We retain your data:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>For as long as you have an active account</li>
                  <li>
                    For legal or financial recordkeeping after account closure
                  </li>
                  <li>As required by tax or regulatory authorities</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                9. Third-Party Services
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                Read Verse may contain links to third-party websites or tools.
                We are not responsible for their content or privacy practices.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                10. Changes to These Terms
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                We may update this Privacy Policy periodically. The “Last
                Updated” date indicates the effective version. Continued use of
                Read Verse means you accept the updated Policy.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                11. Contact Information
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                For questions, comments, or support: <br />
                Email: support@readverse.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
