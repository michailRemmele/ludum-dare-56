export type Tower = {
  id: string
  name: string
  cost: number
};

export type TierUpgrade = {
  name: string
  weapon: Record<string, number>
  cost: number
};
