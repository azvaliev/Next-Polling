import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropogateLoader from 'react-spinners/PropagateLoader';

interface LoadingAnimProps extends React.PropsWithChildren {
	className?: string;
	isActive?: boolean;
}

export const LoadingAnim: React.FunctionComponent<LoadingAnimProps> = ({
	className,
	children,
	isActive,
}) => (
	<div className={`fixed z-10 top-0 ${className}`}>
		{ children }
		{isActive && (
			<PropogateLoader color={
				document && document.body.classList.contains('dark')
					? '#000' : '#fff'
			}
			/>
		)}
	</div>
);

LoadingAnim.defaultProps = {
	className: '',
	isActive: true,
};

interface ScreenLoadingAnimProps extends PropsWithChildren {
	isActive: boolean;
}

const ScreenLoadingAnim: React.FunctionComponent<ScreenLoadingAnimProps> = ({
	isActive,
	children,
}) => {
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
};

export default ScreenLoadingAnim;
