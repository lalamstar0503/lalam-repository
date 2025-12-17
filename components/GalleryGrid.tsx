import React, { useState } from 'react';
import { X, Trash2, ZoomIn } from 'lucide-react';

interface Props {
  images: string[];
  onRemove?: (index: number) => void;
  readOnly?: boolean;
}

export const GalleryGrid: React.FC<Props> = ({ images, onRemove, readOnly = false }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-12 text-slate-400">
        <p>갤러리에 등록된 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, idx) => (
          <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img 
              src={img} 
              alt={`Gallery ${idx}`} 
              className="h-full w-full object-cover cursor-zoom-in transition-transform hover:scale-105"
              onClick={() => setSelectedImage(img)}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 pointer-events-none" />

            {/* Actions */}
            {!readOnly && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(idx);
                }}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-sm transition-opacity hover:bg-red-600 group-hover:opacity-100"
                title="이미지 삭제"
              >
                <Trash2 size={14} />
              </button>
            )}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/50 p-1 rounded text-white">
                    <ZoomIn size={14}/>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full size" 
            className="max-h-full max-w-full rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};
