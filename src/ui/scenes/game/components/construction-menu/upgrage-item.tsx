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
      <div className="construction-menu__list construction-menu__list_upgrage">
        <button
          className="construction-menu__button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick(upgradeTier);
          }}
          disabled={money < upgradeTier.cost}
        >
          <div className="construction-menu__wrapper">
            <div className="construction-menu__tower">
              <img
                className="construction-menu__image construction-menu__image_upgrage"
                src="./images/upgrade-icon.png"
                alt={upgradeTier.name}
              />
              <span className="construction-menu__label">{upgradeTier.name}</span>
            </div>
            <span className="construction-menu__cost">
              {upgradeTier.cost}
            </span>
          </div>
        </button>
      </div>
    </>
  );
};
