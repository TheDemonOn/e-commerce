import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/ItemDisplay.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function ItemDisplay({ products, range, sort, custom }) {
	const [product, setProduct] = useState(products)

	const [productDisplay, setProductDisplay] = useState(product)

	useEffect(() => {
		setProduct([...products])
	}, [products])

	useEffect(() => {
		// First the
		let tempItems = [...products]
		switch (range) {
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
	}, [range, custom])

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

	if (productDisplay.length === 0) {
		return <>Sorry no results.</>
	}

	return (
		<>
			{/* Container for entire product display */}
			{productDisplay.map((product) => (
				<div className={styles.productCard} key={product.id}>
					<Link href={`/product/${encodeURIComponent(product.id)}`}>
						<div className={styles.insideCard}>
							<div className={styles.ImgContainer}>
								<Image
									className={styles.ImgSize}
									src={product.image}
									layout="fill"
									objectFit="contain"
								></Image>
							</div>
							<div className={styles.productInfo}>
								<div className={styles.title}>{product.title}</div>
								{/* <div
							class="stars"
							style="--rating: 2.3;"
							style={{ ['--rating']: '2.3' }}
							aria-label="Rating of this product is 2.3 out of 5."
							></div> */}
								<h2>${product.price}</h2>
							</div>
						</div>
					</Link>
				</div>
			))}
		</>
	)
}
