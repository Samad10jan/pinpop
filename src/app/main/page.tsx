import GotoTopBtn from "@/src/components/buttons/GotoTopBtn";
import Feed from "@/src/components/commons/Feed";
import HeroSection from "@/src/components/commons/HeroSection";
import Tags from "@/src/components/commons/TagsView";

export default function Home() {
  return (
    <main>

      <HeroSection />
      <Tags />

{/* <GotoTopBtn/> */}
      <Feed />

    </main>
  );
}