import React, { useState, useEffect } from 'react'

export default function Chevron({ status }) {
	const [dynamicClass, setDynamicClass] = useState()

	useEffect(() => {
		if (status === 'true') {
			setDynamicClass('sortByOpen')
		} else {
			if (dynamicClass) {
				// The initial check of "dynamicClass" is to prevent the closed class from being applied and playing its animation on first load.
				setDynamicClass('sortByClosing')
				// This timout below is stored in a variable so that if the button's state changes before the 200ms, it will be cancelled to avoid inconsistent state
				let closedTimeout = setTimeout(() => {
					setDynamicClass('sortByClosed')
				}, 200)
			}
		}
		return () => {
			clearTimeout(closedTimeout)
		}
	}, [status])

	return (
		<svg
			width="0.9rem"
			height="0.9rem"
			className={dynamicClass}
			version="1.1"
			viewBox="200 200 300 100"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<g>
				<path d="m347.2 309.66 97.5-107.25c7.2812-8.0078 19.676-8.5977 27.684-1.3164 8.0117 7.2812 8.6016 19.676 1.3203 27.688l-112 123.2c-7.7773 8.5547-21.23 8.5547-29.004 0l-112-123.2c-7.2852-8.0117-6.6914-20.406 1.3164-27.688 8.0117-7.2812 20.406-6.6914 27.688 1.3164z" />
			</g>
		</svg>
	)
}
