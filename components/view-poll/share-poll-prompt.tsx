// Next / React
import { useRouter } from 'next/router';
import { useRef } from 'react';

type SharePollPromptProps = {
	baseURL: string;
	pid: string;
};

const matchURLMethodRegExp = /http(s)?:\/\//;

function SharePollPrompt({ baseURL, pid }: SharePollPromptProps) {
	const router = useRouter();
	const copyBtnRef = useRef<HTMLButtonElement | null>(null);

	const link = `${baseURL.replace(matchURLMethodRegExp, '')}${router.pathname.replace('[pid]', pid)}`;

	const handleCopyLink = (): void => {
		if (typeof window === 'undefined') {
			return;
		}
		const prefix = window.location.host.includes('localhost') ? 'http://' : 'https://';
		navigator.clipboard.writeText(`${prefix}${link}`);

		// Didn't want to trigger any kind of rerender just to update this simple style
		if (copyBtnRef.current) {
			copyBtnRef.current.style.opacity = '0.7';
			setTimeout(() => {
				if (copyBtnRef.current) {
					copyBtnRef.current.style.opacity = '';
				}
			}, 250);
		}
	};

	return (
		<div className="px-6 py-4 mx-12 mt-6 font-light bg-gray-100 dark:bg-zinc-900 w-fit rounded-md">
			<span className="block mb-2">
				Know someone who&apos;d like to participate? Send them this link
			</span>
			<span className="flex items-center justify-between text-accent-primary-100">
				{link}
				<button
					type="button"
					className="bg-gray-400 opacity-100 dark:bg-slate-700 btn hover:opacity-90 active:opacity-80 transition-opacity "
					title="Copy to clipboard"
					aria-label="select to copy poll link to clipboard"
					onClick={handleCopyLink}
					ref={copyBtnRef}
				>
					<svg
						focusable="false"
						aria-hidden="true"
						viewBox="0 0 24 24"
						className="w-4 h-4 fill-gray-100"
					>
						<path
							d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
						/>
					</svg>
				</button>
			</span>
		</div>
	);
}

export default SharePollPrompt;
