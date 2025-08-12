"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // 这里将来会添加实际的支付处理逻辑
    console.log(`Selected plan: ${planId}`);
    
    // 模拟订阅流程
    setTimeout(() => {
      alert('This is a demo. In the production version, you would be redirected to a payment processor.');
      router.push('/generate');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Unlock premium features and generate more game assets with our subscription plans
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Free Plan */}
          <div className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-300">Perfect for hobbyists and casual users.</p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">10 generations per day</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">5 art styles</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Basic history</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/generate"
              className="mt-8 block w-full bg-gray-100 dark:bg-gray-700 py-3 px-6 border border-transparent rounded-md text-center font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Current Plan
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
              <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">Popular</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">$9.99</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-300">For indie developers and small teams.</p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Unlimited generations</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">All art styles</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Batch generation (5 at once)</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Advanced history & organization</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('pro')}
              className="mt-8 block w-full bg-blue-600 py-3 px-6 border border-transparent rounded-md text-center font-medium text-white hover:bg-blue-700"
            >
              {selectedPlan === 'pro' ? 'Processing...' : 'Subscribe'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Enterprise</h3>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">$29.99</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-300">For professional game studios.</p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Batch generation (20 at once)</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Asset pack templates</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('enterprise')}
              className="mt-8 block w-full bg-blue-600 py-3 px-6 border border-transparent rounded-md text-center font-medium text-white hover:bg-blue-700"
            >
              {selectedPlan === 'enterprise' ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-300">
            Need a custom solution? <a href="#" className="text-blue-600 hover:text-blue-500">Contact us</a> for enterprise pricing.
          </p>
        </div>
      </div>
    </div>
  );
}