// Next / React
import type { AppProps } from 'next/app';
import {
	DispatchWithoutAction,
	useEffect,
	useMemo,
	useReducer,
} from 'react';

// Utils
import type { Theme, ThemeContextData, ThemeReducer } from '../context/theme';
import ThemeContext from '../context/theme';

// Components
import ErrorBoundary from '../components/error-boundary';
import Navbar from '../components/navbar';

// Styles
import '../styles/globals.css';
import '../styles/nav.css';

const updateTheme = (theme: Theme) => {
	if (theme === 'dark') {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
};

const handleToggleTheme = (prevTheme: Theme): Theme => {
	const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
	updateTheme(newTheme);
	return newTheme;
};

const determineInitialTheme = () => {
	const themePref = localStorage.getItem('theme-pref');
	if (!themePref) {
		updateTheme('dark');
		return;
	}
	if (themePref !== 'dark' && themePref !== 'light') {
		updateTheme('dark');
		return;
	}
	updateTheme(themePref);
};

function MyApp({ Component, pageProps }: AppProps) {
	const [themeState, toggleTheme] = useReducer<ThemeReducer>(
		handleToggleTheme,
		'dark',
	);

	const themeContextData = useMemo<ThemeContextData>(() => ({
		theme: themeState,
		toggleTheme: toggleTheme as DispatchWithoutAction,
	}), [themeState, toggleTheme]);

	useEffect(() => {
		determineInitialTheme();
	}, []);

	return (
		<>
			<ThemeContext.Provider value={themeContextData}>
				<Navbar />
			</ThemeContext.Provider>
			<ErrorBoundary>
				<Component {...pageProps} />
			</ErrorBoundary>
		</>
	);
}

export default MyApp;
