import type { FC, ReactNode } from 'react';

import './style.css';

export interface ButtonProps {
  children: ReactNode
  onClick: () => void
  styles: any
}

export const Button: FC<ButtonProps> = ({ children, onClick, styles }) => (
  <button style={styles} className="button" type="button" onClick={onClick}>{children}</button>
);
