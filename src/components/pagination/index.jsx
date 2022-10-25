import { useState, useEffect } from 'react';
import './index.css'

let Square = function(props){
	let {charset, to_num, set_page} = props
	// return <div></div>
	return (
		<div className={props.type? 'square':'square disabled'} onClick={props.type? (e)=>set_page(to_num): null}>
			{charset}
		</div>
	)
}

let Pagination = function(props){
	let {s, page_num, len, set_page} = props;
	// console.log('props', props);
	// console.log('pagination', s, page_num);
	let [nums, set_nums] = useState([])
	let change_nums = function(){
		let to_left = {'charset':'<', 'to_num':page_num-1, 'type': page_num!=1}
		let to_right = {'charset':'>', 'to_num':page_num+1, 'type':page_num!=s && s!=0}
		let mid = Math.ceil(len/2);
		if(s <= len){
			let buff = []
			for(let i=0; i<s; i++){
				buff.push({'charset':i+1,'to_num':i+1, 'type':true})
			}
			buff[page_num-1] = {'charset':page_num,'to_num':page_num, 'type':false}
			buff = [to_left, ...buff, to_right]
			// console.log('buff', buff);
			set_nums([]);
			set_nums([...buff]);
		}else if(page_num<=mid){
			let buff = []
			for(let i=0; i<len; i++){
				buff.push({'charset':i+1,'to_num':i+1, 'type':true})
			}
			buff[page_num-1] = {'charset':page_num,'to_num':page_num, 'type':false}
			buff = [to_left, ...buff, to_right]
			set_nums(buff);
		}else if(page_num>=s-mid+1){
			let buff = []
			for(let i=s-len+1; i<s; i++){
				if(i+1==page_num){
					buff.push({'charset':page_num,'to_num':page_num, 'type':false})
					continue
				}
				buff.push({'charset':i+1,'to_num':i+1, 'type':true})
			}
			buff = [to_left, ...buff, to_right]
			set_nums(buff);
		}else {
			let start = page_num - mid;
			if(2*mid == len){
				start = page_num-mid+1
			}
			let buff = []
			for(let i = start; i<= start+len-1; i++){
				if(i+1==page_num){
					buff.push({'charset':page_num,'to_num':page_num, 'type':false})
					continue
				}
				buff.push({'charset':i+1,'to_num':i+1, 'type':true})
			}
			buff = [to_left, ...buff, to_right]
			set_nums(buff);
		}
	}
	useEffect(()=>{
		change_nums()
	}, [props])
	return (
		<div className='pagination_container'>
			{nums.map((item)=>{
				return (
					<Square charset={item.charset} to_num={item.to_num} set_page={set_page} type={item.type} key={item.charset}></Square>
				)
			})}
		</div>
	)
}

export default Pagination