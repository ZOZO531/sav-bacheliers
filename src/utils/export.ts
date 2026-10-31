// Module d'export : PDF, Excel, Word (.docx), PowerPoint (.pptx), Access (CSV), Sauvegarde (JSON)
// Les bibliothèques lourdes sont chargées seulement au moment du clic.
import { saveAs } from 'file-saver';
import { AppConfig } from '../types';

const HEADERS = ['N°', 'Nom & Prénoms', 'CGQ/CGV', 'BAC', 'POINTS', 'ÉTABLISSEMENT', 'TEL PARENTS', 'TEL ÉLÈVES'];

function toRows(data: AppConfig): (string | number)[][] {
  return data.bacheliers.map(b => [
    b.numero, b.nomPrenoms, b.cgqCgv, b.bac, b.points, b.etablissement, b.telParents, b.telEleves,
  ]);
}

// Nom de fichier sans caractères interdits (ex: 2024/2025 -> 2024_2025)
function fileBase(data: AppConfig): string {
  return `SAV_Bacheliers_${data.annee.replace(/[^\w-]+/g, '_')}`;
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Android/PC : téléchargement direct. iPhone : feuille de partage (Enregistrer dans Fichiers, WhatsApp...)
async function saveFile(blob: Blob, filename: string): Promise<void> {
  if (isIOS()) {
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return;
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return; // l'utilisateur a fermé la fenêtre
    }
  }
  saveAs(blob, filename);
}

// === PDF ===
export async function exportToPDF(data: AppConfig): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(18);
  doc.setTextColor(59, 130, 246);
  doc.text(`Fiche d'enregistrement des Bacheliers - Année ${data.annee}`, 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

  autoTable(doc, {
    head: [HEADERS],
    body: toRows(data).map(r => r.map(String)),
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  await saveFile(doc.output('blob'), `${fileBase(data)}.pdf`);
}

// === EXCEL (.xlsx) ===
export async function exportToExcel(data: AppConfig): Promise<void> {
  const XLSX = await import('xlsx');
  const pts = data.bacheliers.map(b => b.points);
  const n = data.bacheliers.length;

  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...toRows(data)]);
  ws['!cols'] = [6, 30, 10, 8, 8, 28, 16, 16].map(wch => ({ wch }));

  const stats = XLSX.utils.aoa_to_sheet([
    ['Statistiques'],
    ['Année', data.annee],
    ['Nombre total de bacheliers', n],
    ['Moyenne des points', n > 0 ? Number((pts.reduce((s, p) => s + p, 0) / n).toFixed(2)) : 0],
    ['Points max', n > 0 ? Math.max(...pts) : 0],
    ['Points min', n > 0 ? Math.min(...pts) : 0],
  ]);
  stats['!cols'] = [{ wch: 30 }, { wch: 14 }];

  const wb = XLSX.utils.book_new();
  const sheetName = `Bacheliers ${data.annee}`.replace(/[\\/?*[\]:]/g, '-').slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.utils.book_append_sheet(wb, stats, 'Statistiques');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  await saveFile(blob, `${fileBase(data)}.xlsx`);
}

// === WORD (.docx) ===
export async function exportToWord(data: AppConfig): Promise<void> {
  const {
    Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun,
    WidthType, AlignmentType, ShadingType, PageOrientation,
  } = await import('docx');

  const cell = (text: string, o: { bold?: boolean; fill?: string; color?: string; left?: boolean } = {}) =>
    new TableCell({
      shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
      children: [
        new Paragraph({
          alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER,
          children: [new TextRun({ text, bold: o.bold, color: o.color, size: 18 })],
        }),
      ],
    });

  const headRow = new TableRow({
    tableHeader: true,
    children: HEADERS.map(h => cell(h, { bold: true, fill: '3B82F6', color: 'FFFFFF' })),
  });

  const bodyRows = toRows(data).map(
    (r, i) =>
      new TableRow({
        children: r.map((v, c) =>
          cell(String(v), { fill: i % 2 === 1 ? 'F0F7FF' : undefined, left: c === 1 || c === 5 })
        ),
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Fiche d'enregistrement des Bacheliers - Année ${data.annee}`,
                bold: true, size: 32, color: '3B82F6',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Généré le ${new Date().toLocaleDateString('fr-FR')}`, size: 20, color: '666666' })],
            spacing: { after: 200 },
          }),
          new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headRow, ...bodyRows] }),
          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: `Total : ${data.bacheliers.length} bacheliers`, bold: true })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  await saveFile(blob, `${fileBase(data)}.docx`);
}

// === POWERPOINT (.pptx) ===
export async function exportToPowerPoint(data: AppConfig): Promise<void> {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13,33 x 7,5 pouces

  // Diapositive de titre
  const first = pptx.addSlide();
  first.background = { color: '3B82F6' };
  first.addText("Fiche d'enregistrement des Bacheliers", {
    x: 0.5, y: 2.4, w: 12.3, h: 1, fontSize: 36, bold: true, color: 'FFFFFF', align: 'center',
  });
  first.addText(`Année ${data.annee} - ${data.bacheliers.length} bacheliers`, {
    x: 0.5, y: 3.6, w: 12.3, h: 0.6, fontSize: 22, color: 'FFFFFF', align: 'center',
  });

  // Tableaux : 10 lignes par diapositive
  const PER_SLIDE = 10;
  const rows = toRows(data);
  const head = HEADERS.map(h => ({
    text: h,
    options: { bold: true, color: 'FFFFFF', fill: { color: '3B82F6' }, align: 'center' as const },
  }));

  for (let start = 0; start < rows.length; start += PER_SLIDE) {
    const slide = pptx.addSlide();
    const page = Math.floor(start / PER_SLIDE) + 1;
    const pages = Math.ceil(rows.length / PER_SLIDE);
    slide.addText(`Bacheliers ${data.annee} (${page}/${pages})`, {
      x: 0.4, y: 0.3, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: '3B82F6',
    });
    const body = rows.slice(start, start + PER_SLIDE).map(r =>
      r.map((v, c) => ({
        text: String(v),
        options: { align: (c === 1 || c === 5 ? 'left' : 'center') as 'left' | 'center' },
      }))
    );
    slide.addTable([head, ...body], {
      x: 0.4, y: 1.1, w: 12.5,
      colW: [0.6, 3.2, 1.1, 0.8, 1.0, 2.8, 1.5, 1.5],
      fontSize: 11,
      border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
      valign: 'middle',
    });
  }

  const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
  await saveFile(blob, `${fileBase(data)}.pptx`);
}

// === ACCESS (CSV, séparateur ;) ===
export async function exportToAccess(data: AppConfig): Promise<void> {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [HEADERS, ...toRows(data)].map(r => r.map(esc).join(';'));
  const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  await saveFile(blob, `${fileBase(data)}.csv`);
}

// === SAUVEGARDE (JSON) : permet de tout restaurer sur un autre téléphone ===
export async function exportBackup(data: AppConfig): Promise<void> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  await saveFile(blob, `SAV_Sauvegarde_${new Date().toISOString().slice(0, 10)}.json`);
}
