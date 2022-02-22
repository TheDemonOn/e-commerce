import React, { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import ItemDisplay from '../components/ItemDisplay'

export default function Home({ products }) {
	const [items, setItems] = useState('anyPrice')
	const [customRange, setCustomRange] = useState()

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
	const openSortMenu = () => {
		setSortDropStatus('true')
		setSortDropDownClass(styles.dropdownOpen)
	}

	// Accessibility State
	const [sortDropStatus, setSortDropStatus] = useState('false')
	const [sortDropChecks, setSortDropChecks] = useState(['true', 'false', 'false', 'false'])
	const [fullscreenFilterStatus, setFullscreenFilterStatus] = useState('false')

	function sortDropDownFunc(e) {
		// This statement allows clicks, Enter, and Space to execute
		if (typeof e.code === 'undefined' || (e.code && (e.code === 'Enter' || e.code === 'Space'))) {
			// Toggles value
			if (sortDropStatus === 'false') {
				openSortMenu()
				// When the menu is open this will focus on to the current active selection
				let a = document.getElementById(selectedSort)
				setTimeout(() => {
					a.focus()
				}, 1)
			} else {
				closeSortMenu()
			}
		}
	}

	const handleDropdownClose = (e) => {
		let menu = document.getElementById('sortOptions')
		if (typeof menu !== 'undefined') {
			if (!menu.contains(e.target)) {
				closeSortMenu()
			}
		}
	}

	useEffect(() => {
		window.addEventListener('click', handleDropdownClose)
		// window.addEventListener('focusin', handleDropdownClose)
		return () => {
			window.removeEventListener('click', handleDropdownClose)
			// window.removeEventListener('focusin', handleDropdownClose)
		}
	}, [])

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
		console.log(e)
		switch (e.key) {
			// Switched e.code to e.key for better handling of actions on laptops
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
			case 'ArrowDown':
				e.preventDefault()
				if (e.target.nextElementSibling !== null) {
					e.target.nextElementSibling.focus()
				}
				break
			case 'ArrowUp':
				e.preventDefault()
				if (e.target.previousElementSibling !== null) {
					e.target.previousElementSibling.focus()
				}
				break
			case 'Home':
				e.preventDefault()
				document.getElementById('sortFeatured').focus()
				break
			case 'End':
				e.preventDefault()
				document.getElementById('sortHighestPrice').focus()
		}
	}

	const handlePriceSelection = (e) => {
		console.log(e)
		if (e.target.type === 'radio') {
			// Mutate state for displaying products
			if (e.target.id !== 'customRadio') {
				setItems(e.target.id)
				// Clear Custom Inputs
				document.getElementById('lowInput').value = ''
				document.getElementById('highInput').value = ''
			} else {
				// custom radio selected
				document.getElementById('lowInput').focus()
			}
		} else {
			// Input boxes for custom
		}
	}

	const customEnter = () => {
		// Sanitize inputs and have default values
		let low = parseFloat(document.getElementById('lowInput').value)
		let high = parseFloat(document.getElementById('highInput').value)
		console.log(low, high)

		if (low !== NaN && high !== NaN) {
			if (low < high) {
				setCustomRange([low, high])
			} else {
				setCustomRange([high, low])
			}
			setItems('customRadio')
		}
	}

	const priceSelectionKeyboard = (e) => {
		switch (e.code) {
			case 'Enter':
				console.log('ENTER WAS pressed')
				// Click button
				customEnter()
				break
		}
	}

	const customSelect = () => {
		document.getElementById('customRadio').checked = true
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
				<div className={styles.banner}>
					<h3>This is where new deals would go!</h3>
				</div>
			</header>
			{/* Content banner */}
			<div className={styles.banner}></div>
			<header className={styles.wallHeader}>
				<h2>Stuff We Have ({products.length})</h2>
				{/* SideNav toggle & Sort By */}
				<nav className={styles.sortNav}>
					{/* Sort By Button */}
					<button
						id="dropDownButton"
						onClick={(e) => {
							// This stopPropagation is necessary so that THIS current click does not trigger the menu to close
							e.stopPropagation()
							sortDropDownFunc(e)
						}}
						aria-expanded={sortDropStatus}
						aria-label="Sort By"
						aria-controls="sortOptions"
						aria-haspopup="listbox"
					>
						<span>Sort By</span>
						<div>{/* Chevron */}</div>
					</button>
					<div id="sortOptions" role="listbox" className={sortDropDownClass}>
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
					{/* Reduced Screen Width Filter Button */}
					<button
						id="fullscreenFilterButton"
						aria-haspopup="menu"
						aria-label="Filter"
						aria-controls="fullscreenFilter"
						aria-expanded={fullscreenFilterStatus}
					>
						<span>Filter</span>
						<div>{/* Icon */}</div>
					</button>
					<div id="fullscreenFilter" role="menu"></div>
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

					<fieldset onChange={handlePriceSelection}>
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
								<input
									id="lowInput"
									type="text"
									maxLength="5"
									placeholder="Low"
									onClick={customSelect}
									onKeyDown={priceSelectionKeyboard}
								></input>
								<p>to</p>
								<input
									id="highInput"
									type="text"
									maxLength="5"
									placeholder="High"
									onClick={customSelect}
									onKeyDown={priceSelectionKeyboard}
								></input>
								{/* Hidden button which enters in the current custom values */}
							</div>
						</div>
					</fieldset>
				</nav>

				<main className={styles.main}>
					<ItemDisplay products={products} items={items} sort={selectedSort} custom={customRange} />
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
