/* eslint-disable react/destructuring-assignment */
// Next / React
import { Component } from 'react';

// Components
import Custom500 from '../pages/500';

type ErrorBoundaryState = {
	hasError?: boolean;
};

class ErrorBoundary extends Component<any, ErrorBoundaryState> {
	constructor(props: any) {
		super(props);

		// Define a state variable to track whether is an error or not
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error: Error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: any) {
		// You can use your own error logging service here
		console.error({ error, errorInfo });
	}

	render() {
		// Check if the error is thrown
		// eslint-disable-next-line react/destructuring-assignment
		if (this.state.hasError) {
			// You can render any custom fallback UI
			this.setState({ hasError: false });
			return (
				<Custom500 />
			);
		}

		// Return children components in case of no error

		return this.props.children;
	}
}

export default ErrorBoundary;
