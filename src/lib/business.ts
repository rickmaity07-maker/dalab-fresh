// The legal details of the business behind the shop, used by the Impressum, privacy policy, terms and emails.
// Every value marked TODO must be replaced with the real details before taking real orders:
// German law (§ 5 DDG) requires a correct, reachable Impressum.
export const BUSINESS = {
  /** Registered name, including legal form (e.g. "Dalab Fresh GmbH" or "Max Muster e.K."). TODO */
  legalName: "Dalab Fresh (Inhaber: Rick Maity)",
  /** Person legally responsible. TODO */
  owner: "Rick Maity",
  /** Postal address (no P.O. box). TODO */
  street: "Musterstraße 1",
  postcode: "60311",
  city: "Frankfurt am Main",
  country: "Deutschland",
  email: "kontakt@dalab-fresh.de",
  phone: "+49 69 000000",
  /** USt-IdNr. if you have one, else null. TODO */
  vatId: null as string | null,
  /** Handelsregister entry if registered (e.g. "Amtsgericht Frankfurt am Main, HRB 123456"), else null. */
  register: null as string | null,
  /** Competent food control authority (Lebensmittelüberwachung) for the main location. TODO */
  foodAuthority: "Amt für Veterinärwesen und Lebensmittelüberwachung, Stadt Frankfurt am Main",
  /** Date the legal texts were last updated. */
  legalUpdated: "17. Oktober 2026",
} as const;

export const BUSINESS_ADDRESS = `${BUSINESS.street}, ${BUSINESS.postcode} ${BUSINESS.city}`;
