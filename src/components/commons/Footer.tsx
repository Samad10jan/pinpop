import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#1a1a1a] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        <div className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-3xl font-black tracking-wider uppercase">
            Fixel
          </h2>

          <p className="text-sm text-white/70 leading-relaxed">
            Discover ideas, collect inspiration, and create your visual world.
            Fixel helps you pin what you love.
          </p>

          <div className="flex gap-3 pt-2">
            <Link href="/signup" className="flex items-center gap-2 rounded-full px-4 py-2 border border-white/30 hover:bg-white hover:text-black transition">
              Join
            </Link>
            <Link href="/signin" className="flex items-center gap-2 rounded-full px-4 py-2 border border-white/30 hover:bg-white hover:text-black transition">
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start md:items-end">
          <span className="text-white/50 uppercase text-xs tracking-widest">Developer</span>

          <Link
            href="https://github.com/Samad10jan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-4 py-2 border border-white/30 hover:bg-white hover:text-black transition"
          >
            <Github size={18} />
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-white/30">
          Images courtesy of{" "}
          <Link
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/60 transition"
          >
            Pexels
          </Link>
          {" "}— used under the Pexels Content License.
        </p>
      </div>

    </footer>
  );
}