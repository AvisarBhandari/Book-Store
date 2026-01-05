import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";
export const TermsofService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        <div className="px-6 lg:px-20 py-14">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <div className="max-w-2xl">
            <div className="text-2xl font-medium pt-3">
              Last Updated: 14/11/2025
            </div>
          </div>
          <div className="py-6 text-black">
            <p>
              Welcome to Read Verse.
              <br />
              By using Read Verse, you “Publisher”, “Self-Publisher”, “Customer”
              agree to be bound by these Terms of Service . If you do not agree,
              you must stop using the Platform.
            </p>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                1. About Read Verse
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                Read Verse is an online bookstore and digital publishing
                platform where users can purchase, upload, sell, and read eBooks
                and related digital content
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                2. Eligibility
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>You must be:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>
                    At least 18 years old, or legally able to enter a binding
                    agreement.
                  </li>
                  <li>
                    Using accurate personal information when creating an
                    account.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                4. Content on Read Verse
              </h3>
            </div>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                4.1 User-Generated Content (For Sellers)
              </div>
            </div>
            <p classname="py-5 text-black">
              Publishers and Self-Publishers retain ownership of their content
              but grant Read Verse a non-exclusive, worldwide license to host,
              display, distribute, and promote their content.
            </p>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                4.2 Platform Content
              </div>
            </div>
            <p classname="py-5 text-black">
              All logos, design elements, and system features belong to Read
              Verse and may not be copied or reused without permission.
            </p>
          </div>
          <div>
            <div className="max-w-4xl pt-5">
              <h3 className="text-3xl font-semibold">
                5. Purchases & Payments
              </h3>
            </div>
            <div className="py-6 text-black">
              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>All sales of digital content are generally final.</li>
                  <li>
                    Refunds may be issued only for technical issues, duplicate
                    purchases, or as required by law.
                  </li>
                  <li>
                    Unauthorized redistribution of purchased content is strictly
                    prohibited.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                6. Prohibited Activities
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>You may NOT:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Upload content they do not own the rights to;</li>
                  <li>Use misleading metadata or descriptions;</li>
                  <li>Upload illegal, harmful, or plagiarized material;</li>
                  <li>Manipulate reviews, ratings, or sales numbers;</li>
                  <li>
                    Attempt to bypass Read Verse?s systems or distribute pirated
                    versions;
                  </li>
                  <li>Engage in spam, fraud, or abusive behavior;</li>
                  <li>Interfere with the platform?s operations or security.</li>
                </ul>
              </div>
              <p>
                Violations may result in content removal, payment withholding,
                or permanent account termination.
              </p>
            </div>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">7. Seller Terms</h3>
            </div>
            <div className="py-6 text-black">
              <p>
                If you upload or sell content on Read Verse, you must follow the
                Read Verse Seller Terms & Conditions, which govern:
              </p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Revenue share</li>
                  <li>Pricing</li>
                  <li>Content responsibilities</li>
                  <li>Prohibited activities</li>
                </ul>
              </div>
              <p>Sellers must only upload content they legally own.</p>
            </div>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                8. Platform Availability
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                We strive to keep Read Verse online, but we do not guarantee:
              </p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Uninterrupted access</li>
                  <li>Error-free service</li>
                  <li>Permanent storage of your data</li>
                </ul>
              </div>
              <p>Read Verse may modify or discontinue services at any time.</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                9. Limitation of Liability{" "}
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>To the maximum extent allowed by law: </p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>
                    Read Verse is not liable for lost profits, data, or damages.
                  </li>
                  <li>Your use of the Platform is at your own risk.</li>
                </ul>
              </div>
              <p>
                Our total liability will not exceed the total amounts paid by
                you in the previous 6 months.
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
                We may update these Terms from time to time. The “Last Updated”
                date indicates when changes were made. Continued use of Read
                Verse means you accept the revised Terms.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">11. Governing Law</h3>
            </div>
            <div className="py-6 text-black">
              <p>These Terms are governed by the laws of Nepal.</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                12. Contact Information{" "}
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                For questions, comments, or support:
                <br />
                Email: support@readverse.
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
export default TermsofService;
