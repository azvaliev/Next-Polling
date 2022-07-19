// Next / React
import {
	Suspense, useMemo, useState,
} from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

// Lib
import useSWR from 'swr';

// Utils
import fetcher from '../../utils/fetcher';

// Components
import {
	createFormatExpireAtString,
	determineWinner,
	MS_IN_SEC,
} from '../../components/view-poll/utils';
import PollOptions, { PollQueryResponse } from '../../components/view-poll/poll-options';
import DisplayVictors from '../../components/view-poll/display-victors';
import { LoadingText } from '../../components/loading';
import SharePollPrompt from '../../components/view-poll/share-poll-prompt';

type ViewPollProps = {
	pid: string;
	canVote: boolean;
	initialPollData?: PollQueryResponse;
	host?: string;
};

export default function Index(props: ViewPollProps) {
	return (
		<>
			<Head>
				<title>
					Vote in the poll -
				</title>
			</Head>
			<main className="flex flex-col items-center justify-center h-screen">
				<Suspense fallback={<LoadingText />}>
					<ViewPoll {...props} />
				</Suspense>
			</main>
		</>
	);
}

Index.defaultProps = {
	initialPollData: undefined,
	host: '',
};

const SWRConfig: Parameters<typeof useSWR<PollQueryResponse>>[2] = {
	revalidateIfStale: true,
	revalidateOnMount: true,
	refreshWhenHidden: true,
	suspense: true,
	refreshInterval: 7 * MS_IN_SEC,
};

function ViewPoll({
	pid, canVote, host, initialPollData,
}: ViewPollProps) {
	const [hasEnded, setHasEnded] = useState(false);
	const { data, isValidating } = useSWR<PollQueryResponse>(
		`http://localhost:3000/api/polls?pid=${pid}`,
		fetcher,
		{
			...SWRConfig,
			fallbackData: initialPollData,
		},
	);

	const expiresAtString = useMemo(() => {
		if (!data?.expireAt) return null;
		const [isExpired, message] = createFormatExpireAtString(data?.expireAt);

		// Only set the state if it wasn't known that the poll was ended already
		if (isExpired && hasEnded === false) {
			setHasEnded(true);
		}

		return message;
		// We disable the eslint rule here, as I want the time to update every couple
		// seconds, and batching it with isValidating is useful
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [data, isValidating]);

	const total = data?.responses?.reduce((sum, res) => sum + res, 0);

	const currentWinner = determineWinner(data?.responses || []);
	const { options } = data as PollQueryResponse;

	return (
		<form
			className="relative flex items-center w-full h-screen"
		>
			<PollOptions
				data={data || {}}
				total={total || 0}
				canVote={canVote && !hasEnded}
				winner={hasEnded ? currentWinner : null}
			>
				<div
					className="flex-grow py-10 text-center bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-40"
				>
					<h1 className="text-4xl">
						{data?.question}
					</h1>
					{/* if the poll has ended, don't display the timewhen the poll is ending */}
					{
						!hasEnded ? (
							<h2 className="mt-2 text-xl font-thin">
								{`(${expiresAtString})`}
							</h2>
						)
							: (
								<DisplayVictors options={options} results={currentWinner} />
							)
					}
					{!hasEnded && <SharePollPrompt host={host || ''} />}
				</div>
			</PollOptions>
		</form>
	);
}

ViewPoll.defaultProps = Index.defaultProps;

export const getServerSideProps: GetServerSideProps = async ({
	params, query, req, res,
}) => {
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

	const canVote = req.cookies[pid] === undefined;

	const {
		expireAt, question, optOne, optTwo,
	} = query;

	// Validate that all query strings are present and correct type
	// This is so that the creator of a poll does not need to witness
	// a loading screen after they just entered the poll information
	if (
		typeof expireAt === 'string'
    && typeof question === 'string'
    && typeof optOne === 'string'
    && typeof optTwo === 'string'
	) {
		const initialPollData: PollQueryResponse = {
			question,
			options: [optOne, optTwo],
			responses: [0, 0],
			expireAt,
		};
		return {
			props: {
				pid,
				canVote,
				initialPollData,
				host: req.headers.host || '',
			},
		};
	}

	return {
		props: {
			pid,
			canVote,
			host: req.headers.host || '',
		},
	};
};
