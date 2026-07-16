"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import type { HeroImage } from "@/lib/types";

const INTERVAL_MS = 6000;

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function HeroSlider({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex((i + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (paused || reducedMotion || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((image, i) => (
        <Image
          key={image.url}
          src={image.url}
          alt={image.alt}
          fill
          priority={i === 0}
          loading={i === 0 ? undefined : "eager"}
          fetchPriority={i === 0 ? "high" : undefined}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-6">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Bild ${i + 1} von ${images.length} anzeigen`}
              aria-current={i === index}
              className="group flex size-11 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-standard ${
                  i === index ? "w-6 bg-primary-foreground" : "w-2 bg-primary-foreground/50 group-hover:bg-primary-foreground/75"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
