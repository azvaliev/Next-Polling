import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => (
	<main className="flex flex-col h-screen gap-2 justify-center items-center">
		<Head>
			<title>Next Polling - Home</title>
		</Head>
		<h1 className="title">Welcome to Next Polling</h1>
		<h2 className="subtitle">Fast, seamless, and (most importantly) free</h2>
		<button type="button" className="btn btn-primary text-2xl mt-6">
			Create a poll
		</button>
	</main>
);

export default Home;
