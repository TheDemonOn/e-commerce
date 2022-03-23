import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Product.module.css'
import Link from 'next/link'
import RatingDisplay from '../../components/RatingDisplay'

export async function getStaticPaths() {
	// This is the server executed function that will be used to prerender each page.
	const response = await fetch('https://fakestoreapi.com/products')
	const initialProducts = await response.json()

	const paths = initialProducts.map((product) => {
		return {
			params: {
				product: product.id.toString(),
			},
		}
	})

	return {
		paths,
		// If there is an invalid link then the 404 page will show.
		fallback: false,
	}
}

export async function getStaticProps({ params }) {
	const response = await fetch(`https://fakestoreapi.com/products/${params.product}`)
	const product = await response.json()
	return {
		props: {
			product,
		},
	}
}

export default function Product({ product }) {
	const [headTitle, setHeadTitle] = useState()

	// This regex matches 9 continous words separated by spaces, including the last space at the end.
	let regex = /^(?:.*? ){9}(?:(?!).)*/gm

	useEffect(() => {
		// Essentially this will only allow the product title up to 9 words or less be included in the title in its product page.
		if (product.title.match(regex)) {
			// The title is equal to or longer than 9 words.
			setHeadTitle(product.title.match(regex)[0] + '| Shop Antonio')
		} else {
			// The title is less than 9 words.
			setHeadTitle(product.title + ' | Shop Antonio')
		}
	}, [])

	const [imagePosition, setImagePosition] = useState()

	const svgStyle = {
		fill: 'none',
		stroke: '#6D6D6D',
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		strokeWidth: '33px',
	}

	return (
		<>
			<Head>
				<title>{headTitle}</title>
			</Head>

			<header>
				<nav className={styles.topNav}>
					<p>If</p>
					<p>there</p>
					<p>was</p>
					<p>more</p>
					<p>these</p>
					<p>would</p>
					<p>lead</p>
					<p>there</p>
				</nav>
				<div className={styles.banner}>
					<h3>This is where new deals would go!</h3>
				</div>
			</header>

			<nav className={styles.backNav}>
				<Link href="/">
					<a>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 175.86 152.15"
							width="13px"
							className={styles.svgArrow}
						>
							<line x1="22.41" y1="76.07" x2="158.05" y2="76.07" style={svgStyle} />
							<polyline points="75.64 18.26 17.81 76.1 75.59 133.88" style={svgStyle} />
						</svg>
						<span>Back to results</span>
					</a>
				</Link>
			</nav>

			<main className={styles.center}>
				<div className={styles.productDisplay}>
					<div className={styles.imgContainer}>
						<Image src={product.image} layout="fill" objectFit="contain"></Image>
					</div>
					<div className={styles.productInfo}>
						<h3>{product.title}</h3>
						<h2 className={styles.price}>${product.price}</h2>

						<button>Add to cart</button>
						<div className={styles.stars}>
							<RatingDisplay rating={product.rating.rate} />({product.rating.count})
						</div>
						<p>
							<b>Description</b>
						</p>
						<p>{product.description}</p>
					</div>
				</div>
			</main>
		</>
	)
}
