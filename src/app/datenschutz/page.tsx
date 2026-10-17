import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BUSINESS, BUSINESS_ADDRESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Dalab Fresh",
  description: "Wie Dalab Fresh personenbezogene Daten bei Bestellungen verarbeitet.",
  alternates: { canonical: "/datenschutz" },
};

export default function Datenschutz() {
  const b = BUSINESS;
  return (
    <LegalPage title="Datenschutzerklärung">
      <p>
        Wir verarbeiten deine Daten nur, soweit es für den Shop und deine Bestellung nötig ist. Wir verwenden keine Tracking- oder
        Werbe-Cookies und keine Analyse-Dienste.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        {b.legalName}, {BUSINESS_ADDRESS}<br />
        E-Mail: <a href={`mailto:${b.email}`}>{b.email}</a>, Telefon: {b.phone}
      </p>

      <h2>2. Bestellungen</h2>
      <p>
        Wenn du bestellst, verarbeiten wir Name, E-Mail-Adresse, optional Telefonnummer, bei Lieferung die Lieferadresse,
        die bestellten Artikel, das gewählte Zeitfenster, die Filiale und die Zahlungsart. Zweck ist die Abwicklung des Kaufvertrags,
        die Lieferung oder Abholung und die Bestellbestätigung per E-Mail.
      </p>
      <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Aufbewahrungspflichten).</p>
      <p>
        Bezahlt wird bei Übergabe mit Karte oder bar. Kartendaten werden im Shop nicht erfasst; die Kartenzahlung läuft über das
        Terminal des jeweiligen Zahlungsdienstleisters.
      </p>
      <p>
        Speicherdauer: Bestelldaten bewahren wir auf, solange es handels- und steuerrechtlich vorgeschrieben ist
        (bis zu 10 Jahre nach § 147 AO und § 257 HGB), und löschen sie danach.
      </p>

      <h2>3. Hosting und Datenbank</h2>
      <p>
        Die Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet. Beim Aufruf der Seiten verarbeitet
        Vercel technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser) in Server-Logs, um die Seite auszuliefern
        und abzusichern. Vercel ist unter dem EU-US Data Privacy Framework zertifiziert; zusätzlich gelten EU-Standardvertragsklauseln.
      </p>
      <p>
        Bestellungen speichern wir in einer Datenbank von Neon (Databricks, Inc.) auf Servern in Frankfurt am Main (AWS, Region eu-central-1).
      </p>
      <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren, zuverlässigen Betrieb) und Art. 28 DSGVO (Auftragsverarbeitung).</p>

      <h2>4. E-Mail</h2>
      <p>
        Bestellbestätigungen versenden wir über den E-Mail-Dienst unseres Postfachanbieters. Dabei werden deine E-Mail-Adresse und
        der Inhalt der Bestätigung übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
      </p>

      <h2>5. Speicherung in deinem Browser</h2>
      <p>
        Damit Warenkorb, Merkliste, Sprache und deine Kontaktangaben für die nächste Bestellung erhalten bleiben, speichert der Shop sie
        im lokalen Speicher deines Browsers (localStorage). Diese Daten verlassen dein Gerät erst, wenn du eine Bestellung abschickst.
        Die Speicherung ist für den von dir gewünschten Dienst erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst sie jederzeit über die
        Browser-Einstellungen löschen.
      </p>
      <p>
        Wenn du die App installierst, legt ein Service Worker Seiten und Bilder im Browser-Cache ab, damit der Shop schneller lädt und
        offline erreichbar ist. Personenbezogene Daten werden dort nicht gespeichert.
      </p>

      <h2>6. Schriften und Bilder</h2>
      <p>Schriften und Fotos liefern wir von unserem eigenen Server aus. Beim Seitenaufruf wird keine Verbindung zu Google Fonts aufgebaut.</p>

      <h2>7. Deine Rechte</h2>
      <p>Du hast das Recht auf:</p>
      <ul>
        <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO), soweit keine Aufbewahrungspflicht besteht</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)</li>
      </ul>
      <p>Schreib uns dazu einfach an <a href={`mailto:${b.email}`}>{b.email}</a>.</p>
      <p>
        Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel beim Hessischen Beauftragten für
        Datenschutz und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden.
      </p>
    </LegalPage>
  );
}
