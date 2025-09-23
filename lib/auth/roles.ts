/**
 * Rôles utilisateurs (conformes à la consigne : 3 profils distincts).
 * Stocké en base sous forme d'entier dans `user.role`.
 */
export const Role = {
  CLIENT: 0,
  SELLER: 1,
  ADMIN: 2,
} as const;

export type RoleValue = (typeof Role)[keyof typeof Role];

export const ROLE_LABELS: Record<number, string> = {
  [Role.CLIENT]: "Client",
  [Role.SELLER]: "Vendeur",
  [Role.ADMIN]: "Administrateur",
};

/** Un vendeur ou un administrateur peut accéder au back-office. */
export function canAccessBackOffice(role: number): boolean {
  return role === Role.SELLER || role === Role.ADMIN;
}

export function isAdmin(role: number): boolean {
  return role === Role.ADMIN;
}
