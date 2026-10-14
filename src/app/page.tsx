import { Bento } from "@/components/bento/bento";
import { Features } from "@/components/features/features";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { LogoCloud } from "@/components/logo-cloud/logo-cloud";
import { Navbar } from "@/components/navbar/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <Bento />
        <Features />
        <HowItWorks />
      </main>
    </>
  );
}
