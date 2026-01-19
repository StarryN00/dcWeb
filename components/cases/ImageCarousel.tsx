'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[16/10] bg-stone-200 rounded-xl flex items-center justify-center">
        <p className="text-stone-500">暂无图片</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 主图片 */}
      <div className="relative w-full aspect-[16/10] bg-stone-900 rounded-xl overflow-hidden group">
        <img
          src={images[currentIndex]}
          alt={`${title} - 图片 ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/1600x1000?text=图片加载失败';
          }}
        />

        {/* 左右切换按钮 */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              aria-label="上一张"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              aria-label="下一张"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 图片计数 */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* 缩略图 */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-4 ring-emerald-600 scale-95'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`缩略图 ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/200x120?text=加载失败';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
