"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';

interface GuideStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const guideSteps: GuideStep[] = [
  {
    target: 'item-name-input',
    title: 'Describe Your Item',
    content: 'Enter a detailed description of the game item you want to create. Be specific for better results!',
    position: 'bottom'
  },
  {
    target: 'style-selector',
    title: 'Choose Art Style',
    content: 'Select from 5 different art styles. Each style creates a unique visual aesthetic.',
    position: 'right'
  },
  {
    target: 'level-selector',
    title: 'Set Rarity Level',
    content: 'Choose the rarity level to influence the complexity and detail of your item.',
    position: 'right'
  },
  {
    target: 'generate-button',
    title: 'Generate Your Item',
    content: 'Click to create your item! Generation typically takes 3-5 seconds.',
    position: 'top'
  }
];

export default function UserGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenGuide');
    if (!seen) {
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishGuide();
    }
  };

  const finishGuide = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenGuide', 'true');
    setHasSeenGuide(true);
  };

  const showGuide = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };

  if (!isVisible && hasSeenGuide) {
    return (
      <button
        onClick={showGuide}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Show Guide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  if (!isVisible) return null;

  const step = guideSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={finishGuide} />
      
      {/* Guide tooltip */}
      <div className="fixed z-50 bg-white rounded-lg shadow-xl p-6 max-w-sm border-2 border-blue-500">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
          <button onClick={finishGuide} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">{step.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={finishGuide}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {currentStep === guideSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}