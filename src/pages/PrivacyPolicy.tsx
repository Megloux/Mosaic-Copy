/**
 * PrivacyPolicy Page
 * 
 * Required for iOS App Store compliance.
 * Must be accessible before signup and linked in App Store listing.
 */

import React from 'react'
import { Link } from 'react-router-dom'

export const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-foreground mt-4">Privacy Policy</h1>
          <p className="text-foreground/60 mt-2">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none space-y-8 text-foreground/80">
          
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Introduction</h2>
            <p>
              Mosaic ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your 
              information when you use our mobile application.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Email address (required for account creation and recovery)</li>
              <li>Username (optional, for sharing features)</li>
              <li>Password (encrypted, never stored in plain text)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4">Workout Data</h3>
            <p>When you use Mosaic, we store:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Custom routines you create</li>
              <li>Workout history and completion records</li>
              <li>Exercise preferences and favorites</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4">Device Information</h3>
            <p>We may automatically collect:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Device type and operating system</li>
              <li>App version</li>
              <li>Anonymous usage analytics</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Provide and maintain the Mosaic service</li>
              <li>Save and sync your routines across devices</li>
              <li>Enable sharing features between users</li>
              <li>Send important account notifications</li>
              <li>Improve our app based on usage patterns</li>
            </ul>
            <p className="mt-4">
              <strong>We do not sell your personal information to third parties.</strong>
            </p>
          </section>

          {/* Data Storage and Security */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a trusted database platform 
              that provides:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>End-to-end encryption for data in transit</li>
              <li>Encryption at rest for stored data</li>
              <li>Row-level security policies</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <strong>Supabase</strong> - Database and authentication 
                (<a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)
              </li>
              <li>
                <strong>Vimeo</strong> - Exercise video hosting 
                (<a href="https://vimeo.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <strong>Access your data</strong> - View all data associated with your account
              </li>
              <li>
                <strong>Export your data</strong> - Download your routines and workout history
              </li>
              <li>
                <strong>Delete your account</strong> - Permanently remove your account and all 
                associated data from within the app (Settings → Delete Account)
              </li>
              <li>
                <strong>Update your information</strong> - Modify your profile at any time
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete 
              your account, all associated data is permanently removed within 30 days.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Children's Privacy</h2>
            <p>
              Mosaic is not intended for children under 13 years of age. We do not 
              knowingly collect personal information from children under 13.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you 
              of any changes by posting the new policy on this page and updating the 
              "Last updated" date.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <a 
                href="mailto:privacy@mosaic.app" 
                className="text-primary hover:underline"
              >
                privacy@mosaic.app
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

PrivacyPolicy.displayName = 'PrivacyPolicy'

export default PrivacyPolicy
