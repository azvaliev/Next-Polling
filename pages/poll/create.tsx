import type { NextPage } from 'next';

import { useRouter } from 'next/router';
import { FormEventHandler } from 'react';
import ScreenLoadingAnim from '../../components/Loading';
import useToggle from '../../hooks/useToggle';

interface PollOptionProps {
	idx: number;
}

const PollOption: React.FunctionComponent<PollOptionProps> = ({ idx }: PollOptionProps) => (
	<input
		type="text"
		name="poll-response"
		aria-label={`Poll response option ${idx}`}
		placeholder="Poll response"
		className="block w-full text-xl py-3"
		required
	/>
);

interface ParsedFormData {
	question?: string;
	duration?: number;
	responseOptions?: string[];
}

const parseForm = (form: HTMLFormElement): ParsedFormData => {
	const formElements = form.elements;

	const { value: question } = formElements.namedItem('question') as HTMLInputElement;
	const { value: duration } = formElements.namedItem('duration') as HTMLInputElement;
	const responseOptions: string[] = [];

	const pollResponseOptionElements = formElements.namedItem('poll-response') as RadioNodeList;
	pollResponseOptionElements.forEach((pollResponseOptionElement) => {
		const { value } = pollResponseOptionElement as HTMLInputElement;
		if (!value) return;

		responseOptions.push(value);
	});

	if (responseOptions.length < 2) throw new Error('not enough poll response options provided');

	return {
		question,
		duration: parseInt(duration, 10),
		responseOptions,
	};
};

const CreatePoll: NextPage = () => {
	const router = useRouter();

	const [isLoading, toggleIsLoading] = useToggle(false);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		toggleIsLoading();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const reqData = parseForm(event.currentTarget);

		// TODO: Call API
		await new Promise((resolve) => {
			setTimeout(resolve, 50000);
		});

		toggleIsLoading();
		router.push('/');
	};

	return (
		<main className="flex flex-col gap-4 h-screen justify-center items-center">
			<ScreenLoadingAnim isActive={isLoading}>
				<h2 className="text-3xl text-center text-white dark:text-black">Creating poll...</h2>
			</ScreenLoadingAnim>
			<h1 className="title">Create your poll</h1>
			<h2 className="subtitle">Simply select desired options, and click submit</h2>
			<form
				className="flex flex-col items-center w-1/3 py-6"
				onSubmit={handleSubmit}
			>
				<input
					type="text"
					name="question"
					aria-label="Poll question"
					placeholder="What are you polling about?"
					className="w-full text-xl"
					// safe to use autofocus here as users are only coming
					// here after clicking to create a poll
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					required
				/>
				<fieldset className="poll-options w-full py-6">
					<PollOption idx={0} />
					<PollOption idx={1} />
				</fieldset>
				<input
					type="number"
					name="duration"
					aria-label="Poll duration: enter number of minutes"
					placeholder="Poll duration (minutes)"
					className="w-full text-xl mt-2"
					min={2}
					max={180}
					tabIndex={0}
					required
				/>
				<input
					type="submit"
					value="Submit"
					className="btn btn-primary text-3xl mt-8"
					tabIndex={0}
					disabled={isLoading}
				/>
			</form>
		</main>
	);
};

export default CreatePoll;
