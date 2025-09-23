/**
 * Simulation d'envoi d'email (consigne : « simulation d'email »).
 * Aucun email réel n'est envoyé — le message est journalisé côté serveur,
 * ce qui permet de vérifier le déclenchement (confirmation, suivi de commande).
 */
export function simulateEmail(to: string, subject: string, body: string): void {
  console.log(
    [
      "",
      "📧 ─────────── EMAIL SIMULÉ ───────────",
      `   À      : ${to}`,
      `   Objet  : ${subject}`,
      `   Message: ${body}`,
      "──────────────────────────────────────",
      "",
    ].join("\n"),
  );
}
