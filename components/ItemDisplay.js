import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/ItemDisplay.module.css'

export default function ItemDisplay({ products, display, sort }) {
	const [productDisplay, setProductDisplay] = useState(products)

	const sortLowToHigh = () => {
		// sort
		let tempProducts = products
		// console.log(tempProducts)
		tempProducts.sort((a, b) => {
			return a.price - b.price
		})
		// console.log(tempProducts)
		setProductDisplay(tempProducts)
	}

	useLayoutEffect(() => {
		if (sort === 'sortLowestPrice') {
			// sort function
			console.log('hi')
			sortLowToHigh()
		} else if (sort === 'sortHighestPrice') {
			//sort function
		}
	}, [sort])

	return (
		<>
			{/* Container for entire product display */}

			{productDisplay.map((product) => (
				<div className={styles.productCard}>
					<figure>
						<div className={styles.ImgContainer}>
							<img className={styles.ImgSize} src={product.image}></img>
						</div>

						<figcaption>{product.title}</figcaption>
						<h2>${product.price}</h2>
					</figure>
				</div>
			))}
		</>
	)
}
