// Next / React
import { DispatchWithoutAction, useReducer } from 'react';

const handleToggleBoolean = (prevState: boolean) => !prevState;

/**
 * Simple hook for easy toggling of a boolean value
 * @param initValue Initial boolean value
 */
const useToggle = (initValue: boolean): [
	boolean,
	DispatchWithoutAction,
] => {
	const [value, toggleValue] = useReducer(handleToggleBoolean, initValue);

	return [value, toggleValue];
};

export default useToggle;
