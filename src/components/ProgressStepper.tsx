import React from 'react';
import { Upload, Database, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProgressStepperProps {
  current: number; // 0..(steps.length-1)
  onChange?: (index: number) => void;
  steps?: Step[];
  className?: string;
  clickable?: boolean;
}

const defaultSteps: Step[] = [
  { key: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4" /> },
  { key: 'discovery', label: 'Discovery', icon: <Database className="h-4 w-4" /> },
  { key: 'chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4" /> },
];

const ProgressStepper: React.FC<ProgressStepperProps> = ({ current, onChange, steps = defaultSteps, className, clickable = false }) => {
  const pct = Math.max(0, Math.min(1, current / Math.max(1, steps.length - 1)));

  return (
    <div className={`w-full ${className || ''}`} role="group" aria-label="Progress Steps">
      <div className="relative">
        <div className="h-1 bg-muted rounded-full">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

  <div className={`absolute inset-0 flex justify-between items-center ${clickable ? '' : 'pointer-events-none'}`}>
          {steps.map((s, i) => {
            const state = i < current ? 'complete' : i === current ? 'active' : 'upcoming';
            const base = 'w-10 h-10 rounded-full flex items-center justify-center border transition-all';

            const btnClass =
              state === 'complete'
                ? base + ' bg-primary text-primary-foreground border-primary/60'
                : state === 'active'
                ? base + ' bg-background text-primary border-2 border-primary shadow-md'
                : base + ' bg-white/0 text-muted-foreground border-border';

            return (
              <div key={s.key} className="flex flex-col items-center" style={{ width: 40 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={btnClass + (clickable ? '' : ' cursor-default')}
                  onClick={() => clickable && onChange && onChange(i)}
                  aria-current={i === current ? 'step' : undefined}
                  aria-disabled={!clickable}
                >
                  {i < current ? <Check className="h-4 w-4" /> : s.icon}
                </Button>
                <div className={`mt-2 text-xs text-center ${i === current ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
