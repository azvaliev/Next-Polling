// Next / React
import ErrorPage from '../components/error-page';

function Custom500() {
	return (
		<ErrorPage
			statusCode={500}
			message="An internal server error occured. Apologies about any inconvenience"
		/>
	);
}

export default Custom500;
