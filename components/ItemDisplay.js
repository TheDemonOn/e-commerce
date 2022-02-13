import React from 'react'
import styles from '../styles/ItemDisplay.module.css'

export default function ItemDisplay({ products }) {
	return (
		<>
			{/* Container for entire product display */}

			{products.map((product) => (
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
