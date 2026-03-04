"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
    { img: "https://picsum.photos/seed/aurora/1400/700", label: "Aurora", tag: "Nature" },
    { img: "https://picsum.photos/seed/cityscape/1400/700", label: "Cityscape", tag: "Urban" },
    { img: "https://picsum.photos/seed/ocean22/1400/700", label: "Ocean", tag: "Serenity" },
    { img: "https://picsum.photos/seed/forest9/1400/700", label: "Forest", tag: "Wild" },
];

export default function HeroSection() {

    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    // The useCallback hook in React is used to memoize (cache) a function so that it isn’t recreated on every render.
    // This can help improve performance, especially when passing callbacks to child components that rely on reference 
    // equality to avoid unnecessary re-renders.

    const goTo = useCallback((index: number) => {
        if (animating || index === current) return;

        setAnimating(true);
        setCurrent(index);

        setTimeout(() => setAnimating(false), 600);
    }, [animating, current]);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const back = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <div className="image-card relative!  w-full! overflow-hidden! flex! mb-5">
            <div className="relative w-full h-100">
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute w-full inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <Image
                            src={slide.img}
                            alt={slide.label}
                            fill
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-black/10 " />
                    </div>
                ))}


                <div className="absolute bottom-10 left-10 pointer-events-none">
                    <span
                        key={`tag`}
                        className="fade-up block text-white/60 uppercase text-xs font-bold tracking-widest mb-1"
                    >
                        {slides[current].tag}
                    </span>
                    <h2
                        key={`h2`}
                        className="fade-up text-white font-bold text-5xl leading-tight"
                    >
                        {slides[current].label}
                    </h2>
                </div>


                <div className="absolute top-5 right-6 text-white/60 text-xs font-bold tracking-widest">
                    0{(current + 1)} / 0{slides.length}
                </div>


                <button title="back" onClick={back} className="  size-9! btn-circle absolute left-5 top-1/2 -translate-y-1/2 bg-white">
                    <ArrowLeft />
                </button>
                <button title="next" onClick={next} className=" size-9! btn-circle absolute right-5 top-1/2 -translate-y-1/2 bg-white">
                    <ArrowRight />
                </button>
            </div>



            <div className=" absolute z-10 bottom-5 flex items-center gap-2">
                {slides.map((_, i) => (
                    <button
                        title="goto"
                        key={i}
                        onClick={() => goTo(i)}
                        className={
                            `h-2 rounded-full border-2 border-white transition-all 
                            duration-300 
                            ${i === current ? "w-8 bg-(--orange) border-(--orange)" : "w-2 bg-transparent"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}