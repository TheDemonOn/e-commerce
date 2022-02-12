import React from 'react'

export default function ItemDisplay({ products }) {
	return (
		<>
			{products.map((product) => (
				<h3>{product.title}</h3>
			))}
		</>
	)
}
