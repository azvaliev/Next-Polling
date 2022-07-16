import { Suspense } from 'react';

import useSWR from 'swr';
import fetcher from '../../utils/fetcher';

import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';


type PollQueryResponse = {
	question?: string;
	options?: string[];
  responses?: number[];
  error?: string;
}

type ViewPollProps = {
  pid?: string;
}

const ViewPoll = ({ pid }: ViewPollProps) => {
  const { data, error } = useSWR<PollQueryResponse>(
    `http://localhost:3000/api/polls?pid=${pid}`,
    fetcher, 
    {
      refreshInterval: 10000,
      suspense: true 
    }
  );

	return (
		<pre>
			{data && JSON.stringify(data, undefined, 2)}
		</pre>
	);
};

ViewPoll.defaultProps = {
	question: '',
	options: [],
	responses: [],
};

type ViewProps = {
  pid: string;
}

const View = ({ pid }: ViewProps) => {
	return typeof document !== 'undefined' ? (
		<main className="flex h-screen justify-center items-center">
			<Suspense fallback={<h1>loading...</h1>}>
				<ViewPoll pid={pid} />
			</Suspense>
		</main>
	): null;
};

export default View;

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

// // export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {

// 	return {
// 		props: {
// 			pid,
// 		},
// 	};
// };

// // 	const reqParams = new URLSearchParams({
// // 		pid,
// // 	});

// // 	const urlPrefix = process.env.local === 'true' ? 'http://' : 'https://';
// // 	const apiEndpoint = `${urlPrefix}${req.headers.host}/api/polls?${reqParams}`;

// 	console.log(apiEndpoint);
// 	try {
// 		const response = await fetch(apiEndpoint, {
// 			method: 'GET',
// 		});
// 		const result: any = await response.text();
// 		console.log(result);
// 		return {
// 			props: {
// 				result,
// 			},
// 		};
// 	} catch (err) {
// 		console.error(err);
// 		res.writeHead(500, 'Failed to retrive poll');
// 		return {
// 			props: {},
// 		};
// 	}
// };
