import {
	Html, Head, Main, NextScript,
} from 'next/document';

const Document = () => (
	<Html>
		<Head />
		<body className="dark">
			<Main />
			<dialog className="dialog" />
			<NextScript />
		</body>
	</Html>
);

export default Document;
