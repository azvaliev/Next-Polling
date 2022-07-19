// Next / React
import {
	PropsWithChildren, useMemo, createContext, useContext,
} from 'react';

// Types
import type { Winner } from './display-victors';

export type PollQueryResponse = {
	question?: string;
	options?: string[];
	responses?: number[];
	error?: string;
	expireAt?: string;
};

type PollOptionsProps = PropsWithChildren & {
	data: PollQueryResponse,
	total: number,
	canVote: boolean;
	winner: Winner | null;
};

type SideSplit = [number, number];
const DEFAULT_SIDE_SPLIT: SideSplit = [33, 33];
const DEFAULT_TOTAL = 0;

const PollDataContext = createContext<PollQueryResponse & {
	total: number;
	sideSplit: SideSplit,
	canVote: boolean,
}>({
	total: DEFAULT_TOTAL,
	sideSplit: DEFAULT_SIDE_SPLIT,
	canVote: false,
});

export default function PollOptions({
	data,
	total,
	canVote,
	winner,
	...props
}: PollOptionsProps) {
	// This determines what % each side block will take up
	const sideSplit: SideSplit = useMemo(() => {
		if (!data || !data.responses) return [33, 33];
		let [sideOne, sideTwo] = data.responses;
		sideOne = Math.round((sideOne * 100) / (sideOne + sideTwo));
		sideTwo = 100 - sideOne;

		return [sideOne * 0.5, sideTwo * 0.5];
	}, [data]);

	const contextData = useMemo(() => ({
		...data,
		canVote: winner ? false : canVote,
		total,
		sideSplit,
	}), [data, total, canVote, winner, sideSplit]);

	return (
		<PollDataContext.Provider value={contextData}>
			<PollOption
				idx={0}
				tw="bg-accent-primary-100"
				twBtn="hover:bg-accent-primary-100 border-accent-primary-100"
			/>
			{props.children}
			<PollOption
				idx={1}
				tw="bg-accent-secondary-100"
				twBtn="hover:bg-accent-secondary-100 border-accent-secondary-100"
			/>
		</PollDataContext.Provider>
	);
}

enum Side {
	'left',
	'right',
}

type PollOptionProps = {
	/**
   * idx: The index of this Poll Option in the options and responses lists
   */
	idx: number;
	/**
   * tw: TailwindCSS classes for surrounding div
   */
	tw: string;
	/**
   * twBtn: TailwindCSS classes for vote submit button
   */
	twBtn: string;
};

function PollOption({
	idx, tw, twBtn,
}: PollOptionProps) {
	const {
		options,
		responses,
		total,
		sideSplit,
		canVote,
	} = useContext(PollDataContext);

	const responseOption = options ? options[idx] : '';
	const numVotes = responses ? responses[idx] : 0;
	const side = Side[idx];

	const votesPercent = Math.round(100 * (numVotes / total)) || 0;

	return (
		<div
			className={`
        flex justify-center items-center relative top-0 z-0 h-screen 
        bg-opacity-30 hover:bg-opacity-40 transition-smooth
        ${side === 'left' ? 'left-0' : 'right-0'} ${tw} 
      `}
			style={{ width: `${sideSplit[idx]}%`, minWidth: '20%' }}
		>
			<button
				className={`
          border-2 text-2xl py-2 px-8 rounded-md shadow-lg
          hover:cursor-pointer active:border-none focus:outline-black
          ${twBtn} 
        `}
				type="submit"
				value={idx}
				aria-label={`Vote for ${responseOption}`}
				name="vote"
				disabled={!canVote}
			>
				{responseOption}
			</button>
			<div className="absolute w-full text-center bottom-10">
				<h2 className="text-3xl font-light">
					{`${numVotes} votes`}
				</h2>
				<h3 className="text-xl font-thin">
					{`(${votesPercent}%)`}
				</h3>
			</div>
		</div>
	);
}
