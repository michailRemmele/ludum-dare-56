export type Tower = {
  id: string
  name: string
  cost: number
  imageUrl: string
};

export type TierUpgrade = {
  name: string
  weapon: Record<string, number>
  cost: number
};
