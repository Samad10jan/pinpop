import Feed from "@/src/components/commons/Feed";
import HeroSection from "@/src/components/commons/HeroSection";
import Tags from "@/src/components/commons/TagsView";

export default function Home() {
  return (
    <main className="">

      <HeroSection />
      <Tags />


      <Feed />

    </main>
  );
}