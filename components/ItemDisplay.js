import React from 'react'
import styles from '../styles/ItemDisplay.module.css'

export default function ItemDisplay({ products }) {
	return (
		<>
			{/* Container for entire product display */}

			{products.map((product) => (
				<div className={styles.productCard}>
					<figure>
						<img src={product.image}></img>
						<figcaption>A thing!</figcaption>
						<h2>{product.price}</h2>
					</figure>
				</div>
			))}
		</>
	)
}
