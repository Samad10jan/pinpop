import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer py-10 px-4">
      <div className="container mx-auto flex flex-row items-start justify-between gap-8">
        
        <div className="flex flex-col items-start gap-4 text-left">
          
          <div className="text-3xl font-bold text-white">
            Fixel
          </div>

          <div className="flex gap-3 flex-wrap justify-start">
            <Link
              href="/signin"
              className="btn-rect py-2! px-5!  text-xs!  font-bold! tracking-wide! uppercase!"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="btn-rect py-2! px-5!  text-xs!  font-bold! tracking-wide! uppercase!"
            >
              Join
            </Link>
          </div>

        </div>

        <div className="flex justify-end">
          <Link
            title="GitHub"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full py-3 px-3 ring-3 ring-green-600! bg-white duration-200 hover:text-white hover:bg-green-600 transition-all"
          >
            <Github size={20} />
          </Link>
        </div>

      </div>
    </footer>
  );
}