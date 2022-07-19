// Next / React
import { useRouter } from 'next/router';
import { FormEventHandler } from 'react';

// Utils
import useToggle from '../../hooks/use-toggle';

// Components
import { LoadingScreen } from '../../components/loading';

type PollOptionProps = {
	idx: number;
};

function PollOption({ idx }: PollOptionProps) {
	return (
		<input
			type="text"
			name="poll-response"
			aria-label={`Poll response option ${idx}`}
			placeholder="Poll response"
			className="block w-full py-3 text-xl"
			required
		/>
	);
}

type ParsedFormData = {
	question?: string;
	duration?: number;
	responseOptions?: string[];
};

const parseForm = (form: HTMLFormElement): ParsedFormData => {
	const formElements = form.elements;

	const { value: question } = formElements.namedItem('question') as HTMLInputElement;
	const { value: duration } = formElements.namedItem('duration') as HTMLInputElement;
	const responseOptions: string[] = [];

	const pollResponseOptionElements = formElements.namedItem('poll-response') as RadioNodeList;
	pollResponseOptionElements.forEach((pollResponseOptionElement) => {
		const { value } = pollResponseOptionElement as HTMLInputElement;
		if (!value) return;

		responseOptions.push(value.trim());
	});

	if (responseOptions.length < 2) throw new Error('not enough poll response options provided');

	return {
		question: question.trim(),
		duration: parseInt(duration, 10),
		responseOptions,
	};
};

type CreatePollResponse = {
	ID: string;
};

function CreatePoll() {
	const router = useRouter();

	const [isLoading, toggleIsLoading] = useToggle(false);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		toggleIsLoading();

		const reqData = parseForm(event.currentTarget);

		// TODO: Call API
		const response = await fetch('/api/polls', {
			method: 'POST',
			body: JSON.stringify(reqData),
		});

		if (response.status !== 201) {
			const errorMessage = await response.text();

			toggleIsLoading();
			console.error('Recieved status code:', response.status, errorMessage);
			return;
		}

		const result = await response.json() as CreatePollResponse;

		// Setting up a query string so that when a poll creator is redirected
		// to the view poll page, the data is already filled in and there isn't
		// an additional loading screen
		const { question, responseOptions, duration } = reqData;
		const [optOne, optTwo] = responseOptions as string[];

		const expireAt = new Date();
		const pollDuration = duration as number;
		expireAt.setMinutes(expireAt.getMinutes() + pollDuration);

		const newRoute = `/polls/${result.ID}?${new URLSearchParams({
			question: question as string,
			optOne,
			optTwo,
			expireAt: expireAt.toUTCString(),
		})}`;
		toggleIsLoading();
		router.push(newRoute);
	};

	return (
		<main className="flex flex-col items-center justify-center h-screen gap-4">
			<LoadingScreen isActive={isLoading}>
				<h2 className="text-3xl text-center text-white dark:text-black">Creating poll...</h2>
			</LoadingScreen>
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
				<fieldset className="w-full py-6 poll-options">
					<PollOption idx={0} />
					<PollOption idx={1} />
				</fieldset>
				<input
					type="number"
					name="duration"
					aria-label="Poll duration: enter number of minutes"
					placeholder="Poll duration (minutes)"
					className="w-full mt-2 text-xl"
					min={2}
					max={180}
					tabIndex={0}
					required
				/>
				<input
					type="submit"
					value="Submit"
					className="mt-8 text-3xl btn btn-primary"
					tabIndex={0}
					disabled={isLoading}
				/>
			</form>
		</main>
	);
}
export default CreatePoll;
