// Next / React
import Link from 'next/link';

type ErrorPageProps = {
	statusCode: number;
	message: string;
};

function ErrorPage({
	statusCode,
	message,
}: ErrorPageProps) {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1 className="flex flex-row items-center text-3xl h-fit">
				<span className="font-bold">{statusCode}</span>
				<span className="text-5xl font-thin" aria-hidden>&nbsp;|&nbsp;</span>
				<span className="font-extralight">{message}</span>
			</h1>
			<Link href="/">
				<button
					type="button"
					className={`
				btn text-2xl mt-8 border-[1px] border-black dark:bg-white dark:text-black
				hover:bg-black hover:text-white dark:hover:bg-gray-200 transition-colors
			`}
				>
					Take me home
				</button>
			</Link>

		</main>
	);
}

export default ErrorPage;
