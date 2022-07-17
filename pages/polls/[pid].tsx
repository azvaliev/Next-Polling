import { Suspense } from 'react';
import { GetServerSideProps } from 'next';

import useSWR from 'swr';
import fetcher from '../../utils/fetcher';

type PollOptionProps = {
	tw: string;
	side: 'left' | 'right';
};

function PollOption({ tw, side }: PollOptionProps) {
	return (
		<div className={`fixed top-0 ${side}-0 z-0 w-1/2 h-screen ${tw} bg-opacity-30`}>
			<input type="submit" value="submit" />
		</div>
	);
}

export type PollQueryResponse = {
	question?: string;
	options?: string[];
	responses?: number[];
	error?: string;
};

type ViewPollProps = {
	pid: string;
};

function ViewPoll({ pid }: ViewPollProps) {
	const { data } = useSWR<PollQueryResponse>(`http://localhost:3000/api/polls?pid=${pid}`, fetcher, {
		suspense: true,
	});

	return (
		<form>
			<h1 className="absolute top-[15vh] text-3xl">{data?.question}</h1>
			<PollOption tw="bg-accent-primary-100" side="left" />
			<PollOption tw="bg-accent-secondary-100" side="right" />
			<div className="fixed top-0 right-0 z-0 w-1/2 h-screen bg-accent-secondary-100 bg-opacity-30" />
			<pre>
				{data && JSON.stringify(data, undefined, 2)}
			</pre>
		</form>
	);
}

export default function Index({ pid }: ViewPollProps) {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<Suspense fallback={<h1>loading...</h1>}>
				<ViewPoll pid={pid} />
			</Suspense>
		</main>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
	if (!params) {
		res.writeHead(404, 'Invalid poll id');
		return {
			props: {},
		};
	}
	const { pid } = params;

	if (!pid || Array.isArray(pid)) {
		res.writeHead(404, 'Invalid poll id');
		return {
			props: {},
		};
	}

	return {
		props: {
			pid,
		},
	};
};
