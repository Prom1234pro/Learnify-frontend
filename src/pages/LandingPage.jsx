import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import KeyFeatures from "../components/KeyFeatures"
import Features2 from "../components/Features2"
import Pricing from "../components/Pricing"
import Testimonials from "../components/Testimonials"
import Footer from "../components/Footer"
import CTA from "../components/CTA"

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      
      {/* Scrollable content */}
      <div className="relative z-10">
        <main className="text-sm text-neutral-300 antialiased">
          <Navbar />
          <HeroSection />
          <KeyFeatures />
          <Features2 />
          <Pricing />
          <Testimonials />
          <CTA />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default LandingPage