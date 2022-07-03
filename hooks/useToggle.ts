import { DispatchWithoutAction, useReducer } from 'react';

const handleToggleBoolean = (prevState: boolean) => !prevState;

const useToggle = (initValue: boolean): [
	boolean,
	DispatchWithoutAction,
] => {
	const [value, toggleValue] = useReducer(handleToggleBoolean, initValue);

	return [value, toggleValue];
};

export default useToggle;
