import type { FC } from 'react';

import type { TierUpgrade } from './types';

interface Props {
  money: number
  upgradeTier?: TierUpgrade
  onClick: (upgradeTier: TierUpgrade) => void
}

export const UpgrageItem: FC<Props> = ({ money, upgradeTier, onClick }) => {
  if (!upgradeTier) {
    return (
      <span>MAX</span>
    );
  }

  return (
    <>
      <h4 className="consturction-menu__title">Upgrade</h4>
      <div className="construction-menu__list">
        <button
          className="construction-menu__button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick(upgradeTier);
          }}
          disabled={money < upgradeTier.cost}
        >
          {upgradeTier.name}
          <span className="construction-menu__cost">
            {upgradeTier.cost}
          </span>
        </button>
      </div>
    </>
  );
};
