import { Bachelier } from '../types';
import { useRef, useEffect } from 'react';

interface Props {
  bacheliers: Bachelier[];
  annee: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1'];

export default function ChartView({ bacheliers, annee }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || bacheliers.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Taille : le graphique s'élargit quand il y a beaucoup de bacheliers (défilement horizontal)
    const n = bacheliers.length;
    const width = Math.max(600, n * 28 + 140);
    const height = 350;
    const dpr = window.devicePixelRatio || 1; // netteté sur écrans de téléphone
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = { top: 60, right: 80, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxPoints = Math.max(...bacheliers.map(b => b.points), 100);
    const maxY = Math.ceil(maxPoints / 100) * 100;

    // Fond
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Titre
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Graphique des Points - Année ${annee}`, width / 2, 25);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.fillText(`${n} bachelier${n > 1 ? 's' : ''}`, width / 2, 42);

    // Grille + valeurs de l'axe Y
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      const val = maxY - (maxY / gridLines) * i;
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    // Axes (repère orthonormé O, I, J)
    ctx.strokeStyle = '#1f2937';
    ctx.fillStyle = '#1f2937';
    ctx.lineWidth = 2;

    // Axe X (OI)
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth + 10, padding.top + chartHeight);
    ctx.stroke();

    // Flèche X
    ctx.beginPath();
    ctx.moveTo(padding.left + chartWidth + 10, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth + 3, padding.top + chartHeight - 4);
    ctx.lineTo(padding.left + chartWidth + 3, padding.top + chartHeight + 4);
    ctx.fill();

    // Axe Y (OJ)
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top - 10);
    ctx.stroke();

    // Flèche Y
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top - 10);
    ctx.lineTo(padding.left - 4, padding.top - 3);
    ctx.lineTo(padding.left + 4, padding.top - 3);
    ctx.fill();

    // Lettres O, I, J
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('I', padding.left + chartWidth + 22, padding.top + chartHeight + 4);
    ctx.fillText('J', padding.left, padding.top - 16);
    ctx.fillText('O', padding.left - 12, padding.top + chartHeight + 14);

    // Titre axe Y
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('POINTS', 0, 0);
    ctx.restore();

    // Titre axe X
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BACHELIERS (N°)', padding.left + chartWidth / 2, height - 10);

    // Barres
    const barWidth = Math.min(30, (chartWidth / n) * 0.7);
    const gap = (chartWidth - barWidth * n) / (n + 1);

    bacheliers.forEach((b, i) => {
      const x = padding.left + gap + i * (barWidth + gap);
      const barHeight = (b.points / maxY) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      const color = COLORS[i % COLORS.length];
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '40');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();

      // Valeur au-dessus
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(b.points.toString(), x + barWidth / 2, y - 5);

      // Numéro en bas
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px Arial';
      ctx.fillText(b.numero.toString(), x + barWidth / 2, padding.top + chartHeight + 15);
    });

    // Ligne de moyenne
    const avg = bacheliers.reduce((s, b) => s + b.points, 0) / n;
    const avgY = padding.top + chartHeight - (avg / maxY) * chartHeight;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, avgY);
    ctx.lineTo(padding.left + chartWidth, avgY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Moy: ${avg.toFixed(1)}`, padding.left + chartWidth + 5, avgY + 4);
  }, [bacheliers, annee]);

  if (bacheliers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">📊</p>
        <p className="font-medium">Aucune donnée à afficher</p>
        <p className="text-sm">Enregistrez des bacheliers pour voir le graphique</p>
      </div>
    );
  }

  const avg = bacheliers.reduce((s, b) => s + b.points, 0) / bacheliers.length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-4 text-white shadow-lg">
        <h2 className="text-lg font-bold text-center">📊 Graphique - Repère Orthonormé (O ; I ; J)</h2>
        <p className="text-center text-green-100 text-sm mt-1">Année {annee}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-blue-600">{bacheliers.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Moyenne</p>
          <p className="text-lg font-bold text-green-600">{avg.toFixed(1)}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Max</p>
          <p className="text-lg font-bold text-purple-600">{Math.max(...bacheliers.map(b => b.points))}</p>
        </div>
      </div>

      {/* Graphique (faire défiler vers la droite si besoin) */}
      <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm overflow-x-auto">
        <canvas ref={canvasRef} />
      </div>

      {/* Légende */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 font-medium mb-2">Légende :</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-500"></span> Points par bachelier
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-500"></span> Moyenne
          </span>
        </div>
      </div>
    </div>
  );
}
