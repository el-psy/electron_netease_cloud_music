import './index.css'

import {useState, useEffect} from 'react';

let Show_ul = function(props){
	// console.log('show_ul', props);

	let [title, set_title] = useState('');
	let [single, set_single] = useState([]);
	let [pair, set_pair] = useState([]);

	useEffect(()=>{
		set_title(props.title || '');
		set_single(props.single || []);
		set_pair(props.pair || []);
	}, [props]);
	// let title = props.title || '';
	// let single = props.single || [];
	// let pair = props.pair || [];
	return (
		<div className='show_ul_container'>
			<h1 className='title'>{title}</h1>
			<ul className='single'>
				{single.map((item, index)=>{
					return <li key={index}>{item}</li>
				})}
			</ul>
			<ul className='pair'>
				{pair.map((item, index)=>{
					return <li key={index}>{item.head} : {item.body}</li>
				})}
			</ul>
		</div>
	)
}

export default Show_ul