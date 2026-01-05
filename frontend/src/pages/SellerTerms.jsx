import React from "react";
import NavBar from "../components/navBar.jsx";
import Footer from "../components/footer.jsx";

const SellerTerms = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main class="flex-grow">
        <div className="px-6 lg:px-20 py-14">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold">Seller Terms & Conditions</h1>
          </div>
          <div className="max-w-2xl">
            <div className="text-2xl font-medium pt-3">
              Last Updated: 14/11/2025
            </div>
          </div>
          <div className="py-6 text-black">
            <p>
              These Seller Terms & Conditions apply to all individuals and
              organizations “Publisher” or “Self-Publisher” who list, upload, or
              sell books on the Read Verse. By registering as a Seller, you
              agree to comply with these Terms. If you do not agree, you must
              not use Read Verse’s seller services.
            </p>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                1. Roles and Definitions
              </h3>
            </div>
            <div className="py-6 text-black">
              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>
                    <b>Publisher:</b> A company or legally recognized entity
                    that uploads and sells books on behalf of authors or
                    copyright owners.
                  </li>
                  <li>
                    <b>Self-Publisher:</b> An individual author or rights-holder
                    who independently uploads and sells their own books.
                  </li>
                  <li>
                    <b>Content:</b> All materials uploaded to Read Verse,
                    including manuscripts, eBooks, descriptions, covers, and
                    metadata.
                  </li>
                  <li>
                    <b>Customer:</b> Any user who purchases content from Read
                    Verse.
                  </li>
                  <li>
                    <b>Seller Account:</b> A dedicated Read Verse account used
                    for uploading, managing, and selling content.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                2. Eligibility to Become a Seller
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>To sell on Read Verse, you must:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>Be at least 18 years old;</li>
                  <li>Be legally able to enter a binding agreement;</li>
                  <li>
                    Provide accurate registration, identity, and payment
                    information;
                  </li>
                  <li>
                    Own or have the legal rights to sell all content you upload.
                  </li>
                </ul>
              </div>
              <p>
                Read Verse may deny or suspend seller accounts that fail to meet
                eligibility requirements.
              </p>
            </div>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                3. Content Ownership and Licensing
              </h3>
            </div>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                3.1 Ownership
              </div>
            </div>
            <p classname="py-5 text-black">
              Sellers retain full copyright and ownership of their content.
            </p>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                3.2 License Granted to Read Verse
              </div>
            </div>
            <p classname="py-5 text-black">
              By uploading content, you grant Read Verse a non-exclusive,
              worldwide, royalty-free license to:
            </p>
            <div className=" pl-7 text-black">
              <ul className="list-disc">
                <li>Host, store, reproduce, and display your content;</li>
                <li>Distribute and deliver your content to customers;</li>
                <li>
                  Use your content for marketing and promotional activities
                  (non-exclusive).
                </li>
              </ul>
              <p classname="py-5 text-black">
                This license remains valid as long as your content remains
                active on the platform.
              </p>
            </div>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                3.3 Accuracy of Content
              </div>
            </div>
            <p classname="py-5 text-black">Sellers are responsible for:</p>

            <div className=" pl-7 text-black">
              <ul className="list-disc">
                <li>Correct metadata, pricing, and categorization;</li>
                <li>
                  Ensuring that content is free of viruses or harmful materials;
                </li>
                <li>
                  Ensuring that content is not plagiarized, illegal, defamatory,
                  or harmful.
                </li>
              </ul>
            </div>
            <p classname="py-5 text-black">
              Read Verse reserves the right to remove content that violates laws
              or these Terms.
            </p>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold text-black">
                4. Pricing, Revenue, and Payments
              </h3>
            </div>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                4.1 Pricing Control
              </div>
            </div>
            <p classname="py-5 text-black">
              Sellers may set their own prices unless restricted by promotional
              agreements or Read Verse guidelines.
            </p>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                4.2 Revenue Share
              </div>
            </div>
            <p classname="py-5 text-black">
              Revenue from sales will be shared according to the commission
              rates displayed in the Seller Dashboard or your agreement with
              Read Verse.
            </p>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                4.3 Payment Schedule
              </div>
            </div>
            <div className=" pl-7 text-black">
              <ul className="list-disc">
                <li>
                  Payments are issued on a monthly basis or according to your
                  Seller Dashboard details.
                </li>
                <li>Sellers must provide accurate payment details.</li>
                <li>
                  Read Verse may withhold earnings in cases of disputes, fraud,
                  or chargebacks.
                </li>
              </ul>
            </div>
            <div className="max-w-2xl py-4">
              <div className="text-2xl font-medium pt-3 text-black">
                4.4 Taxes
              </div>
            </div>
            <p classname="py-5 text-black">
              Sellers are responsible for reporting and paying all applicable
              taxes on income earned through Read Verse.
            </p>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                5. Customer Interactions
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>Sellers agree that:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>All digital book sales are generally final.</li>
                  <li>
                    Refunds may be issued in cases of technical issues,
                    duplicate purchases, or legal requirements.
                  </li>
                  <li>
                    Sellers may not directly solicit customers outside Read
                    Verse for off-platform sales.
                  </li>
                </ul>
              </div>
              <p>
                Read Verse handles all customer service related to transactions
                unless otherwise specified.
              </p>
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
              <h3 className="text-3xl font-semibold">7. Platform Rights</h3>
            </div>
            <div className="py-6 text-black">
              <p>Read Verse may:</p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>
                    Remove or disable any content that violates laws or
                    policies;
                  </li>
                  <li>Modify platform features and services at any time;</li>
                  <li>
                    Run promotions or discounts (with or without seller
                    participation, depending on settings);
                  </li>
                  <li>Limit access to certain tools or features.</li>
                </ul>
              </div>
              <p>
                Read Verse does not guarantee any minimum sales, visibility, or
                promotional placement.
              </p>
            </div>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                8. Termination and Removal
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                Sellers may deactivate their account or remove content at any
                time. However:
              </p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>
                    Read Verse may retain copies required for legal, audit, or
                    customer-service purposes.
                  </li>
                  <li>
                    Sales already completed remain valid and cannot be reversed.
                  </li>
                  <li>
                    Outstanding payments will be settled according to the payout
                    schedule.
                  </li>
                </ul>
              </div>
              <p>
                Read Verse may suspend or terminate accounts for violating these
                Terms or applicable laws.
              </p>
            </div>
          </div>

          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                9. Limitation of Liability
              </h3>
            </div>
            <div className="py-6 text-black">
              <p>To the extent permitted by law: </p>

              <div className=" pl-7 text-black">
                <ul className="list-disc">
                  <li>
                    Read Verse is not responsible for loss of profits, data, or
                    reputation.
                  </li>
                  <li>
                    Read Verse does not guarantee uninterrupted access to the
                    platform.
                  </li>
                  <li>
                    The maximum liability of Read Verse to any Seller will not
                    exceed the amount earned by that Seller in the previous 6
                    months.
                  </li>
                </ul>
              </div>
              <p>Use of the platform is at the Seller’s own risk.</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">10. Privacy </h3>
            </div>
            <div className="py-6 text-black">
              <p>
                Seller data is handled according to the Read Verse Privacy
                Policy. By using the platform, you consent to data collection
                and processing as described there.
              </p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                11. Changes to These Terms
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
              <h3 className="text-3xl font-semibold">12. Governing Law</h3>
            </div>
            <div className="py-6 text-black">
              <p>These Terms are governed by the laws of Nepal.</p>
            </div>
          </div>
          <div>
            <div className="max-w-4xl py-2">
              <h3 className="text-3xl font-semibold">
                13. Contact Information
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

export default SellerTerms;
