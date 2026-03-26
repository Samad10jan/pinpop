"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function GotoTopBtn() {
  const [visible, setVisible] = useState(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    function handleScroll() {
      // show after scrolling 700px
      setVisible(window.scrollY > 700);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      title="to the top"
      onClick={scrollToTop}
      className={`btn-circle fixed bottom-20 md:bottom-10 z-999 right-4 p-3 rounded-full bg-white shadow-lg
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        hover:bg-gray-400 active:bg-grey-400`}
    >
      <ArrowUpIcon />
    </button>
  );
}