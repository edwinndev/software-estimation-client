'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { RiskLevel } from '../types/risk.types';

const LABELS: Record<RiskLevel, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
};

interface Props {
  value: RiskLevel;
  onChange: (value: RiskLevel) => void;
  disabled?: boolean;
}

export const RiskLevelSelector = ({ value, onChange, disabled }: Props) => (
  <div className="flex items-center gap-2">
    <Select
      value={value}
      onValueChange={(v) => onChange(v as RiskLevel)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Nivel de riesgo" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(LABELS) as RiskLevel[]).map((level) => (
          <SelectItem key={level} value={level}>
            {LABELS[level]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Badge variant={value === 'high' ? 'destructive' : 'secondary'}>
      {LABELS[value]}
    </Badge>
  </div>
);