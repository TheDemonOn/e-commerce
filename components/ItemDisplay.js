import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/ItemDisplay.module.css'
import Image from 'next/image'
import Link from 'next/link'
import RatingDisplay from './RatingDisplay.js'

export default function ItemDisplay({ products, range, sort, custom, productDisplayCount }) {
	// For the initial load, in order to prevent the original default sort of "sortFeatured", then rewriting it to be whatever is currently selected, a check is placed to ensure that the items do not display until a sort option has been properly selected from either localStorage or otherwise.
	const [initialLoad, setInitialLoad] = useState(0)

	const [product, setProduct] = useState(products)
	// productDisplay should be sent back to the parent to display coorect amount of items
	const [productDisplay, setProductDisplay] = useState(product)

	useEffect(() => {
		// This will update the product count on the home
		productDisplayCount(productDisplay.length)
	}, [productDisplay])

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
	}, [range, custom, products, sort])

	const sortTopReview = () => {
		let tempProducts = [...product]
		tempProducts.sort((a, b) => {
			return b.rating.rate - a.rating.rate
		})
		setProductDisplay(tempProducts)
		setInitialLoad(1)
	}

	const sortLowToHigh = () => {
		let tempProducts = [...product]
		tempProducts.sort((a, b) => {
			return a.price - b.price
		})
		setProductDisplay(tempProducts)
		setInitialLoad(1)
	}

	const sortHighToLow = () => {
		let tempProducts = [...product]
		tempProducts.sort((a, b) => {
			return b.price - a.price
		})
		setProductDisplay(tempProducts)
		setInitialLoad(1)
	}

	const sortFeatured = () => {
		setProductDisplay(product)
		setInitialLoad(1)
	}

	useEffect(() => {
		if (sort) {
			// A sort option has been selected
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
		} else {
			// There is no current sort.
			// Attempt to retrieve the sort from localStorage, if it doesn't exist it will default to sortFeatured.
			let local = localStorage.getItem('sortOption')
			switch (local) {
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
		}
	}, [product, sort])

	if (productDisplay.length === 0) {
		return <>Sorry no results.</>
	}

	if (initialLoad) {
		return (
			<>
				{/* Container for entire product display */}
				{productDisplay.map((product) => (
					<div className={styles.productCard} key={product.id}>
						<Link href={'/product/' + product.id} passHref>
							<a>
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
										<RatingDisplay rating={product.rating.rate} />({product.rating.count})
										<h2>${product.price}</h2>
									</div>
								</div>
							</a>
						</Link>
					</div>
				))}
			</>
		)
	} else {
		// Return nothing if no sort function has operated
		return <></>
	}
}
