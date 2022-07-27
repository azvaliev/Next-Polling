// Next / React
import ErrorPage from '../components/error-page';

function Custom404() {
	return (
		<ErrorPage
			statusCode={404}
			message="This page doesn't exist"
		/>
	);
}

export default Custom404;
