import React from 'react'

export default function Checkmark({ active = 'false' }) {
	if (active === 'true') {
		return (
			<svg
				width="1.2em"
				height="1.2em"
				className="checkmark"
				version="1.1"
				viewBox="100 100 500 400"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				aria-hidden="true"
			>
				<g>
					<path
						transform="matrix(5.6 0 0 5.6 70 3.979e-14)"
						d="m76.9 32.1c2.2001-2.4003 5.7003 1.1 3.5003 3.5003-12.2 13.8-24.501 27.4-36.8 41.099-0.59989 0.70034-1.1998 1.3002-1.7997 1.9999-0.89983 1.0003-2.5997 0.89983-3.5003 0-6.1998-5.8998-12.4-11.9-18.6-17.8-2.2998-2.2001 1.1998-5.8001 3.5003-3.5003 5.5999 5.2999 11.1 10.6 16.7 16 12.4-13.8 24.7-27.5 37-41.3z"
						stroke="#525252"
						strokeWidth="5"
					/>
				</g>
			</svg>
		)
	} else {
		return null
	}
}
