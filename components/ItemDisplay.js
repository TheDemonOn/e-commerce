import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/ItemDisplay.module.css'

export default function ItemDisplay({ products, items, sort, custom }) {
	const [product, setProduct] = useState(products)

	const [productDisplay, setProductDisplay] = useState(product)

	useEffect(() => {
		// First the
		let tempItems = [...products]
		switch (items) {
			case 'underTen':
				setProduct(tempItems.filter((item) => item.price < 10))
				break
			case 'tenToTwentyFive':
				setProduct(tempItems.filter((item) => item.price >= 10 && item.price <= 25))
				break
			case 'twentyFiveToOneHundred':
				setProduct(tempItems.filter((item) => item.price >= 25 && item.price <= 100))
				break
			case 'oneHundredToFiveHundred':
				setProduct(tempItems.filter((item) => item.price >= 100 && item.price <= 500))
				break
			case 'overFiveHundred':
				setProduct(tempItems.filter((item) => item.price > 500))
				break

			case 'customRadio':
				setProduct(tempItems.filter((item) => item.price >= custom[0] && item.price <= custom[1]))
				break

			default:
				setProduct(products)
				break
		}
	}, [items, custom])

	const sortTopReview = () => {
		let tempProducts = [...product]
		tempProducts.sort((a, b) => {
			return a.rating.rate - b.rating.rate
		})
		setProductDisplay(tempProducts)
	}

	const sortLowToHigh = () => {
		let tempProducts = [...product]
		tempProducts.sort((a, b) => {
			return a.price - b.price
		})
		setProductDisplay(tempProducts)
	}

	const sortHighToLow = () => {
		let tempProducts = [...product]
		tempProducts.sort((a, b) => {
			return b.price - a.price
		})
		setProductDisplay(tempProducts)
	}

	const sortFeatured = () => {
		setProductDisplay(product)
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
	}, [product, sort])

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
