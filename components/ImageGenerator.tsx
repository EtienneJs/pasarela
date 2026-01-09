
import React, { useState } from 'react';
import { generateProductScene } from '../services/geminiService';

const VEHICLES = [
  {
    id: 'car-1',
    name: 'Eclipse Cross',
    driveId: '1UKA3RauKFpZE3xYGiv3__AkEC9KYJd8S',
    thumb: 'https://lh3.googleusercontent.com/d/1UKA3RauKFpZE3xYGiv3__AkEC9KYJd8S'
  },
  {
    id: 'car-2',
    name: 'Outlander',
    driveId: '1tF-LU9FZsMQeeoNhVnS-bAwyPPVsha6v',
    thumb: 'https://lh3.googleusercontent.com/d/1tF-LU9FZsMQeeoNhVnS-bAwyPPVsha6v'
  },
  {
    id: 'car-3',
    name: 'Pajero Sport',
    driveId: '1uNCfBsEt-p-bm0reRub-SReV2boOy1_K',
    thumb: 'https://lh3.googleusercontent.com/d/1uNCfBsEt-p-bm0reRub-SReV2boOy1_K'
  }
];

export const ImageGenerator: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState(VEHICLES[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const base64 = await getBase64FromUrl(selectedCar.thumb);
      const result = await generateProductScene(prompt, base64);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("No se pudo generar la imagen. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con Gemini Image AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="mt-20 px-4 md:px-0">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="p-2 bg-blue-500/20 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            AI Scene Studio
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md">
            <div>
              <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">
                1. Selecciona tu Vehículo
              </label>
              <div className="grid grid-cols-3 gap-4">
                {VEHICLES.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                      selectedCar.id === car.id 
                        ? 'border-blue-500 ring-4 ring-blue-500/20 scale-95' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={car.thumb} alt={car.name} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/80 to-transparent transition-opacity ${selectedCar.id === car.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="text-[10px] font-bold text-white uppercase truncate">{car.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider">
                2. Describe el Escenario
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: 'Estacionado en un bosque nevado bajo la aurora boreal' o 'Cruzando un puente futurista al atardecer'..."
                className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 hover:shadow-blue-500/20 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generando Escena...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span>Crear Arte con IA</span>
                </>
              )}
            </button>
            
            {error && (
              <p className="text-red-400 text-xs text-center font-medium animate-pulse">{error}</p>
            )}
          </div>

          {/* Results Panel */}
          <div className="relative aspect-video lg:aspect-auto min-h-[400px] bg-slate-950/50 rounded-3xl border border-white/10 overflow-hidden group">
            {!generatedImage && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Previsualización de IA</h3>
                <p className="max-w-xs text-sm">Tu obra maestra aparecerá aquí una vez que la IA termine de procesar el escenario.</p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute top-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 text-blue-400 font-bold tracking-widest uppercase text-xs animate-pulse">Scanning Geometry...</p>
                <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-[loading_2s_infinite]"></div>
                </div>
              </div>
            )}

            {generatedImage && (
              <div className="relative h-full w-full animate-in fade-in zoom-in-110 duration-1000">
                <img 
                  src={generatedImage} 
                  alt="AI Generated Scene" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Gemini AI Engine</span>
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">8K Render</span>
                </div>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `mitsubishi-ai-scene-${Date.now()}.png`;
                    link.click();
                  }}
                  className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
                  title="Descargar Arte"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};
