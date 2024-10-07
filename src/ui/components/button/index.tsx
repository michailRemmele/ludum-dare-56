import type { FC, ReactNode, CSSProperties } from 'react';

import './style.css';

export interface ButtonProps {
  children: ReactNode
  onClick: () => void
  styles?: CSSProperties
}

export const Button: FC<ButtonProps> = ({ children, onClick, styles }) => (
  <button style={styles} className="button" type="button" onClick={onClick}>{children}</button>
);
