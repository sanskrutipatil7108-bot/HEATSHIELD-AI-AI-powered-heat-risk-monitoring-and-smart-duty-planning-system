import React, { useState } from 'react';
import { ImageOff, ShieldAlert } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrcs?: string[];
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
  wrapperClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrcs = [],
  fallbackIcon,
  fallbackText,
  alt = 'HeatShield AI Visual Asset',
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Combine primary src with fallbacks list
  const sources = [src, ...fallbackSrcs].filter(Boolean) as string[];

  const handleError = () => {
    if (currentSourceIndex < sources.length - 1) {
      setCurrentSourceIndex((prev) => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasFailedAll || sources.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 border border-slate-700/50 p-4 text-center rounded-lg ${wrapperClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-2">
          {fallbackIcon || <ShieldAlert className="w-5 h-5" />}
        </div>
        <span className="text-xs font-medium text-slate-300 line-clamp-2 max-w-[200px]">
          {fallbackText || alt}
        </span>
      </div>
    );
  }

  const currentSrc = sources[currentSourceIndex];

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
        loading={props.loading ?? 'lazy'}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-80'
        } ${className}`}
      />
    </div>
  );
};
