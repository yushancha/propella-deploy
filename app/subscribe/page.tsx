"use client";
import React from 'react';

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Choose Your Plan
          </h1>
          <p className="mt-3 text-text-secondary">
            Upgrade to unlock faster generation, premium styles, and commercial use.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Free Plan */}
          <div className="relative rounded-2xl border border-border-primary bg-surface-secondary p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Free</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-text-primary">$0</span>
                <span className="text-text-secondary">/ month</span>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-text-tertiary" />
                <span>50 daily credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-text-tertiary" />
                <span>3 credits per generation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-text-tertiary" />
                <span>Standard generation speed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-text-tertiary" />
                <span>Includes watermark on creations</span>
              </li>
            </ul>
            <button
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-xl border border-border-primary bg-surface-tertiary px-4 py-3 text-sm font-semibold text-text-tertiary"
            >
              Your Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border border-primary-500/40 bg-surface-secondary p-6 sm:p-8 shadow-lg ring-1 ring-primary-500/10">
            {/* Badge */}
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white shadow">
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary">Pro</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-text-primary">$2.99</span>
                <span className="text-text-secondary">/ month</span>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary-400" />
                <span>5,000 monthly credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary-400" />
                <span>Priority generation queue</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary-400" />
                <span>No watermarks on your creations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary-400" />
                <span>Access to higher resolution outputs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary-400" />
                <span>Unlock all premium art styles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary-400" />
                <span>Commercial license for your assets</span>
              </li>
            </ul>

            <button
              onClick={() => console.log('Upgrade clicked')}
              className="mt-8 w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-glow transition-all duration-200"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* FAQ or note */}
        <p className="mt-10 text-center text-xs text-text-tertiary">
          No credit card required to start. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

