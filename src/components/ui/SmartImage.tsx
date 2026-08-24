import { useState } from 'react';
import { cn } from '../../lib/cn';
import { unsplashSrcSet, unsplashUrl } from '../../lib/images';

interface SmartImageProps {
  /** Unsplash photo id (see `lib/images`). */
  id: string;
  alt: string;
  width: number;
  height?: number;
  className?: string;
  /** Wrapper class — controls aspect ratio and rounding. */
  wrapperClassName?: string;
  sizes?: string;
  priority?: boolean;
  faces?: boolean;
}

/**
 * Image with reserved space, a tinted placeholder and a fade-in on decode.
 * Keeps CLS at zero and avoids the grey-flash that makes catalogs feel cheap.
 */
export function SmartImage({
  id,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  sizes,
  priority = false,
  faces = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('bg-ink-100 relative overflow-hidden', wrapperClassName)}>
      <div
        aria-hidden="true"
        className={cn(
          'from-ink-100 via-ink-50 to-brand-50/60 absolute inset-0 bg-gradient-to-br transition-opacity duration-700',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <img
        src={unsplashUrl(id, { width, height, faces })}
        srcSet={unsplashSrcSet(id, width, height, faces)}
        sizes={sizes ?? `${width}px`}
        alt={alt}
        width={width}
        height={height ?? width}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'relative h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out-quint)]',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  );
}
