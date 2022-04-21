import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="description" content="Fake e-commerce site" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
				<link href="https://fonts.googleapis.com/css2?family=Lato" rel="stylesheet" />

				<meta name="author" content="Antonio Zamora" />
				<meta
					name="keywords"
					content="e-commerce, fake, portfolio, front end development, Antonio"
				/>
				<meta name="language" content="English" />
				<meta name="revised" content="March 22nd, 2022" />
				<meta name="HandheldFriendly" content="true" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* <link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
