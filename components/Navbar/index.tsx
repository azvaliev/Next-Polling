import { useContext } from 'react';

import { DarkModeIcon, GithubIcon, LightModeIcon } from './icons';
import NavItem, { NavItemProps } from './item';
import ThemeContext from '../../context/theme';

const navItemsData: NavItemProps[] = [
	{
		display: 'Home',
		link: '/',
	}, {
		display: 'Create a poll',
		link: '/poll/create',
	}, {
		display: 'Github',
		link: 'foo',
		isExternal: true,
		children: <GithubIcon />,
	},
];

const Navbar: React.FunctionComponent = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);

	return (
		<nav className="nav">
			<h2>
				Next Polling 🚀
			</h2>
			{
				navItemsData.map((navItemData) => (
					<NavItem key={navItemData.display} {...navItemData} />
				))
			}
			{
				theme === 'light'
					? <DarkModeIcon onClick={toggleTheme} />
					:	<LightModeIcon onClick={toggleTheme} />
			}
		</nav>
	);
};

export default Navbar;
