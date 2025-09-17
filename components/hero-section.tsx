import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/premium-sneakers-hero-shot-with-dynamic-lighting.jpg"
          alt="Collection de sneakers premium"
          fill
          className="object-cover scale-105 transition-transform duration-[10s] ease-out hover:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-none">
          ENTREZ DANS
          <span className="block text-accent drop-shadow-lg">L'EXCELLENCE</span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
          Découvrez les sneakers les plus convoitées au monde. Des drops limités aux classiques intemporels.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-4 text-lg font-semibold hover-lift focus-ring shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Voir les Nouveautés
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 text-lg font-semibold bg-transparent backdrop-blur-sm hover-lift focus-ring transition-all duration-300"
          >
            Explorer les Collections
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
