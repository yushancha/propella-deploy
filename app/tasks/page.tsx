"use client";
import { PageLoadAnimation } from '@/components/AnimatedElements';

export default function TasksPage() {
  return (
    <PageLoadAnimation>
      <div className="min-h-screen bg-surface-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center py-20">
            <div className="max-w-lg mx-auto space-y-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl flex items-center justify-center border border-border-primary">
                <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
                <p className="text-text-secondary text-lg leading-relaxed">
                  View your generation queue and task history.
                </p>
              </div>
              
              <div className="text-sm text-text-tertiary">
                Coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLoadAnimation>
  );
}
