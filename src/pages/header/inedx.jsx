import './index.css'

import React from 'react'
import { Link } from 'react-router-dom'

import Search from '../../components/search_input/index.jsx'

class Header extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<header className='header bg-white w-full h-16 flex items-center'>
				<Link to='/'>
					<div className="icon">Home</div>
				</Link>
				<div className="history_container">
					<button className='pre' onClick={()=>{window.history.go(-1)}}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
</svg>

					</button>
					<button className='next' onClick={()=>{window.history.go(1)}}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>

					</button>
				</div>
				<Search />
			</header>
		)
	}
}

export default Header