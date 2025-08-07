import type { ThemeContextType } from '@/types';
import { createContext } from 'react';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
