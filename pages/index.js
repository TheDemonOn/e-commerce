import React, { useState, useEffect } from 'react'
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

	// Accessibility State
	const [sortDropStatus, setSortDropStatus] = useState('false')
	const [sortDropChecks, setSortDropChecks] = useState(['true', 'false', 'false', 'false'])

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
				setSortDropStatus('false')
				setSortDropDownClass(styles.dropdownClosed)
			}
		}
	}

	const sortDropSelect = (e) => {
		console.log(e.code)
		// This statement allows clicks, Enter, and Space to execute
		if (typeof e.code === 'undefined' || (e.code && (e.code === 'Enter' || e.code === 'Space'))) {
			// This will use the id of the selected option to know what it is
			let selectedOption = e.target.id
			setSelectedSort(selectedOption)

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
				setSortDropStatus('false')
				setSortDropDownClass(styles.dropdownClosed)
				document.getElementById('dropDownButton').focus()
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
							<label for="anyPrice">Any price</label>
						</div>
						<div>
							<input type="radio" id="underTen" name="price"></input>
							<label for="underTen">Under $10</label>
						</div>
						<div>
							<input type="radio" id="tenToTwentyFive" name="price"></input>
							<label for="tenToTwentyFive">$10 to $25</label>
						</div>
						<div>
							<input type="radio" id="twentyFiveToOneHundred" name="price"></input>
							<label for="twentyFiveToOneHundred">$25 to $100</label>
						</div>
						<div>
							<input type="radio" id="oneHundredToFiveHundred" name="price"></input>
							<label for="oneHundredToFiveHundred">$100 to $500</label>
						</div>
						<div>
							<input type="radio" id="overFiveHundred" name="price"></input>
							<label for="overFiveHundred">Over $500</label>
						</div>
						<div>
							<input type="radio" id="customRadio" name="price"></input>
							<label for="customRadio">Custom</label>
							<div>
								<input type="text" maxlength="5" placeholder="Low"></input>
								<p>to</p>
								<input type="text" maxlength="5" placeholder="High"></input>
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
