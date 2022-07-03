import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FunctionComponent, PropsWithChildren } from 'react';

export interface NavItemProps extends PropsWithChildren {
	display: string;
	link: string;
	isExternal?: boolean;
}

const NavItem: FunctionComponent<NavItemProps> = ({
	display,
	link,
	isExternal,
	children,
}) => {
	const router = useRouter();

	const isCurrentRoute = router.route === link;

	if (isExternal) {
		return (
			<a href={link} rel="noopener" className={`${isCurrentRoute && '!font-normal'}`}>
				{display}
				{children}
			</a>
		);
	}

	return (
		<Link href={link} hrefLang="en" passHref>
			<span className={`${isCurrentRoute && '!font-normal'}`}>
				{display}
				{children}
			</span>
		</Link>
	);
};

NavItem.defaultProps = {
	isExternal: false,
};

export default NavItem;
