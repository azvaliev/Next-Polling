// Utils
import { Winner, DEF_WINNER } from './display-victors';

const MS_IN_HOUR = 3.6e+6;
const MS_IN_MINUTE = 60000;
const MS_IN_SEC = 1000;

function createFormatExpireAtString(expireAt: string): [boolean, string] {
	let isExpired = false;
	let message = '';

	const date = new Date(expireAt);

	const now = Date.now();
	const expiresAt = date.getTime();

	const expiresIn = expiresAt - now;

	// Here we compare the time and accordingly assign a string
	if (expiresIn < MS_IN_SEC) {
		isExpired = true;
		message = 'This poll has ended';
	} else if ((expiresIn / MS_IN_MINUTE) < 1.5) {
		const remainingSeconds = Math.round(expiresIn / MS_IN_SEC);
		message = `This poll ends in ${remainingSeconds} seconds`;
	} else if (expiresIn / MS_IN_MINUTE < 90) {
		const remainingMinutes = Math.round(expiresIn / MS_IN_MINUTE);
		message = `This poll ends in ${remainingMinutes} minutes`;
	} else {
		const remainingHours = Math.round(expiresIn / MS_IN_HOUR);
		const remainingMinutes = Math.round((expiresIn % MS_IN_HOUR) / MS_IN_MINUTE);
		message = `This poll ends in ${remainingHours} hours ${remainingMinutes > 1 && `and ${remainingMinutes}`} minutes`;
	}

	return [isExpired, message];
}

function determineWinner(responses: number[]) {
	// This is really more about determining whether there is a tie
	return responses?.reduce<Winner>((winner, currentVal, currentIdx) => {
		if (winner.votes < currentVal) {
			return {
				idx: [currentIdx],
				votes: currentVal,
			};
		} if (winner.votes === currentVal) {
			return {
				...winner,
				idx: Array.isArray(winner.idx) ? [...winner.idx, currentIdx] : [winner.idx, currentIdx],
			};
		}
		return winner;
	}, DEF_WINNER) || DEF_WINNER;
}

export {
	createFormatExpireAtString,
	determineWinner,
	MS_IN_HOUR,
	MS_IN_MINUTE,
	MS_IN_SEC,
};

export default {};
