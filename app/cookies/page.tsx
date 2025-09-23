import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = {
  title: "Politique des cookies — Pied2Roi",
};

export default function CookiesPolicyPage() {
  return (
    <LegalLayout title="Politique des cookies" updatedAt="29 juin 2026">
      <p>
        Un cookie est un petit fichier déposé sur votre appareil lors de la visite
        d'un site. Pied2Roi utilise des cookies pour assurer le bon
        fonctionnement du site et, avec votre accord, pour en améliorer
        l'expérience.
      </p>

      <section>
        <h2>Catégories de cookies</h2>
        <ul>
          <li>
            <strong>Nécessaires</strong> (toujours actifs) : indispensables au
            fonctionnement du site, par exemple la session de connexion et le
            panier. Ils ne nécessitent pas de consentement.
          </li>
          <li>
            <strong>Analyse</strong> : mesure d'audience anonymisée pour
            comprendre l'usage du site.
          </li>
          <li>
            <strong>Marketing</strong> : affichage de publicités personnalisées.
          </li>
          <li>
            <strong>Préférences</strong> : mémorisation de vos choix d'affichage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Gérer votre consentement</h2>
        <p>
          Lors de votre première visite, un bandeau vous permet de tout accepter,
          tout refuser ou de personnaliser vos choix. Vos préférences sont
          enregistrées dans votre navigateur. Vous pouvez les modifier à tout
          moment en effaçant les cookies du site depuis votre navigateur, ce qui
          fera réapparaître le bandeau.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Les cookies de consentement et de préférences sont conservés au maximum
          13 mois, conformément aux recommandations de la CNIL.
        </p>
      </section>

      <p>
        Pour en savoir plus sur le traitement de vos données, consultez notre{" "}
        <Link href="/privacy">politique de confidentialité</Link>.
      </p>
    </LegalLayout>
  );
}
