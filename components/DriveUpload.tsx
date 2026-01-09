
import React, { useState, useRef } from 'react';
import { analyzeProductImage, simulateDriveUpload } from '../services/geminiService';
import { AnalysisResult, Product } from '../types';

interface DriveUploadProps {
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

export const DriveUpload: React.FC<DriveUploadProps> = ({ onSuccess, onCancel }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage(reader.result as string);
      
      setIsAnalyzing(true);
      try {
        const result = await analyzeProductImage(base64String, file.type);
        setAnalysis(result);
      } catch (error) {
        console.error("Analysis failed", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadToDrive = async () => {
    if (!analysis || !selectedImage) return;
    
    setIsUploading(true);
    try {
      const driveUrl = await simulateDriveUpload({ ...analysis, image: selectedImage });
      
      const newProduct: Product = {
        id: `user-${Date.now()}`,
        name: analysis.name,
        price: analysis.suggestedPrice,
        category: analysis.category,
        description: analysis.description,
        imageUrl: selectedImage,
        driveUrl: driveUrl
      };
      
      onSuccess(newProduct);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New Product
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-8">
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all group"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-medium">Click to upload photo</p>
              <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG (Max 10MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-white text-sm font-medium">Gemini is analyzing...</p>
                  </div>
                )}
              </div>

              {analysis && !isAnalyzing && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-blue-400">{analysis.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">{analysis.category}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{analysis.description}</p>
                  <p className="text-white font-bold text-lg">${analysis.suggestedPrice}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => { setSelectedImage(null); setAnalysis(null); }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
                  disabled={isUploading}
                >
                  Change
                </button>
                <button 
                  onClick={handleUploadToDrive}
                  disabled={!analysis || isUploading}
                  className="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.71 3.502L1.15 15l3.438 6h13.123l3.438-6L14.59 3.502H7.71zM9.03 5.502h4.24l5.378 9.434h-4.24L9.03 5.502zM12 7.185l2.422 4.25H9.578L12 7.185zM4.15 16h4.24L1.71 16h2.44zm11.432 0l2.44 4.266H4.896l2.44-4.266h8.246z" />
                      </svg>
                      Save to Google Drive
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
