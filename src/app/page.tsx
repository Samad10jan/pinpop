import Footer from "@/src/components/commons/Footer";
import { ArrowRight, Pin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const categories = [
  { label: "TRAVEL", bg: "bg-[#EA2E00]", span: "row-span-2", pos: "top-4 right-4", src: "https://images.pexels.com/photos/2752037/pexels-photo-2752037.jpeg" },
  { label: "FOOD", bg: "bg-[#EA2E00]", span: "", pos: "bottom-4 left-4", src: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg" },

  { label: "NATURE", bg: "bg-[#EA2E00]", span: "row-span-2", pos: "top-4 right-4", src: "https://images.pexels.com/photos/13524961/pexels-photo-13524961.jpeg" },
  { label: "FASHION", bg: "bg-teal-600", span: "", pos: "bottom-4 left-4", src: "https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg" },
  { label: "INTERIORS", bg: "bg-[#c9b8a0]", span: "", pos: "bottom-4 left-4", src: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg" },

  { label: "ARCHITECTURE", bg: "bg-[#1a1a1a]", span: "", pos: "bottom-4 left-4", src: "https://images.pexels.com/photos/1029615/pexels-photo-1029615.jpeg" },
];

export default function Auth() {
  return (
    <main className="min-h-screen bg-[#f5f0ea] font-sans overflow-x-hidden">

      <header className="sticky top-0 z-50 bg-[#f5f0ea]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black flex items-center justify-center text-white shrink-0">
              <Pin size={16} />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-[0.2em] uppercase">Fixel</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/signin" className=" btn-rect  px-2! py-2! sm:px-5! sm:py-2.5! text-xs! sm:text-sm! font-bold! tracking-wide! uppercase!">Sign In</Link>
            <Link href="/signup" className=" btn-rect  px-2! py-2! sm:px-5! sm:py-2.5! text-xs! sm:text-sm! font-bold! tracking-wide! uppercase!">Join</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-7xl font-black leading-[0.9] tracking-tight uppercase">
              Pin.<br /><span className="text-[#EA2E00]">Inspire.</span><br />Create.
            </h1>
            <div className="flex flex-col xs:flex-row gap-3">
              <Link href="/signup" className=" btn-rect inline-flex! items-center! justify-center! px-7! py-3.5! rounded-full! bg-cyan-600! text-white! text-sm! font-bold! uppercase! tracking-wide!">Get Started</Link>
              <Link href="/signin" className=" btn-rect inline-flex! items-center! justify-center! px-7! py-3.5! rounded-full! bg-white! text-sm! font-bold! uppercase! tracking-wide!">Sign In</Link>
            </div>

          </div>

          <div className="grid grid-cols-2 grid-rows-3 gap-3 h-90 sm:h-110 lg:h-130">
            <div className="row-span-2 rounded-2xl border-2 border-black bg-linear-to-br from-[#EA2E00] to-[#ff6b35] relative overflow-hidden h-full">
            </div>
            <div className="rounded-2xl border-2 border-black bg-black text-white p-4 flex flex-col justify-between">
              
            </div>
            <div className="rounded-2xl border-2 border-black bg-linear-to-br from-teal-600 to-teal-800" />
            <div className="col-span-2 rounded-2xl border-2 border-black bg-[#EA2E00] p-4 flex items-center justify-between gap-4">
               </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-16 sm:py-20 lg:py-28 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mb-10 sm:mb-14">
            <h2 className="text-7xl font-black leading-[0.9] tracking-tight uppercase text-white">Discover<br />Anything.</h2>
            <div className="hidden sm:block w-px h-30 bg-white/20 shrink-0" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-3 h-80 sm:h-95 lg:h-110">

            {categories.map(({ label, bg, span, pos, src }) => (
              <div
                key={label}
                className={`card rounded-2xl! relative! overflow-hidden! cursor-pointer! group!  ${span}`}
              >
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-7xl font-black leading-[0.9] tracking-tight uppercase text-white mb-8">Your next<br />obsession<br />is here.</h2>
              <Link href="/signup" className=" btn-rect inline-flex items-center px-8 py-4 rounded-full! border-2!  border-white! bg-white! text-black! text-sm! sm:text-base! font-black! uppercase! tracking-wide! transition-all ">Join Fixel</Link>
            </div>
            <div className=" flex-col items-center gap-5 hidden lg:flex">
              <div className=" relative overflow-hidden w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full border-4 border-white bg-linear-to-br group from-teal-600 to-[#1a4a6a] flex items-center justify-center text-white font-black tracking-widest text-center leading-tight text-xl sm:text-2xl">

                <Image
                  src={"https://images.pexels.com/photos/31740970/pexels-photo-31740970.jpeg"}
                  alt={"al"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
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