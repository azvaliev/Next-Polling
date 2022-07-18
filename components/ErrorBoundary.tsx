import { Component } from 'react';
import Custom404 from '../pages/404';

class ErrorBoundary extends Component {
	constructor(props: any) {
		super(props);

		// Define a state variable to track whether is an error or not
		this.state = { hasError: false };
	}

	/* eslint-disable @typescript-eslint/no-unused-vars  */
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
		if (this.state.hasError) {
			// You can render any custom fallback UI
			this.state.hasError = false;
			return (
				<Custom404 />
			);
		}

		// Return children components in case of no error

		return this.props.children;
	}
}

export default ErrorBoundary;
