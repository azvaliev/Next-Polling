import {
	Suspense, useMemo,
} from 'react';
import { GetServerSideProps } from 'next';

import useSWR from 'swr';
import Head from 'next/head';
import fetcher from '../../utils/fetcher';
import PollOptions, { PollQueryResponse } from '../../components/ViewPoll/PollOptions';

type ViewPollProps = {
	pid: string;
};

export default function Index({ pid }: ViewPollProps) {
	return (
		<>
			<Head>
				<title>
					Vote in the poll -
				</title>
			</Head>
			<main className="flex flex-col items-center justify-center h-screen">
				<Suspense fallback={<h1>loading...</h1>}>
					<ViewPoll pid={pid} />
				</Suspense>
			</main>
		</>
	);
}

const MS_IN_HOUR = 3.6e+6;
const MS_IN_MINUTE = 60000;
const MS_IN_SEC = 1000;
const SWRConfig: Parameters<typeof useSWR<PollQueryResponse>>[2] = {
	revalidateIfStale: true,
	revalidateOnMount: true,
	refreshWhenHidden: true,
	suspense: true,
	refreshInterval: 7 * MS_IN_SEC,
};

function ViewPoll({ pid }: ViewPollProps) {
	const { data, isValidating } = useSWR<PollQueryResponse>(
		`http://localhost:3000/api/polls?pid=${pid}`,
		fetcher,
		{
			suspense: true,
		},
	);

	const expiresAtString = useMemo(() => {
		if (!data?.expireAt) return null;
		return createFormatExpireAtString(data?.expireAt);

		/* eslint-disable react-hooks/exhaustive-deps */
	}, [data, isValidating]);

	const total = data?.responses?.reduce((sum, res) => sum + res, 0);

	return (
		<form className="relative flex items-center w-full h-screen">
			<PollOptions data={data || {}} total={total || 0}>
				<div
					className="flex-grow py-10 text-center bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-40"
				>
					<h1 className="text-3xl ">
						{data?.question}
					</h1>
					<h2 className="mt-2 text-xl font-thin">
						(
						{expiresAtString}
						)
					</h2>
				</div>
			</PollOptions>
			{/*
				<pre>
					{data && JSON.stringify(data, undefined, 2)}
				</pre>
          */}
		</form>
	);
}

function createFormatExpireAtString(expireAt: string): string {
	const date = new Date(expireAt);

	const now = Date.now();
	const expiresAt = date.getTime();

	const expiresIn = expiresAt - now;

	if (expiresIn < MS_IN_SEC) {
		return 'This poll has ended';
	}
	if ((expiresIn / MS_IN_MINUTE) < 1.5) {
		const remainingSeconds = Math.round(expiresIn / MS_IN_SEC);
		return `This poll expires in ${remainingSeconds} seconds`;
	}
	if (expiresIn / MS_IN_MINUTE < 90) {
		const remainingMinutes = Math.round(expiresIn / MS_IN_MINUTE);
		return `This poll expires in ${remainingMinutes} minutes`;
	}
	const remainingHours = Math.round(expiresIn / MS_IN_HOUR);
	const remainingMinutes = Math.round((expiresIn % MS_IN_HOUR) / MS_IN_MINUTE);
	return `This poll expires in ${remainingHours} hours ${remainingMinutes > 1 && `and ${remainingMinutes}`} minutes`;
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
