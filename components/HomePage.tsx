import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Create Amazing Game Items with AI
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Generate unique game assets in seconds with our advanced AI technology. Perfect for game developers, designers, and creative enthusiasts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/generate" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-colors">
                Start Creating
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 px-6 py-3 rounded-lg transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            {/* Sample images */}
            <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
              <img src="/samples/pixel-sword.png" alt="Pixel art sword" className="w-full" />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform mt-8">
              <img src="/samples/cyberpunk-gun.png" alt="Cyberpunk gun" className="w-full" />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
              <img src="/samples/fantasy-potion.png" alt="Fantasy potion" className="w-full" />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform mt-8">
              <img src="/samples/scifi-helmet.png" alt="Sci-fi helmet" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose PropGen.AI?</h2>
            <p className="mt-4 text-xl text-gray-600">Powerful features designed for game developers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate high-quality game assets in seconds, not hours.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Styles</h3>
              <p className="text-gray-600">Choose from pixel art, cyberpunk, fantasy, sci-fi and more.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Organize</h3>
              <p className="text-gray-600">Keep track of your creations with our history feature.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-2">
            <div className="flex justify-end">
              <button onClick={() => setShowDemo(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/your-demo-video-id" 
                title="PropGen.AI Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}