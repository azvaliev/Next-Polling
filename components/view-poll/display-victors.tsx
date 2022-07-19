// Types
import type { PollQueryResponse } from './poll-options';

export type Winner = {
	idx: number[] | number;
	votes: number;
};
export const DEF_WINNER: Winner = {
	idx: -1,
	votes: 0,
};

type DisplayVictorsProps = {
	results: Winner;
	options: PollQueryResponse['options'];
};

export default function DisplayVictors({ options, results }: DisplayVictorsProps) {
	if (!options) {
		return null;
	}

	return (
		<h3 className="mt-3 text-2xl font-thin">
			The result is&nbsp;
			{
				Array.isArray(results.idx)
					? 'a tie'
					: `${options[results.idx]} is the victor ${results.votes}`
			}
		</h3>
	);
}
