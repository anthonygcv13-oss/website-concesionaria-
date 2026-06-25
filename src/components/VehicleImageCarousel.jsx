import React, { useState, useEffect } from 'react';

export default function VehicleImageCarousel({ images, name, tag }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1617813903808-897d18727004?auto=format&fit=crop&q=80&w=800';
  
  // Sort images by display_order if available, otherwise use original order
  const sortedImages = images && images.length > 0 
    ? [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : [];
  
  const imageUrls = sortedImages.length > 0 
    ? sortedImages.map(img => img.url)
    : [fallbackImage];

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const hasMultipleImages = imageUrls.length > 1;

  useEffect(() => {
    if (!hasMultipleImages || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    }, 4000); // Avanzar automáticamente cada 4 segundos

    return () => clearInterval(interval);
  }, [hasMultipleImages, isHovered, imageUrls.length]);

  return (
    <div 
      className="w-full h-full relative group/carousel overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images container */}
      <div className="w-full h-full relative bg-neutral-900">
        {imageUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`${name} - Vista ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          />
        ))}
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-0"></div>
      </div>

      {/* Tag indicator overlay (top-left) */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-primary text-secondary px-4 py-1.5 font-label-md text-[11px] uppercase tracking-widest font-semibold rounded shadow-md">
          {tag}
        </span>
      </div>

      {/* Navigation Arrows */}
      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Imagen anterior"
          >
            <span className="material-symbols-outlined text-[22px] font-bold text-secondary">chevron_left</span>
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Siguiente imagen"
          >
            <span className="material-symbols-outlined text-[22px] font-bold text-secondary">chevron_right</span>
          </button>
        </>
      )}

      {/* Indicators Dots */}
      {hasMultipleImages && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/5">
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleDotClick(e, idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-secondary w-4' : 'bg-white/40 hover:bg-white/70'
              } cursor-pointer`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
