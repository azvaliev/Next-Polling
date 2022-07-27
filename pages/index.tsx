// Next / React
import Link from 'next/link';
import Head from 'next/head';

function Home() {
	return (
		<main className="flex flex-col h-screen gap-2 justify-center items-center">
			<Head>
				<title>Next Polling - Home</title>
			</Head>
			<h1 className="title">Welcome to Next Polling</h1>
			<h2 className="subtitle">Fast, seamless, and (most importantly) free</h2>

			<Link href="/polls/create" passHref>
				<button type="button" className="btn btn-primary text-2xl mt-6">
					Create a poll
				</button>
			</Link>
		</main>
	);
}

export default Home;
