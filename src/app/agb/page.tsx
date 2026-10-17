import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { BUSINESS, BUSINESS_ADDRESS } from "@/lib/business";
import { DELIVERY_FEE, EXPRESS_FEE, FREE_DELIVERY_OVER, formatEur } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "AGB und Widerrufsbelehrung | Dalab Fresh",
  description: "Allgemeine Geschäftsbedingungen, Liefer- und Zahlungsbedingungen und Widerrufsbelehrung von Dalab Fresh.",
  alternates: { canonical: "/agb" },
};

const eur = (c: number) => formatEur(c, "de");

export default function Agb() {
  const b = BUSINESS;
  return (
    <LegalPage title="AGB und Widerrufsbelehrung">
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Bedingungen gelten für alle Bestellungen über den Online-Shop von {b.legalName}, {BUSINESS_ADDRESS} („wir“).
        Vertragssprache ist Deutsch. Die Übersetzungen des Shops ins Englische und Somalische dienen nur der Orientierung.
      </p>

      <h2>§ 2 Vertragsschluss</h2>
      <p>
        Die Darstellung der Produkte im Shop ist kein verbindliches Angebot. Mit dem Klick auf „Zahlungspflichtig bestellen“ gibst du
        ein verbindliches Angebot zum Kauf der Artikel im Warenkorb ab. Vorher kannst du deine Angaben jederzeit prüfen und über
        „Zurück zum Warenkorb“ korrigieren. Die automatische Bestellbestätigung per E-Mail bestätigt nur den Eingang. Der Vertrag kommt
        zustande, wenn wir die Ware übergeben oder die Annahme ausdrücklich bestätigen. Den Vertragstext speichern wir; die Einzelheiten
        deiner Bestellung erhältst du in der Bestätigungs-E-Mail.
      </p>

      <h2>§ 3 Preise und Gewichtsartikel</h2>
      <p>
        Alle Preise sind Endpreise in Euro inklusive der gesetzlichen Mehrwertsteuer. Bei frischer Ware nach Gewicht (z. B. Fleisch, Obst)
        kann das tatsächliche Gewicht leicht abweichen; berechnet wird das tatsächliche Gewicht zum angegebenen Kilopreis.
      </p>

      <h2>§ 4 Lieferung und Abholung</h2>
      <ul>
        <li>Wir liefern in die Liefergebiete unserer Filialen in Frankfurt am Main, Köln, München und Hamburg, montags bis samstags.</li>
        <li>Die Liefergebühr beträgt {eur(DELIVERY_FEE)}; ab einem Warenwert von {eur(FREE_DELIVERY_OVER)} liefern wir kostenlos. Expresslieferung kostet {eur(EXPRESS_FEE)}.</li>
        <li>Click &amp; Collect, also die Abholung in der gewählten Filiale, ist kostenlos.</li>
        <li>Wir liefern im gewählten Zeitfenster. Ist ein Artikel nicht verfügbar, informieren wir dich und berechnen ihn nicht.</li>
        <li>Bist du zur vereinbarten Zeit nicht erreichbar, melden wir uns, um einen neuen Termin zu vereinbaren. Kühlware können wir nicht unbeaufsichtigt abstellen.</li>
      </ul>

      <h2>§ 5 Zahlung</h2>
      <p>
        Du bezahlst bei Übergabe der Ware mit EC-Karte, Visa, Mastercard oder in bar. Bis zur vollständigen Bezahlung bleibt die Ware unser Eigentum.
      </p>

      <h2>§ 6 Mängel</h2>
      <p>
        Es gilt das gesetzliche Mängelhaftungsrecht. Bitte prüf frische Ware bei Übergabe und melde Mängel möglichst sofort an
        {" "}<a href={`mailto:${b.email}`}>{b.email}</a>; deine gesetzlichen Rechte bleiben davon unberührt.
      </p>

      <h2 id="widerruf">Widerrufsbelehrung</h2>
      <h3>Widerrufsrecht</h3>
      <p>
        Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
        Tage ab dem Tag, an dem du oder ein von dir benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen hast bzw.
        hat. Bei einer Bestellung mehrerer Waren, die getrennt geliefert werden, beginnt die Frist mit Erhalt der letzten Ware.
      </p>
      <p>
        Um dein Widerrufsrecht auszuüben, musst du uns ({b.legalName}, {BUSINESS_ADDRESS}, E-Mail: {b.email}, Telefon: {b.phone}) mittels
        einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über deinen Entschluss, diesen Vertrag zu
        widerrufen, informieren. Du kannst dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
        Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
        Widerrufsfrist absendest.
      </p>
      <h3>Folgen des Widerrufs</h3>
      <p>
        Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, einschließlich der Lieferkosten
        (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass du eine andere Art der Lieferung als die von uns angebotene,
        günstigste Standardlieferung gewählt hast), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die
        Mitteilung über deinen Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei
        der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
        werden dir wegen dieser Rückzahlung Entgelte berechnet. Wir können die Rückzahlung verweigern, bis wir die Waren wieder
        zurückerhalten haben oder bis du den Nachweis erbracht hast, dass du die Waren zurückgesandt hast, je nachdem, welches der
        frühere Zeitpunkt ist.
      </p>
      <p>
        Du hast die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem du uns über den Widerruf
        unterrichtest, an uns zurückzusenden oder in einer unserer Filialen zu übergeben. Die Frist ist gewahrt, wenn du die Waren vor
        Ablauf der Frist von vierzehn Tagen absendest. Du trägst die unmittelbaren Kosten der Rücksendung der Waren. Du musst für einen
        etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und
        Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
      </p>
      <h3>Ausschluss des Widerrufsrechts</h3>
      <p>Das Widerrufsrecht besteht nicht bei Verträgen</p>
      <ul>
        <li>zur Lieferung von Waren, die schnell verderben können oder deren Verfallsdatum schnell überschritten würde, z. B. frisches Fleisch, Milchprodukte, Backwaren, Obst und Gemüse (§ 312g Abs. 2 Nr. 2 BGB);</li>
        <li>zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde (§ 312g Abs. 2 Nr. 3 BGB).</li>
      </ul>

      <h3>Muster-Widerrufsformular</h3>
      <div className="box">
        <p>(Wenn du den Vertrag widerrufen willst, fülle bitte dieses Formular aus und sende es zurück.)</p>
        <p>An {b.legalName}, {BUSINESS_ADDRESS}, E-Mail: {b.email}</p>
        <p>
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)<br />
          Bestellt am (*) / erhalten am (*)<br />
          Bestellnummer<br />
          Name des/der Verbraucher(s)<br />
          Anschrift des/der Verbraucher(s)<br />
          Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)<br />
          Datum
        </p>
        <p className="mb-0!">(*) Unzutreffendes streichen.</p>
      </div>
    </LegalPage>
  );
}
