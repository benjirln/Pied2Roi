import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = {
  title: "Politique de confidentialité — Pied2Roi",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="29 juin 2026">
      <p>
        Pied2Roi accorde une grande importance à la protection de vos données
        personnelles. Cette politique explique quelles données nous collectons,
        pourquoi, combien de temps nous les conservons et quels sont vos droits,
        conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données est la boutique{" "}
          <strong>Pied2Roi</strong>. Pour toute question relative à vos données,
          vous pouvez nous contacter à l'adresse{" "}
          <a href="mailto:contact@pied2roi.fr">contact@pied2roi.fr</a>.
        </p>
      </section>

      <section>
        <h2>2. Données collectées</h2>
        <ul>
          <li>
            <strong>Compte</strong> : prénom, nom, adresse email et mot de passe
            (stocké uniquement sous forme hachée, jamais en clair).
          </li>
          <li>
            <strong>Commandes</strong> : produits commandés, tailles, montants et
            statut de la commande.
          </li>
          <li>
            <strong>Session</strong> : un identifiant de session technique
            (cookie) permettant de vous garder connecté.
          </li>
          <li>
            <strong>Cookies</strong> : selon votre consentement (voir la{" "}
            <Link href="/cookies">politique des cookies</Link>).
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Finalités et base légale</h2>
        <ul>
          <li>
            Création et gestion de votre compte — <em>exécution du contrat</em>.
          </li>
          <li>
            Traitement et suivi de vos commandes — <em>exécution du contrat</em>.
          </li>
          <li>
            Mesure d'audience et personnalisation — <em>votre consentement</em>.
          </li>
          <li>
            Sécurité du site et prévention de la fraude —{" "}
            <em>intérêt légitime</em>.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Durée de conservation</h2>
        <p>
          Les données de compte sont conservées tant que votre compte est actif.
          Les données de commande sont conservées pour la durée légale applicable
          aux obligations comptables. Les cookies ont une durée de vie maximale de
          13 mois. Vous pouvez supprimer votre compte à tout moment.
        </p>
      </section>

      <section>
        <h2>5. Destinataires</h2>
        <p>
          Vos données ne sont ni vendues ni cédées à des tiers. Elles sont
          accessibles uniquement au personnel habilité de Pied2Roi
          (administrateurs et vendeurs) dans le cadre du traitement des commandes.
        </p>
      </section>

      <section>
        <h2>6. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>droit d'accès et de rectification de vos données ;</li>
          <li>droit à l'effacement (« droit à l'oubli ») ;</li>
          <li>droit à la limitation et à l'opposition au traitement ;</li>
          <li>droit à la portabilité de vos données ;</li>
          <li>droit de retirer votre consentement à tout moment.</li>
        </ul>
        <p>
          Vous pouvez exercer la plupart de ces droits directement depuis votre{" "}
          <Link href="/account">espace compte</Link> (consultation et suppression
          du compte) ou en nous écrivant. Vous avez également le droit
          d'introduire une réclamation auprès de la CNIL.
        </p>
      </section>

      <section>
        <h2>7. Sécurité</h2>
        <p>
          Les mots de passe sont hachés (algorithme scrypt avec sel), les sessions
          reposent sur un cookie <code>httpOnly</code> et les formulaires sont
          validés côté serveur. Ces mesures visent à protéger vos données contre
          tout accès non autorisé.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          Pour toute demande relative à vos données personnelles :{" "}
          <a href="mailto:contact@pied2roi.fr">contact@pied2roi.fr</a>.
        </p>
      </section>

      <p className="text-sm">
        <em>
          Pied2Roi est un projet pédagogique : les transactions et envois d'emails
          y sont simulés.
        </em>
      </p>
    </LegalLayout>
  );
}
