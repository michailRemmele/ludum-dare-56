export interface EffectScript {
  apply(): void;
  onCancel(): void;
}
