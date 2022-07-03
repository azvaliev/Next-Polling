import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropogateLoader from 'react-spinners/PropagateLoader';

interface LoadingAnimProps extends React.PropsWithChildren {
	className?: string;
}

export const LoadingAnim: React.FunctionComponent<LoadingAnimProps> = ({ className, children }) => (
	<div className={`fixed z-10 top-0 ${className}`}>
		{ children }
		<PropogateLoader />
	</div>
);

LoadingAnim.defaultProps = {
	className: '',
};

const ScreenLoadingAnim: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		return () => {
			setIsMounted(false);
		};
	}, []);

	return isMounted ? createPortal(
		<LoadingAnim className="
			flex flex-col gap-8 justify-center items-center h-screen w-full
			bg-black dark:bg-white !bg-opacity-80 p-12
		"
		>
			{children}
		</LoadingAnim>,
		document.querySelector('.dialog')!,
	) : null;
};

export default ScreenLoadingAnim;
