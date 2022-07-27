import { BarLoader } from 'react-spinners';

function LoadingText() {
	let color: '#fff' | '#000';
	if (typeof document !== 'undefined' && !document.body.classList.contains('dark')) {
		color = '#000';
	} else {
		color = '#fff';
	}

	return (
		<>
			<h1 className="mb-4 text-2xl">Loading...</h1>
			<BarLoader color={color} width="15%" />
		</>
	);
}

export default LoadingText;
