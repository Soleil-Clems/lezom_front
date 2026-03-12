export const APP_NAME = 'Lezom';

export function getAppUrl(): string {
  return process.env.LEZOM_URL ?? 'http://localhost:3000';
}
