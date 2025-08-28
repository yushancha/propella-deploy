"use client";
import { useState } from 'react';
import { t } from '../../lib/i18n';

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    // TODO: Implement payment logic
    console.log('Upgrading to Pro plan...');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Payment integration coming soon! This is a demo.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Header Section */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Unlock the full potential of AI-powered game asset generation. 
            Start free and upgrade when you&apos;re ready for more.
          </p>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Free Plan Card */}
            <div className="relative">
              <div className="bg-surface-primary border-2 border-border-primary rounded-3xl p-8 h-full">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Free</h3>
                  <div className="text-4xl font-bold text-text-primary mb-1">$0</div>
                  <div className="text-text-tertiary">per month</div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary">50 daily credits</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary">3 credits per generation</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary">Standard generation speed</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-warning-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary">Includes watermark on creations</span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  className="w-full py-4 px-6 bg-surface-secondary border-2 border-border-primary text-text-secondary rounded-xl font-semibold cursor-not-allowed opacity-60"
                  disabled
                >
                  Your Current Plan
                </button>
              </div>
            </div>

            {/* Pro Plan Card - Highlighted */}
            <div className="relative">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg">
                  Most Popular
                </div>
              </div>

              <div className="bg-surface-primary border-2 border-primary-500 rounded-3xl p-8 h-full shadow-xl shadow-primary-500/20 relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none"></div>
                
                {/* Plan Header */}
                <div className="text-center mb-8 relative z-10">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-primary-500 mb-1">$2.99</div>
                  <div className="text-text-tertiary">per month</div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary font-medium">5,000 monthly credits</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary font-medium">Priority generation queue</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary font-medium">No watermarks on your creations</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary font-medium">Access to higher resolution outputs</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary font-medium">Unlock all premium art styles</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-secondary font-medium">Commercial license for your assets</span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative z-10"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Upgrade to Pro'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-2xl font-semibold text-text-primary">
                Why Choose Pro?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Unlimited Creativity</h4>
                  <p className="text-text-secondary text-sm">Generate thousands of assets without worrying about credits</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Commercial Use</h4>
                  <p className="text-text-secondary text-sm">Use your generated assets in commercial projects</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Premium Quality</h4>
                  <p className="text-text-secondary text-sm">Access higher resolutions and premium art styles</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-text-primary text-center mb-8">
                Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                <div className="bg-surface-secondary border border-border-primary rounded-xl p-6">
                  <h4 className="font-semibold text-text-primary mb-2">Can I cancel my subscription anytime?</h4>
                  <p className="text-text-secondary">Yes, you can cancel your Pro subscription at any time. You&apos;ll continue to have access to Pro features until the end of your current billing period.</p>
                </div>
                
                <div className="bg-surface-secondary border border-border-primary rounded-xl p-6">
                  <h4 className="font-semibold text-text-primary mb-2">What happens to my credits if I downgrade?</h4>
                  <p className="text-text-secondary">If you downgrade to the Free plan, any unused Pro credits will be converted to the equivalent Free plan credits at the end of your billing period.</p>
                </div>
                
                <div className="bg-surface-secondary border border-border-primary rounded-xl p-6">
                  <h4 className="font-semibold text-text-primary mb-2">Do you offer refunds?</h4>
                  <p className="text-text-secondary">We offer a 30-day money-back guarantee. If you&apos;re not satisfied with Pro features, contact our support team for a full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

