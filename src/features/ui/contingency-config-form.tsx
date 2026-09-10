'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRiskConfig, useUpdateRiskConfig } from '../hooks/use-risk-config';
import { riskConfigSchema } from '../schemas/risk-config.schema';
import type { RiskConfig } from '../types/risk.types';

const LABELS = { low: 'Bajo', medium: 'Medio', high: 'Alto' } as const;

export const ContingencyConfigForm = () => {
  const { data } = useRiskConfig();
  const { mutate, isPending } = useUpdateRiskConfig();

  const form = useForm({
    defaultValues: (data ?? {
      levels: { low: 5, medium: 15, high: 25 },
    }) as RiskConfig,
    validators: {
      onChange: ({ value }) => {
        const result = riskConfigSchema.safeParse(value);
        return result.success
          ? undefined
          : result.error.issues[0]?.message;
      },
    },
    onSubmit: ({ value }) => mutate(value),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Margen de contingencia por nivel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(['low', 'medium', 'high'] as const).map((level) => (
          <form.Field key={level} name={`levels.${level}`}>
            {(field) => (
              <div className="flex items-center gap-3">
                <Label className="w-20">{LABELS[level]}</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            )}
          </form.Field>
        ))}
        <Button
          type="button"
          onClick={() => form.handleSubmit()}
          disabled={isPending}
        >
          {isPending ? 'Guardando…' : 'Guardar'}
        </Button>
      </CardContent>
    </Card>
  );
};