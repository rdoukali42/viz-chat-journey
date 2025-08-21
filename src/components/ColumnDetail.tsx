import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ExternalLink, X } from 'lucide-react';
import { FileData } from '@/contexts/UserContext';

interface ColumnDetailProps {
  column: string;
  file: FileData;
  relatedFile?: FileData | null;
  onClose: () => void;
  onFileSelect?: (file: FileData) => void;
}

// small deterministic pseudo-random generator based on strings
const seededValues = (seedStr: string, count = 20) => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const vals: number[] = [];
  for (let i = 0; i < count; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    vals.push((seed % 1000) / 1000);
  }
  return vals;
};

const Sparkline: React.FC<{ values: number[]; className?: string }> = ({ values, className }) => {
  const width = 300;
  const height = 64;
  const max = Math.max(...values) || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => `${i * stepX},${height - (v / max) * (height - 6)}`);
  const polyPoints = points.join(' ');
  // Area polygon: points + baseline back to start
  const areaPoints = `${polyPoints} ${width},${height} 0,${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <defs>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#areaGradient)" />
      <polyline
        points={polyPoints}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.12))' }}
      />
      {/* small dots */}
      {values.map((v, i) => {
        const [x, y] = points[i].split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r={1.6} fill="#1e40af" />;
      })}
    </svg>
  );
};

const ColumnDetail: React.FC<ColumnDetailProps> = ({ column, file, relatedFile, onClose, onFileSelect }) => {
  const values = seededValues(column + file.id, 24);
  const uniqueValues = Math.max(1, Math.floor(values.reduce((s, v) => s + Math.round(v * 100), 0) / 10));
  const completeness = 95 + (uniqueValues % 5);

  const description = `Sample description for '${column}'. This is a mock field description to help frontend development and integration.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-3xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-accent mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">{column}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <div className="mb-2 text-sm text-muted-foreground">Distribution</div>
            <div className="p-3 bg-secondary rounded-md">
              <Sparkline values={values} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Unique Values</div>
              <div className="font-bold text-foreground">{uniqueValues}k</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completeness</div>
              <div className="font-bold text-foreground">{completeness}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sample Size</div>
              <div className="font-bold text-foreground">{file.rowCount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {relatedFile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFileSelect && onFileSelect(relatedFile)}
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Connected Dataset ({relatedFile.name})
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">No connected dataset for this column</div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={onClose} className="bg-gradient-primary">Close</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ColumnDetail;
