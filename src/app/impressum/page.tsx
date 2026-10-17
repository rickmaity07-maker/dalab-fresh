import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Impressum | Dalab Fresh",
  description: "Anbieterkennzeichnung von Dalab Fresh nach § 5 DDG.",
  alternates: { canonical: "/impressum" },
};

export default function Impressum() {
  const b = BUSINESS;
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <address>
        {b.legalName}<br />
        {b.street}<br />
        {b.postcode} {b.city}<br />
        {b.country}
      </address>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${b.email}`}>{b.email}</a><br />
        Telefon: <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
      </p>

      {b.register ? (<><h2>Registereintrag</h2><p>{b.register}</p></>) : null}
      {b.vatId ? (<><h2>Umsatzsteuer-ID</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {b.vatId}</p></>) : null}

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>{b.owner}, Anschrift wie oben</p>

      <h2>Lebensmittelüberwachung</h2>
      <p>Zuständige Aufsichtsbehörde: {b.foodAuthority}</p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Wir erstellen die Inhalte dieser Seiten mit Sorgfalt, übernehmen aber keine Gewähr für Vollständigkeit und Aktualität.
        Für Inhalte verlinkter fremder Websites sind ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen
        entfernen wir betroffene Inhalte oder Links umgehend.
      </p>

      <h2>Bildnachweis</h2>
      <p>Produkt- und Stimmungsfotos: <a href="https://unsplash.com/license" rel="noopener">Unsplash</a> (Unsplash-Lizenz).</p>
    </LegalPage>
  );
}
