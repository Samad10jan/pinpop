import Footer from "@/src/components/commons/Footer";
import { Pin, PinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "TRAVEL", span: "row-span-2", pos: "top-4 right-4", src: "/image5.jpeg" },
  { label: "FOOD", span: "", pos: "bottom-4 left-4", src: "/image6.jpeg" },
  { label: "NATURE", span: "row-span-2", pos: "top-4 right-4", src: "/image7.jpeg" },
  { label: "FASHION", span: "", pos: "bottom-4 left-4", src: "/image8.jpeg" },
  { label: "INTERIORS", span: "", pos: "bottom-4 left-4", src: "/image9.jpeg" },
  { label: "ARCHITECTURE", span: "", pos: "bottom-4 left-4", src: "/image10.jpeg" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f0ea] font-sans overflow-x-hidden">

      <header className="sticky top-0 z-50 bg-[#f5f0ea]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          
          <div className="flex items-center gap-2.5">
            <div className=" *:size-7 p-1 *:rotate-45 rounded-full bg-black flex items-center justify-center text-white shrink-0 transition-all duration-500">
              <PinIcon/>
              
            </div>
            <span className="text-xl md:text-5xl font-black tracking-[0.2em] uppercase">
              Fixel
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/signin" className="btn-rect truncate px-2! py-2! sm:px-5! sm:py-2.5! text-xs! sm:text-sm! font-bold! tracking-wide! uppercase!">
              Sign In
            </Link>
            <Link href="/signup" className="btn-rect truncate px-2! py-2! sm:px-5! sm:py-2.5! text-xs! sm:text-sm! font-bold! tracking-wide! uppercase!">
              Join
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tight uppercase">
              Pin.<br />
              <span className="text-[#EA2E00]">Inspire.</span><br />
              Create.
            </h1>

            <div className="flex flex-col xs:flex-row gap-3">
              <Link href="/signup" className="btn-rect text-center truncate items-center! justify-center! px-5! py-3.5! rounded-full! bg-cyan-600! text-white! text-sm! font-bold! uppercase! tracking-wide!">
                Join
              </Link>

              <Link href="/signin" className="btn-rect text-center items-center! justify-center! px-5! py-3.5! rounded-full! bg-white! text-sm! font-bold! uppercase! tracking-wide!">
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-3 gap-3 h-90 sm:h-110 lg:h-130">

            <div className="row-span-2 rounded-2xl border-2 border-black relative overflow-hidden">
              <Image
                src="/image1.jpeg"
                alt="hero"
                fill
                priority
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>

            <div className="rounded-2xl border-2 border-black relative overflow-hidden">
              <Image
                src="/image2.jpeg"
                alt="hero"
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>

            <div className="rounded-2xl border-2 border-black relative overflow-hidden">
              <Image
                src="/image3.jpeg"
                alt="hero"
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>

            <div className="col-span-2 rounded-2xl border-2 border-black relative overflow-hidden">
              <Image
                src="/image4.jpeg"
                alt="hero"
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] p-5">
        <div className="max-w-7xl pt-2 mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mb-10 sm:mb-14">
            <h2 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tight uppercase text-white">
              Discover<br />Anything.
            </h2>
            <div className="hidden sm:block w-px h-30 bg-white/20 shrink-0" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-3 h-80 sm:h-95 lg:h-110">

            {categories.map(({ label, span, pos, src }) => (
              <div
                key={label}
                className={`rounded-2xl relative overflow-hidden cursor-pointer group ${span}`}
              >
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-cover"
              
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                <span
                  className={`absolute ${pos} text-[10px] sm:text-xs text-white font-black tracking-[0.15em] uppercase bg-black/40 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm group-hover:bg-black/60 transition-all z-10`}
                >
                  {label}
                </span>
              </div>
            ))}

          </div>
        </div>
      </section>

      <section className="bg-[#EA2E00] border-t-2 border-b-2 border-black py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex sm:justify-between justify-center text-center md:text-left ">

            <div>
              <h2 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tight uppercase text-white mb-8">
                Your next<br />obsession<br />is here.
              </h2>

              <Link
                href="/signup"
                className="btn-rect inline-flex items-center px-8 py-4 rounded-full! border-2! border-white! bg-white! text-black! text-sm! sm:text-base! font-black! uppercase! tracking-wide!"
              >
                Join Fixel
              </Link>
            </div>

            <div className="hidden md:flex flex-col items-center gap-5">
              <div className="relative overflow-hidden w-72 h-72 rounded-full border-4 border-white group">

                <Image
                  src="/image11.jpeg"
                  alt="cta"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}