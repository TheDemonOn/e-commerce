import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export async function getStaticPaths() {
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
			setHeadTitle(product.title.match(regex)[0] + "| Antonio's Store!")
		} else {
			// The title is less than 9 words.
			setHeadTitle(product.title + " | Antonio's Store!")
		}
	}, [])

	return (
		<>
			<Head>
				<title>{headTitle}</title>
				<meta name="description" content="Fake e-commerce site" />
			</Head>
			<div>This product is {product.title}</div>
		</>
	)
}
