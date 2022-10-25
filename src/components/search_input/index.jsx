import './index.css'

import React from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router'


let Search_input = function(){
	let [input_value, value_set] = useState('');
	const value_change = function(e){
		value_set(e.target.value)
	}

	const navigate = useNavigate();
	const keypress = function(e){
		if(e.key === 'Enter' && input_value!=''){
			navigate(`/search/${input_value}`)
		}
	}
	
	return (
		<div className="search-container">
			<div className="icon-container">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 search-icon">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
			</div>
			

			<input type="text" value={input_value} onChange={value_change} onKeyPress={keypress} className='search-input'/>
		</div>
	)
}

export default Search_input