// Next / React
import { createContext } from 'react';
import type { DispatchWithoutAction, Reducer } from 'react';

export type Theme = 'dark' | 'light';
export type ThemeReducer = Reducer<Theme, DispatchWithoutAction>;

export type ThemeContextData = {
	theme: Theme,
	toggleTheme: DispatchWithoutAction;
};

const context = createContext({} as ThemeContextData);
export default context;
