import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Principles from "@/components/Principles";
import Masonry from "@/components/Masonry";
import Audience from "@/components/Audience";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Principles />
        <Masonry />
        <Audience />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
