
import React, { useState, useCallback } from 'react';
import { AspectRatio } from './types';
import { generateThumbnail, enhancePrompt } from './services/geminiService';
import { AspectRatioToggle } from './components/AspectRatioToggle';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DownloadIcon, SparklesIcon, MagicIcon } from './components/Icons';

const LANGUAGES = [
  { value: 'No Text', label: 'No Text' },
  { value: 'Vietnamese', label: 'Vietnamese' },
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Indonesian', label: 'Indonesian' },
];

const App: React.FC = () => {
  const [concept, setConcept] = useState<string>('');
  const [textLanguage, setTextLanguage] = useState<string>('Vietnamese');
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEnhancePrompt = useCallback(async () => {
    if (!concept.trim()) {
      setError('Please enter a concept to enhance.');
      return;
    }
    
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await enhancePrompt(concept, textLanguage);
      setPrompt(enhanced);
    } catch (e) {
      console.error(e);
      setError('Failed to create prompt. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  }, [concept, textLanguage]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your thumbnail.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const imageUrls = await generateThumbnail(prompt, aspectRatio);
      setGeneratedImages(imageUrls);
    } catch (e) {
      console.error(e);
      setError('Failed to generate thumbnails. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">AI YouTube Thumbnail Generator</h1>
          <p className="text-brand-gray text-lg">
            Turn your ideas into viral thumbnails in seconds.
          </p>
        </header>

        <main className="w-full">
          <div className="bg-brand-panel p-6 rounded-lg shadow-lg mb-8 space-y-8 relative overflow-hidden">
            {/* Step 1: Concept & Enhancement */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-brand-violet text-xs rounded px-2 py-1 mr-2">STEP 1</span>
                  Describe Your Idea
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-brand-gray">
                    Content / Concept
                  </label>
                  <textarea
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="E.g., A surprised man pointing at a glowing bitcoin chart..."
                    className="w-full h-24 p-3 bg-brand-input text-brand-light border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-transparent transition duration-300 resize-none"
                  />
                </div>
                <div className="flex flex-col justify-between">
                   <div>
                    <label className="block text-sm font-medium mb-2 text-brand-gray">
                      Text Language in Image
                    </label>
                    <select
                      value={textLanguage}
                      onChange={(e) => setTextLanguage(e.target.value)}
                      className="w-full p-3 bg-brand-input text-brand-light border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-transparent transition duration-300"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                   </div>
                   
                   <button
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !concept.trim()}
                    className="mt-4 md:mt-0 w-full bg-brand-green/20 border border-brand-green/50 text-brand-green hover:bg-brand-green hover:text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition duration-300"
                  >
                    {isEnhancing ? (
                      <LoadingSpinner />
                    ) : (
                      <MagicIcon />
                    )}
                    {isEnhancing ? 'Optimizing...' : 'Create Prompt'}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-border/50"></div>

            {/* Step 2: Final Prompt & Generation */}
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-brand-violet text-xs rounded px-2 py-1 mr-2">STEP 2</span>
                  Generate Thumbnail
                </h2>
                
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="The detailed prompt will appear here. You can also edit it manually..."
                className="w-full h-32 p-3 bg-brand-input text-brand-light border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-transparent transition duration-300 resize-none font-mono text-sm"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-sm font-medium mb-2 text-brand-gray">
                    Aspect Ratio
                  </label>
                  <AspectRatioToggle selected={aspectRatio} onChange={setAspectRatio} />
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full bg-brand-violet text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center text-lg hover:bg-brand-violet-dark disabled:bg-opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105 md:mt-7"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      Generate Images
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <div className="bg-brand-panel/50 border-2 border-dashed border-brand-border p-4 rounded-lg flex items-center justify-center min-h-[360px]">
              {isLoading ? (
                <div className="text-center text-brand-gray">
                  <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg">AI is crafting your masterpieces...</p>
                </div>
              ) : generatedImages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {generatedImages.map((imageSrc, index) => (
                    <div key={index} className="flex flex-col items-center gap-3">
                      <img
                        src={imageSrc}
                        alt={`Generated thumbnail ${index + 1}`}
                        className={`rounded-lg shadow-2xl w-full ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'}`}
                      />
                      <a
                        href={imageSrc}
                        download={`youtube_thumbnail_${index + 1}.jpg`}
                        className="w-full bg-brand-green text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center text-base hover:bg-brand-green-dark transition duration-300"
                        aria-label={`Download image ${index + 1}`}
                      >
                        <DownloadIcon />
                        <span className="ml-2">Download</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-brand-gray">
                  <p className="text-xl">Your generated thumbnails will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
