import { Bento } from "@/components/bento/bento";
import { Cta } from "@/components/cta/cta";
import { Faq } from "@/components/faq/faq";
import { Features } from "@/components/features/features";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { LogoCloud } from "@/components/logo-cloud/logo-cloud";
import { Navbar } from "@/components/navbar/navbar";
import { Pricing } from "@/components/pricing/pricing";
import { Testimonials } from "@/components/testimonials/testimonials";

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
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
