import React, { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import ItemDisplay from '../components/ItemDisplay'

export default function Home({ products }) {
	const [items, setItems] = useState('all')

	const [sortDropDownClass, setSortDropDownClass] = useState(styles.dropdownClosed)

	// This stored sort option is retrieved when ran on the client if one has been selected before
	let storedSortOption
	if (typeof window !== 'undefined') {
		storedSortOption = localStorage.getItem('sortOption')
	}
	// If there is no stored value use the default
	const [selectedSort, setSelectedSort] = useState(storedSortOption || 'sortFeatured')

	useEffect(() => {
		localStorage.setItem('sortOption', selectedSort)
	}, [selectedSort])

	const closeSortMenu = () => {
		setSortDropStatus('false')
		setSortDropDownClass(styles.dropdownClosed)
	}

	const menuBlurHandle = (e) => {
		// The Following implementation of detecting clicks outside the menu fails when the address bar is clicked, then the page itself
		// const currentTarget = e.currentTarget
		// console.log(currentTarget, document.activeElement)
		// requestAnimationFrame(() => {
		// 	if (!currentTarget.contains(document.activeElement)) {
		// 		closeSortMenu()
		// 	}
		// })
	}

	// Accessibility State
	const [sortDropStatus, setSortDropStatus] = useState('false')
	const [sortDropChecks, setSortDropChecks] = useState(['true', 'false', 'false', 'false'])

	// State to control menu outside clicking closing the sort menu
	const [dropDownDisplay, setDropDownDisplay] = useState()
	const closeSortMenuAutomatically = ({ dropdownDisplay, menu }) => {
		const handleDropdownClose = useCallback(
			(e) => {
				!menu.current.contains(e.target)
			},
			[menu]
		)
	}

	async function sortDropDownFunc(e) {
		// This statement allows clicks, Enter, and Space to execute
		if (typeof e.code === 'undefined' || (e.code && (e.code === 'Enter' || e.code === 'Space'))) {
			// Toggles value
			if (sortDropStatus === 'false') {
				setSortDropStatus('true')
				setSortDropDownClass(styles.dropdownOpen)
				let a = document.getElementById(selectedSort)
				setTimeout(() => {
					a.focus()
				}, 1)
			} else {
				closeSortMenu()
			}
		}
	}

	const sortDropSelect = (e) => {
		// This statement allows clicks, Enter, and Space to execute
		if (typeof e.code === 'undefined' || (e.code && (e.code === 'Enter' || e.code === 'Space'))) {
			// This will use the id of the selected option to know what it is
			let selectedOption = e.target.id
			// The new selected option is passed to the child to display the items in the new order
			setSelectedSort(selectedOption)
			console.log('The selected Sort is now: ' + selectedOption)

			let newSortDropChecks = ['false', 'false', 'false', 'false']
			// Mutate sortDropChecks to reflect new checked for accessibility attribute
			switch (selectedOption) {
				case 'sortFeatured':
					newSortDropChecks[0] = 'true'
					break
				case 'sortTopReview':
					newSortDropChecks[1] = 'true'
					break
				case 'sortLowestPrice':
					newSortDropChecks[2] = 'true'
					break
				case 'sortHighestPrice':
					newSortDropChecks[3] = 'true'
					break
			}
			setSortDropChecks(newSortDropChecks)
			// Exit dropdown
			closeSortMenu()
		}
	}

	const sortDropKeyboardControls = (e) => {
		// There are a few different ways to get the effect I'm after.
		// The effect should be similar to how Amazon's sort menu operates, which sets only the menu as tabbable,
		// looping through, and arrow keys going down and up, but not looping, leaving the menu by using the "Escape" key, or making a selection

		// A potential way is having the final tab take you back to the beginning, overiding what it would normally do (leaving the menu), and
		// making arrow keys iterate, but not loop

		// Amazon's approach seemed to be to make no other section tabbable besides the menu? But wouldn't that not prevent tabbing taking you out of the window?
		// If that is the case then the first way I had thought may be the solution.
		switch (e.code) {
			case 'Escape':
				closeSortMenu()
				break
			case 'Tab':
				if (e.target.id === 'sortHighestPrice') {
					e.preventDefault()
					if (e.shiftKey === true) {
						// Shift tab
						document.getElementById('sortLowestPrice').focus()
					} else {
						document.getElementById('sortFeatured').focus()
					}
				} else if (e.target.id === 'sortFeatured' && e.shiftKey === true) {
					e.preventDefault()
					document.getElementById('sortHighestPrice').focus()
				}
				break
		}
	}

	return (
		<>
			<Head>
				<title>This Store: It's amazing!</title>
				<meta name="description" content="Fake e-commerce site" />
			</Head>

			<header>
				<nav className={styles.topNav}>
					{/* Logo Here */}
					{/* Search Bar would be here */}
					{/* Use Link attribute to move to new page */}
					<a>Men</a>
					<a>Women</a>
					<a>Jewelry</a>
					<a>Electronics</a>
				</nav>
			</header>
			{/* Content banner */}
			<div></div>
			<header className={styles.wallHeader}>
				<h1>Stuff We Have ({products.length})</h1>
				{/* SideNav toggle & Sort By */}
				<nav className={styles.sortNav}>
					<div></div>
					{/* Sort By Button */}
					<button
						id="dropDownButton"
						onClick={sortDropDownFunc}
						aria-expanded={sortDropStatus}
						aria-label="Sort By"
						role="listbox"
						aria-controls="sortOptions"
						aria-haspopup="true"
					>
						<span>Sort By</span>
						<div>{/* Chevron */}</div>
					</button>
					<div
						id="sortOptions"
						aria-labelledby="dropDownButton"
						role="menu"
						className={sortDropDownClass}
						// onBlur={menuBlurHandle}
					>
						{/* Drop Down */}
						<button
							id="sortFeatured"
							onClick={sortDropSelect}
							onKeyDown={sortDropKeyboardControls}
							role="menuitem"
							aria-checked={sortDropChecks[0]}
						>
							Featured
						</button>
						<button
							id="sortTopReview"
							onClick={sortDropSelect}
							onKeyDown={sortDropKeyboardControls}
							role="menuitem"
							aria-checked={sortDropChecks[1]}
						>
							Top Reviews
						</button>
						<button
							id="sortLowestPrice"
							onClick={sortDropSelect}
							onKeyDown={sortDropKeyboardControls}
							role="menuitem"
							aria-checked={sortDropChecks[2]}
						>
							Lowest Price
						</button>
						<button
							id="sortHighestPrice"
							onClick={sortDropSelect}
							onKeyDown={sortDropKeyboardControls}
							role="menuitem"
							aria-checked={sortDropChecks[3]}
						>
							Highest Price
						</button>
					</div>
				</nav>
			</header>

			<div className={styles.bodyContainer}>
				{/* Side Nav for filtering results */}
				<nav className={styles.sideNav}>
					<div className={styles.catagories}>
						{/* Catagories */}
						<a>Men</a>
						<a>Women</a>
						<a>Jewelry</a>
						<a>Electronics</a>
					</div>

					<fieldset>
						<legend>Price ($)</legend>
						<div>
							<input type="radio" id="anyPrice" name="price" defaultChecked></input>
							<label htmlFor="anyPrice">Any price</label>
						</div>
						<div>
							<input type="radio" id="underTen" name="price"></input>
							<label htmlFor="underTen">Under $10</label>
						</div>
						<div>
							<input type="radio" id="tenToTwentyFive" name="price"></input>
							<label htmlFor="tenToTwentyFive">$10 to $25</label>
						</div>
						<div>
							<input type="radio" id="twentyFiveToOneHundred" name="price"></input>
							<label htmlFor="twentyFiveToOneHundred">$25 to $100</label>
						</div>
						<div>
							<input type="radio" id="oneHundredToFiveHundred" name="price"></input>
							<label htmlFor="oneHundredToFiveHundred">$100 to $500</label>
						</div>
						<div>
							<input type="radio" id="overFiveHundred" name="price"></input>
							<label htmlFor="overFiveHundred">Over $500</label>
						</div>
						<div>
							<input type="radio" id="customRadio" name="price"></input>
							<label htmlFor="customRadio">Custom</label>
							<div>
								<input type="text" maxLength="5" placeholder="Low"></input>
								<p>to</p>
								<input type="text" maxLength="5" placeholder="High"></input>
							</div>
						</div>
					</fieldset>
				</nav>

				<main className={styles.main}>
					<ItemDisplay products={products} display={items} sort={selectedSort} />
				</main>
			</div>

			<footer>
				<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
			</footer>
		</>
	)
}

export async function getStaticProps() {
	// This function will get the data that will be displayed and arranged
	const response = await fetch('https://fakestoreapi.com/products')
	const products = await response.json()
	// If there is an error with the api call then a custom 500 error page will display.
	return {
		props: {
			products,
		},
	}
}

// const CloseSortMenuAutomatically = ({ setDropDownDisplay, menu }) => {
// 	const handleDropdownClose = useCallback(
// 		(e) => {
// 			!menu.current.contains(e.target) && setDropDownDisplay(false)
// 		},
// 		[setDropDownDisplay, menu]
// 	)

// 	useEffect(() => {
// 		window.addEventListener('click', handleDropdownClose)
// 		window.addEventListener('focusin', handleDropdownClose)

// 		return () => {
// 			window.removeEventListener('click', handleDropdownClose)
// 			window.removeEventListener('focusin', handleDropdownClose)
// 		}
// 	}, [handleDropdownClose, menu])
// }

// const menu = useRef()
// const [dropDownDisplay, setDropDownDisplay] = useState(false)

// CloseSortMenuAutomatically({setDropDownDisplay, menu})

// onClick={(e) => {
// 	e.stopPropagation()
// 	setDropDownDisplay((x) => !x)
// }}

//
//
//
//
//
//
//
//
//

// const useAutoClose = ({ setIsOpen, menu }) => {
// 	const handleClosure = React.useCallback(
// 		(event) => !menu.current.contains(event.target) && setIsOpen(false),
// 		[setIsOpen, menu]
// 	)

// 	React.useEffect(() => {
// 		window.addEventListener('click', handleClosure)
// 		window.addEventListener('focusin', handleClosure)

// 		return () => {
// 			window.removeEventListener('click', handleClosure)
// 			window.removeEventListener('focusin', handleClosure)
// 		}
// 	}, [handleClosure, menu])
// }

// const Menu = (props) => {
// 	const menu = React.useRef()
// 	const [isOpen, setIsOpen] = React.useState(false)

// 	useAutoClose({ setIsOpen, menu })

// 	return (
// 		<nav role="navigation">
// 			<button
// 				type="button"
// 				id="nav-toggle"
// 				aria-expanded={isOpen}
// 				aria-controls="nav-content"
// 				onClick={(event) => {
// 					event.stopPropagation()
// 					setIsOpen((isOpen) => !isOpen)
// 				}}
// 			>
// 				Navigation
// 			</button>
// 			<div id="nav-content" aria-hidden={!isOpen} aria-labelledby="nav-toggle">
// 				<ul>
// 					<li>
// 						<a href="#">Link 1</a>
// 					</li>
// 					<li>
// 						<a href="#">Link 2</a>
// 					</li>
// 					<li>
// 						<a href="#">Link 3</a>
// 					</li>
// 				</ul>
// 			</div>
// 		</nav>
// 	)
// }
