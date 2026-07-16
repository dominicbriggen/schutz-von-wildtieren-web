"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import type { HeroImage } from "@/lib/types";

const INTERVAL_MS = 6500;

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

  const activeCredit = images[index]?.credit;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
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
          style={{ objectPosition: image.position ?? "center" }}
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Bildnachweis, sehr dezent */}
      {activeCredit && (
        <p className="pointer-events-none absolute bottom-2.5 right-3 z-20 max-w-[60%] truncate text-right text-[10px] font-medium text-white/55">
          {activeCredit}
        </p>
      )}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-1 sm:bottom-5">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Bild ${i + 1} von ${images.length} anzeigen`}
              aria-current={i === index}
              className="group flex h-11 w-8 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-standard ${
                  i === index
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/45 group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
