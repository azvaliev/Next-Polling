// Next /React
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';

export type NavItemProps = PropsWithChildren & {
	display: string;
	link: string;
	isExternal?: boolean;
};

function NavItem({
	display,
	link,
	isExternal,
	children,
}: NavItemProps) {
	const router = useRouter();

	const isCurrentRoute = router.route === link;

	if (isExternal) {
		return (
			<a href={link} target="_blank" rel="noreferrer" className={`${isCurrentRoute && '!font-normal'}`}>
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
}

NavItem.defaultProps = {
	isExternal: false,
};

export default NavItem;
