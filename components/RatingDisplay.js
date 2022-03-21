import React, { useState } from 'react'

export default function RatingDisplay({ rating }) {
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

	let roundedRate = Math.round(rating / 0.5) * 0.5

	const [stars, setStars] = useState([])

	if (stars.length === 0) {
		// Full stars
		for (let i = 0; i < Math.floor(roundedRate); i++) {
			stars.push(<FullStar key={i} />)
		}
		// Half stars
		if (roundedRate !== Math.trunc(roundedRate)) {
			stars.push(<HalfStar key={stars.length} />)
		}
		// Empty stars
		if (stars.length < 5) {
			for (let i = stars.length; i < 5; i++) {
				stars.push(<EmptyStar key={i} />)
			}
		}
		setStars([...stars])
	}

	return stars
}
