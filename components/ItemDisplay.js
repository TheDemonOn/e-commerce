import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/ItemDisplay.module.css'

export default function ItemDisplay({ products, display, sort }) {
	const [productDisplay, setProductDisplay] = useState(products)

	const sortTopReview = () => {
		let tempProducts = [...productDisplay]
		tempProducts.sort((a, b) => {
			return a.rating.rate - b.rating.rate
		})
		setProductDisplay(tempProducts)
	}

	const sortLowToHigh = () => {
		let tempProducts = [...productDisplay]
		tempProducts.sort((a, b) => {
			return a.price - b.price
		})
		setProductDisplay(tempProducts)
	}

	const sortHighToLow = () => {
		let tempProducts = [...productDisplay]
		tempProducts.sort((a, b) => {
			return b.price - a.price
		})
		setProductDisplay(tempProducts)
	}

	const sortFeatured = () => {
		setProductDisplay(products)
	}

	useEffect(() => {
		switch (sort) {
			case 'sortTopReview':
				sortTopReview()
				break
			case 'sortLowestPrice':
				sortLowToHigh()
				break
			case 'sortHighestPrice':
				sortHighToLow()
				break

			default:
				// Original sortFeatured
				sortFeatured()
				break
		}
	}, [sort])

	return (
		<>
			{/* Container for entire product display */}

			{productDisplay.map((product) => (
				<div className={styles.productCard} key={product.id}>
					<figure>
						<div className={styles.ImgContainer}>
							<img className={styles.ImgSize} src={product.image}></img>
						</div>

						<figcaption className={styles.title}>{product.title}</figcaption>
						{/* <div
							class="stars"
							style="--rating: 2.3;"
							style={{ ['--rating']: '2.3' }}
							aria-label="Rating of this product is 2.3 out of 5."
						></div> */}
						<h2>${product.price}</h2>
					</figure>
				</div>
			))}
		</>
	)
}
