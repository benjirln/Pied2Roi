import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  const footerSections = [
    {
      title: "Boutique",
      links: [
        { name: "Hommes", href: "/men" },
        { name: "Femmes", href: "/women" },
        { name: "Nouveautés", href: "/new-arrivals" },
        { name: "Soldes", href: "/sale" },
      ],
    },
    {
      title: "Marques",
      links: [
        { name: "Nike", href: "/brands/nike" },
        { name: "Adidas", href: "/brands/adidas" },
        { name: "Jordan", href: "/brands/jordan" },
        { name: "New Balance", href: "/brands/new-balance" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Guide des Tailles", href: "/size-guide" },
        { name: "Livraison", href: "/shipping" },
        { name: "Retours", href: "/returns" },
        { name: "Nous Contacter", href: "/contact" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { name: "À Propos", href: "/about" },
        { name: "Carrières", href: "/careers" },
        { name: "Confidentialité", href: "/privacy" },
        { name: "Conditions", href: "/terms" },
      ],
    },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-6 block hover:text-accent transition-colors">
              SNEAKR
            </Link>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Votre destination premium pour les sneakers les plus convoitées au monde. Authenticité garantie.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-accent transition-all duration-300 hover-lift p-2 rounded-full hover:bg-accent/10 focus-ring"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold mb-6 text-lg">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-accent transition-colors text-sm hover:translate-x-1 inline-block duration-200 focus-ring rounded"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2024 SNEAKR. Tous droits réservés.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-accent text-sm transition-colors focus-ring rounded"
            >
              Politique de Confidentialité
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-accent text-sm transition-colors focus-ring rounded"
            >
              Conditions d'Utilisation
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-accent text-sm transition-colors focus-ring rounded"
            >
              Politique des Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
