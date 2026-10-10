/**
 * TermsOfService Page
 *
 * Required for iOS App Store compliance.
 * Must be accessible before signup and linked in App Store listing.
 */

import React from 'react'
import { Link } from 'react-router-dom'

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Mosaic
          </Link>
          <h1 className="text-3xl font-bold text-foreground mt-4">Terms of Service</h1>
          <p className="text-foreground/60 mt-2">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none space-y-8 text-foreground/80">

          {/* Acceptance */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Acceptance of Terms</h2>
            <p>
              By creating an account or using Mosaic ("the Service"), you agree to these
              Terms of Service. If you do not agree, please do not use the Service.
              We may update these terms from time to time; continued use of the Service
              after changes take effect constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Accounts */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Accounts</h2>
            <p>To use Mosaic you must:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Provide a valid email address and accurate account information</li>
              <li>Keep your password confidential and secure</li>
              <li>Be at least 13 years of age</li>
              <li>Notify us of any unauthorized use of your account</li>
            </ul>
            <p className="mt-4">
              You are responsible for all activity that occurs under your account.
              You may delete your account at any time from within the app
              (Settings → Delete Account).
            </p>
          </section>

          {/* Content you create */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Content You Create</h2>
            <p>
              You retain ownership of the routines, workout data, and other content
              you create in Mosaic ("Your Content"). By using the Service you grant us
              a limited license to store, sync, and display Your Content solely for
              the purpose of providing the Service to you.
            </p>
            <p className="mt-4">
              If you choose to share Your Content with other users, you are responsible
              for ensuring you have the right to share it. We may remove content that
              violates these terms or applicable law.
            </p>
          </section>

          {/* Studio plans */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Studio Plans</h2>
            <p>
              Some Mosaic features require a paid subscription ("Studio plans").
              Subscription pricing, billing intervals, and included features are
              shown at the time of purchase.
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Subscriptions renew automatically unless cancelled before the renewal date</li>
              <li>Refunds are handled per the app store's refund policies</li>
              <li>We may change pricing with reasonable advance notice</li>
            </ul>
          </section>

          {/* Acceptable use */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to access other users' accounts or data</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Scrape, copy, or redistribute exercise content or videos</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Termination</h2>
            <p>
              We may suspend or terminate your access to the Service if you violate
              these terms. You may stop using the Service and delete your account at
              any time. Upon termination, your right to use the Service ends
              immediately and your data will be deleted per our Privacy Policy.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Disclaimers</h2>
            <p>
              The Service is provided "as is" without warranties of any kind.
              Mosaic provides exercise programming tools, not medical advice.
              Consult a qualified healthcare professional before beginning any
              exercise program.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <a
                href="mailto:support@mosaic.app"
                className="text-primary hover:underline"
              >
                support@mosaic.app
              </a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-foreground/50 text-center">
            © {new Date().getFullYear()} Mosaic. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

TermsOfService.displayName = 'TermsOfService'

export default TermsOfService
