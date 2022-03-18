import React, { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import ItemDisplay from '../components/ItemDisplay'

export default function Home({ initialProducts }) {
	const [priceRange, setPriceRange] = useState('anyPrice')
	const [customRange, setCustomRange] = useState()
	const [products, setProducts] = useState(initialProducts)
	const [currentProductType, setCurrentProductType] = useState('All Products')

	const [sortDropDownClass, setSortDropDownClass] = useState(styles.dropdownClosed)

	// The selectedSort will default to sortFeatured, unless there is a current value for sortOption in localStorage.
	// This takes place within the ItemDisplay Component.
	const [selectedSort, setSelectedSort] = useState('')

	useEffect(() => {
		if (selectedSort) {
			localStorage.setItem('sortOption', selectedSort)
		}
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

	function sortDropDownFunc(e) {
		// This statement allows clicks, Enter, and Space to execute
		if (typeof e.code === 'undefined' || (e.code && (e.code === 'Enter' || e.code === 'Space'))) {
			// Toggles value
			if (sortDropStatus === 'false') {
				openSortMenu()
				// When the menu is open this will focus on to the current active selection
				if (selectedSort) {
					let a = document.getElementById(selectedSort)
					setTimeout(() => {
						a.focus()
					}, 1)
				}
			} else {
				closeSortMenu()
			}
		}
	}

	const handleDropdownClose = (e) => {
		let menu = document.getElementById('sortOptions')
		if (typeof menu !== 'undefined' && menu !== null) {
			// If the sort menu is currently open
			if (!menu.contains(e.target)) {
				// if the area clicked is not within the menu, close it
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

		// The way I have done it here could be generalized to not require manual focus
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
				setPriceRange(e.target.id)
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

		if (!Number.isNaN(low) && !Number.isNaN(high)) {
			if (low < high) {
				setCustomRange([low, high])
			} else {
				setCustomRange([high, low])
			}
			setPriceRange('customRadio')
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
	const resetPrice = () => {
		document.getElementById('anyPrice').checked = true
		document.getElementById('lowInput').value = ''
		document.getElementById('highInput').value = ''
	}

	const allProducts = () => {
		setProducts([...initialProducts])
		setCurrentProductType('All Products')
		resetPrice()
	}
	const menProducts = () => {
		setProducts([
			...initialProducts.filter((product) => {
				return product.category === "men's clothing"
			}),
		])
		setCurrentProductType("Men's Clothing")
		resetPrice()
	}
	const womenProducts = () => {
		setProducts([
			...initialProducts.filter((product) => {
				return product.category === "women's clothing"
			}),
		])
		setCurrentProductType("Women's Clothing")
		resetPrice()
	}
	const jeweleryProducts = () => {
		setProducts([
			...initialProducts.filter((product) => {
				return product.category === 'jewelery'
			}),
		])
		setCurrentProductType('Jewelery')
		resetPrice()
	}
	const electronicsProducts = () => {
		setProducts([
			...initialProducts.filter((product) => {
				return product.category === 'electronics'
			}),
		])
		setCurrentProductType('Electronics')
		resetPrice()
	}

	// Mobile State
	const [fullscreenFilterStatus, setFullscreenFilterStatus] = useState('false')
	const [fullFilterClass, setFullFilterClass] = useState(styles.filterClosed)
	const [darkFilter, setDarkFilter] = useState()

	const filterToggle = () => {
		if (fullFilterClass === styles.filterClosed) {
			// Open
			setFullscreenFilterStatus('true')
			setFullFilterClass(styles.filterOpen)
			setDarkFilter(styles.openDark)
			document.body.setAttribute('class', 'stopScroll')
			setTimeout(() => {
				// This waita 1ms before focusing to ensure the element is no longer display: none
				document.getElementById('closeFullscreenFilter').focus()
			}, 1)
		} else {
			// Closing
			setFullFilterClass(styles.filterClosing)
			setDarkFilter(styles.closingDark)
			document.body.removeAttribute('class')
			setTimeout(() => {
				// Closed
				setFullscreenFilterStatus('closed')
				setFullFilterClass(styles.filterClosed)
				setDarkFilter(styles.closeDark)
			}, 200) // This ms value is set as the duration of the closing animation's duration
		}
	}

	const executeMobileFilters = () => {
		// set the 3 values for the state by getting the id's of the checked options in the radios
		let categories = document.getElementById('mobileCategories')
		let categoryId = Array.from(categories.childNodes).filter(
			(x) => x.childNodes[0].checked === true
		)[0].childNodes[0].id
		let sorts = document.getElementById('mobileSorts')
		let sortId = Array.from(sorts.childNodes).filter((x) => x.childNodes[0].checked === true)[0]
			.childNodes[0].id
		let prices = document.getElementById('mobilePrices')
		let priceId = Array.from(prices.childNodes).filter((x) => x.childNodes[0].checked === true)[0]
			.childNodes[0].id

		switch (categoryId) {
			case 'mobileAll':
				allProducts()
				break
			case 'mobileMen':
				menProducts()
				break
			case 'mobileWomen':
				womenProducts()
				break
			case 'mobileJewelery':
				jeweleryProducts()
				break
			case 'mobileElectronics':
				electronicsProducts()
				break
			default:
				allProducts()
				break
		}

		let newSortDropChecks = ['false', 'false', 'false', 'false']
		switch (sortId) {
			case 'mobileFeatured':
				setSelectedSort('sortFeatured')
				newSortDropChecks[0] = 'true'
				break
			case 'mobileTopReviews':
				setSelectedSort('sortTopReview')
				newSortDropChecks[1] = 'true'
				break
			case 'mobileLowestPrice':
				setSelectedSort('sortLowestPrice')
				newSortDropChecks[2] = 'true'
				break
			case 'mobileHighestPrice':
				setSelectedSort('sortHighestPrice')
				newSortDropChecks[3] = 'true'
				break
			default:
				setSelectedSort('sortFeatured')
				newSortDropChecks[0] = 'true'
				break
		}
		setSortDropChecks(newSortDropChecks)

		switch (priceId) {
			case 'mobileAnyPrice':
				setPriceRange('anyPrice')
				break
			case 'mobileUnderTen':
				setPriceRange('underTen')
				break
			case 'mobileTenToTwentyFive':
				setPriceRange('tenToTwentyFive')
				break
			case 'mobileTwentyFiveToOneHundred':
				setPriceRange('twentyFiveToOneHundred')
				break
			case 'mobileOneHundredToFiveHundred':
				setPriceRange('oneHundredToFiveHundred')
				break
			case 'mobileOverFiveHundred':
				setPriceRange('overFiveHundred')
				break
			case 'mobileCustomRadio':
				let low = parseFloat(document.getElementById('mobileLowInput').value)
				let high = parseFloat(document.getElementById('mobileHighInput').value)
				if (!Number.isNaN(low) && !Number.isNaN(high)) {
					if (low < high) {
						setCustomRange([low, high])
					} else {
						setCustomRange([high, low])
					}
					setPriceRange('customRadio')
				} else {
					setPriceRange('anyPrice')
				}
				break
			default:
				setPriceRange('anyPrice')
				break
		}

		filterToggle()
	}

	const customMobileSelect = () => {
		document.getElementById('mobileCustomRadio').checked = true
	}

	const handleMobilePrice = (e) => {
		console.log(e)
		if (
			e.target.id !== 'mobileCustomRadio' &&
			e.target.id !== 'mobileLowInput' &&
			e.target.id !== 'mobileHighInput'
		) {
			document.getElementById('mobileLowInput').value = ''
			document.getElementById('mobileHighInput').value = ''
		}
	}

	return (
		<>
			<Head>
				<title>Antonio's Store: It's amazing!</title>
				<meta name="description" content="Fake e-commerce site" />
			</Head>

			<header>
				<a href="#main-content" id="navSkip">
					Skip Navigation
				</a>
				<nav className={styles.topNav}>
					<button onClick={allProducts}>All</button>
					<button onClick={menProducts}>Men</button>
					<button onClick={womenProducts}>Women</button>
					<button onClick={jeweleryProducts}>Jewelry</button>
					<button onClick={electronicsProducts}>Electronics</button>
				</nav>
				<div className={styles.banner}>
					<h3>This is where new deals would go!</h3>
				</div>
			</header>
			<header className={styles.wallHeader}>
				<h2>
					{currentProductType} ({products.length})
				</h2>
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
						onClick={filterToggle}
						aria-haspopup="menu"
						aria-label="Filters"
						aria-controls="fullscreenFilter"
						aria-expanded={fullscreenFilterStatus}
					>
						<span>Filters</span>
						<div>{/* Icon */}</div>
					</button>

					<div id="fullscreenFilter" className={fullFilterClass} role="menu">
						{/* Mobile Filter Screen */}
						<button
							id="closeFullscreenFilter"
							className={styles.fullscreenClose}
							onClick={filterToggle}
						>
							Close
						</button>
						<h1 className={styles.mobileTitle}>Filters</h1>
						<fieldset id="mobileCategories">
							<legend>Filter By Category</legend>
							<div>
								<input
									type="radio"
									id="mobileAll"
									name="category"
									autoComplete="off"
									defaultChecked
								></input>
								<label htmlFor="mobileAll">All</label>
							</div>
							<div>
								<input type="radio" id="mobileMen" name="category" autoComplete="off"></input>
								<label htmlFor="mobileMen">Men</label>
							</div>
							<div>
								<input type="radio" id="mobileWomen" name="category" autoComplete="off"></input>
								<label htmlFor="mobileWomen">Women</label>
							</div>
							<div>
								<input type="radio" id="mobileJewelery" name="category" autoComplete="off"></input>
								<label htmlFor="mobileJewelery">Jewelery</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileElectronics"
									name="category"
									autoComplete="off"
								></input>
								<label htmlFor="mobileElectronics">Electronics</label>
							</div>
						</fieldset>
						<fieldset id="mobileSorts">
							<legend>Sort By</legend>
							<div>
								<input
									type="radio"
									id="mobileFeatured"
									name="sort"
									autoComplete="off"
									defaultChecked
								></input>
								<label htmlFor="mobileFeatured">Featured</label>
							</div>
							<div>
								<input type="radio" id="mobileTopReviews" name="sort" autoComplete="off"></input>
								<label htmlFor="mobileTopReviews">Top Reviews</label>
							</div>
							<div>
								<input type="radio" id="mobileLowestPrice" name="sort" autoComplete="off"></input>
								<label htmlFor="mobileLowestPrice">Lowest Price</label>
							</div>
							<div>
								<input type="radio" id="mobileHighestPrice" name="sort" autoComplete="off"></input>
								<label htmlFor="mobileHighestPrice">Highest Price</label>
							</div>
						</fieldset>
						<fieldset
							id="mobilePrices"
							className={styles.noBottomBorder}
							onChange={handleMobilePrice}
						>
							<legend>Price ($)</legend>
							<div>
								<input
									type="radio"
									id="mobileAnyPrice"
									name="mobilePrice"
									autoComplete="off"
									defaultChecked
								></input>
								<label htmlFor="mobileAnyPrice">Any price</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileUnderTen"
									name="mobilePrice"
									autoComplete="off"
								></input>
								<label htmlFor="mobileUnderTen">Under $10</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileTenToTwentyFive"
									name="mobilePrice"
									autoComplete="off"
								></input>
								<label htmlFor="mobileTenToTwentyFive">$10 to $25</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileTwentyFiveToOneHundred"
									name="mobilePrice"
									autoComplete="off"
								></input>
								<label htmlFor="mobileTwentyFiveToOneHundred">$25 to $100</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileOneHundredToFiveHundred"
									name="mobilePrice"
									autoComplete="off"
								></input>
								<label htmlFor="mobileOneHundredToFiveHundred">$100 to $500</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileOverFiveHundred"
									name="mobilePrice"
									autoComplete="off"
								></input>
								<label htmlFor="mobileOverFiveHundred">Over $500</label>
							</div>
							<div>
								<input
									type="radio"
									id="mobileCustomRadio"
									name="mobilePrice"
									autoComplete="off"
								></input>
								<label htmlFor="mobileCustomRadio">Custom</label>
								<div className={styles.customMobileInput}>
									<input
										id="mobileLowInput"
										type="text"
										maxLength="5"
										placeholder="Low"
										onClick={customMobileSelect}
										onInput={customMobileSelect}
										autoComplete="off"
									></input>
									<p>to</p>
									<input
										id="mobileHighInput"
										type="text"
										maxLength="5"
										placeholder="High"
										onClick={customMobileSelect}
										onInput={customMobileSelect}
										autoComplete="off"
									></input>
									{/* Hidden button which enters in the current custom values */}
								</div>
							</div>
						</fieldset>
						<div id="mobileButtons" className={styles.mobileBottomButtons}>
							<button className={styles.mobileCancelButton} onClick={filterToggle}>
								Cancel
							</button>
							<button className={styles.mobileApplyButton} onClick={executeMobileFilters}>
								Apply
							</button>
						</div>
					</div>
					<div id="darkFilter" className={darkFilter}></div>
				</nav>
			</header>

			<div className={styles.bodyContainer}>
				{/* Side Nav for filtering results */}
				<nav className={styles.sideNav}>
					<div className={styles.catagories}>
						{/* Catagories */}
						<button onClick={allProducts}>All</button>
						<button onClick={menProducts}>Men</button>
						<button onClick={womenProducts}>Women</button>
						<button onClick={jeweleryProducts}>Jewelry</button>
						<button onClick={electronicsProducts}>Electronics</button>
					</div>

					<fieldset className={styles.sideNavPrice} onChange={handlePriceSelection}>
						<legend>Price ($)</legend>
						<div>
							<input
								type="radio"
								id="anyPrice"
								name="price"
								autoComplete="off"
								defaultChecked
							></input>
							<label htmlFor="anyPrice">Any price</label>
						</div>
						<div>
							<input type="radio" id="underTen" name="price" autoComplete="off"></input>
							<label htmlFor="underTen">Under $10</label>
						</div>
						<div>
							<input type="radio" id="tenToTwentyFive" name="price" autoComplete="off"></input>
							<label htmlFor="tenToTwentyFive">$10 to $25</label>
						</div>
						<div>
							<input
								type="radio"
								id="twentyFiveToOneHundred"
								name="price"
								autoComplete="off"
							></input>
							<label htmlFor="twentyFiveToOneHundred">$25 to $100</label>
						</div>
						<div>
							<input
								type="radio"
								id="oneHundredToFiveHundred"
								name="price"
								autoComplete="off"
							></input>
							<label htmlFor="oneHundredToFiveHundred">$100 to $500</label>
						</div>
						<div>
							<input type="radio" id="overFiveHundred" name="price" autoComplete="off"></input>
							<label htmlFor="overFiveHundred">Over $500</label>
						</div>
						<div>
							<input type="radio" id="customRadio" name="price" autoComplete="off"></input>
							<label htmlFor="customRadio">Custom</label>
							<div className={styles.customInput}>
								<input
									id="lowInput"
									type="text"
									maxLength="5"
									placeholder="Low"
									onClick={customSelect}
									onInput={customSelect}
									onKeyDown={priceSelectionKeyboard}
									autoComplete="off"
									aria-label="Custom low input"
								></input>
								<p>to</p>
								<input
									id="highInput"
									type="text"
									maxLength="5"
									placeholder="High"
									onClick={customSelect}
									onInput={customSelect}
									onKeyDown={priceSelectionKeyboard}
									autoComplete="off"
									aria-label="Custom high input"
								></input>
								{/* Hidden button which enters in the current custom values */}
							</div>
						</div>
					</fieldset>
				</nav>

				<main className={styles.main} id="main-content">
					<ItemDisplay
						products={products}
						range={priceRange}
						sort={selectedSort}
						custom={customRange}
					/>
				</main>
			</div>

			<footer></footer>
		</>
	)
}

export async function getStaticProps() {
	// This function will get the data that will be displayed and arranged
	const response = await fetch('https://fakestoreapi.com/products')
	const initialProducts = await response.json()
	// If there is an error with the api call then a custom 500 error page will display.
	return {
		props: {
			initialProducts,
		},
	}
}
