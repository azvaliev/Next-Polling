import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BarLoader } from 'react-spinners';

type ScreenLoadingAnimProps = PropsWithChildren & {
	isActive: boolean;
};

function ScreenLoadingAnim({
	isActive,
	children,
}: ScreenLoadingAnimProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		return () => {
			setIsMounted(false);
		};
	}, []);

	return isMounted ? createPortal(
		<LoadingAnim
			className={`
			flex flex-col gap-8 justify-center items-center h-screen w-full p-12
			bg-black dark:bg-white !bg-opacity-80 
			${!isActive ? 'hidden' : 'animate-fadein'}
		`}
			isActive={isActive}
		>
			{isActive && children}
		</LoadingAnim>,
		document.querySelector('.dialog')!,
	) : null;
}

export default ScreenLoadingAnim;

type LoadingAnimProps = React.PropsWithChildren & {
	className?: string;
	isActive?: boolean;
};

function LoadingAnim({
	className,
	children,
	isActive,
}: LoadingAnimProps) {
	let barLoaderColor: '#000' | '#fff';
	if (typeof document !== 'undefined' && !document.body.classList.contains('dark')) {
		barLoaderColor = '#fff';
	} else {
		barLoaderColor = '#000';
	}

	return (
		<div className={`fixed z-10 top-0 ${className}`}>
			{ children }
			{isActive && (
				<BarLoader color={barLoaderColor} />
			)}
		</div>
	);
}

LoadingAnim.defaultProps = {
	className: '',
	isActive: true,
};
