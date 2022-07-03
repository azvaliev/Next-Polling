import type { DispatchWithoutAction, Reducer } from 'react';

import { createContext } from 'react';

export type Theme = 'dark' | 'light';
export type ThemeReducer = Reducer<Theme, DispatchWithoutAction>;

export interface ThemeContextData {
	theme: Theme,
	toggleTheme: DispatchWithoutAction;
}

const context = createContext({} as ThemeContextData);
export default context;
