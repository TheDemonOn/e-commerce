import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/ItemDisplay.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function ItemDisplay({ products, range, sort, custom }) {
	// For the initial load, in order to prevent the original default sort of "sortFeatured", then rewriting it to be whatever is currently selected, a check is placed to ensure that the items do not display until a sort option has been properly selected from either localStorage or otherwise.
	const [initialLoad, setInitialLoad] = useState(0)

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

	const FullStar = () => {
		return (
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				viewBox="0 0 441.5 414.5"
				xmlSpace="preserve"
				width="14.4px"
			>
				<path
					d="M220.8,0l50,154.8v0c0.8,2.3,2.9,3.9,5.3,3.9l162.6-0.3l-131.7,95.3v0c-2,1.4-2.8,4-2,6.3l50.6,154.6
					l-131.4-95.9c-2-1.4-4.6-1.4-6.6,0L86.1,414.5l50.6-154.6v0c0.8-2.3-0.1-4.9-2-6.3L2.9,158.3l162.6,0.3v0c2.4,0,4.6-1.6,5.3-3.9
					L220.8,0z"
				/>
			</svg>
		)
	}
	const HalfStar = () => {
		return (
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				viewBox="0 0 435.7 414.4"
				xmlSpace="preserve"
				width="14.4px"
			>
				<path
					d="M217.9,0L217.9,0l-50,154.7c-0.8,2.3-2.9,3.9-5.3,3.9v0L0,158.2l131.7,95.3c2,1.4,2.8,4,2,6.3v0L83.2,414.4
	l131.3-95.9c1-0.7,2.2-1.1,3.3-1.1V0z"
				/>
				<path
					fill="#BDBDBD"
					d="M304,253.5L304,253.5l131.7-95.3l-162.6,0.3c-2.4,0-4.6-1.6-5.3-3.9v0L217.9,0v317.5c1.1,0,2.3,0.4,3.3,1.1
	l131.4,95.9L302,259.8C301.2,257.5,302,255,304,253.5z"
				/>
			</svg>
		)
	}
	const EmptyStar = () => {
		return (
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				viewBox="0 0 435.7 414.4"
				xmlSpace="preserve"
				width="14.4px"
			>
				<path
					fill="#BDBDBD"
					d="M220.8,0l50,154.8v0c0.8,2.3,2.9,3.9,5.3,3.9l162.6-0.3l-131.7,95.3v0c-2,1.4-2.8,4-2,6.3l50.6,154.6
				l-131.4-95.9c-2-1.4-4.6-1.4-6.6,0L86.1,414.5l50.6-154.6v0c0.8-2.3-0.1-4.9-2-6.3L2.9,158.3l162.6,0.3v0c2.4,0,4.6-1.6,5.3-3.9
				L220.8,0z"
				/>
			</svg>
		)
	}

	function RatingDisplay({ rating }) {
		let roundedRate = Math.round(rating / 0.5) * 0.5

		const [stars, setStars] = useState([])

		if (stars.length === 0) {
			for (let i = 0; i < Math.floor(roundedRate); i++) {
				stars.push(<FullStar key={i} />)
			}
			if (roundedRate !== Math.trunc(roundedRate)) {
				stars.push(<HalfStar key={stars.length} />)
			}
			if (stars.length < 5) {
				for (let i = stars.length; i < 5; i++) {
					stars.push(<EmptyStar key={i} />)
				}
			}
			setStars([...stars])
		}

		return stars
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
										<RatingDisplay rating={product.rating.rate} />
										{/*  */}({product.rating.count})<h2>${product.price}</h2>
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
