import Link from 'next/link';

const Custom404 = () => (
	<main className="flex flex-col h-screen justify-center items-center">
		<h1 className="flex flex-row items-center text-3xl h-fit">
			<span className="font-bold">404</span>
			<span className="text-5xl font-thin" aria-hidden>&nbsp;|&nbsp;</span>
			<span className="font-extralight">This page doesn&apos;t exist</span>
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

export default Custom404;
