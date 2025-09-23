import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = {
  title: "Conditions d'utilisation — Pied2Roi",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Conditions d'utilisation" updatedAt="29 juin 2026">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent l'utilisation du site Pied2Roi et la
          vente de sneakers proposées sur la boutique. En créant un compte ou en
          passant commande, vous acceptez ces conditions.
        </p>
      </section>

      <section>
        <h2>2. Compte utilisateur</h2>
        <p>
          Vous êtes responsable de l'exactitude des informations fournies et de la
          confidentialité de vos identifiants. Tout compte créé via l'inscription
          dispose du rôle « client ».
        </p>
      </section>

      <section>
        <h2>3. Commandes et paiement</h2>
        <p>
          Les prix sont affichés en euros, toutes taxes comprises. La disponibilité
          des produits dépend du stock en temps réel. La commande est validée après
          le paiement.
        </p>
        <p>
          <strong>
            Pied2Roi est un projet pédagogique : le paiement est fictif et aucune
            transaction réelle n'est effectuée. Les emails de confirmation sont
            simulés.
          </strong>
        </p>
      </section>

      <section>
        <h2>4. Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans notre{" "}
          <Link href="/privacy">politique de confidentialité</Link> et notre{" "}
          <Link href="/cookies">politique des cookies</Link>.
        </p>
      </section>

      <section>
        <h2>5. Propriété intellectuelle</h2>
        <p>
          Les images de produits proviennent de sources tierces et sont utilisées
          à des fins de démonstration dans un cadre pédagogique.
        </p>
      </section>
    </LegalLayout>
  );
}
