import Feed from "@/src/components/commons/Feed";
import HeroSection from "@/src/components/commons/HeroSection";
import Tags from "@/src/components/commons/TagsView";

export default function Home() {
  return (
    <main className=" px-5 py-8">

      <HeroSection />
      <Tags />


      <Feed />

    </main>
  );
}