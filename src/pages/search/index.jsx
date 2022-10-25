import './index.css';

import React, { useState, useEffect, useLayoutEffect, lazy } from "react";
import {useParams} from 'react-router-dom';

import Pagination from '../../components/pagination/index.jsx'
let Song = lazy(()=>import('./song/index.jsx'));
let Album = lazy(()=>import('./album/index.jsx'));
let Artist = lazy(()=>import('./artist/index.jsx'));
let Playlist = lazy(()=>import('./playlist/index.jsx'));

let Search = function(props){

	let Com_obj={
		1:Song,
		10:Album,
		100:Artist,
		1000:Playlist
	}
	let type_keys = [[1, '歌曲'],[10, '专辑'],[100, '歌手'], [1000, '歌单']]
	// console.log(props);
	let params = useParams();
	// console.log('params',params);

	let [type_value, set_type] = useState(1)
	let Child_component = Com_obj[type_value]
	useEffect(()=>{
		Child_component = Com_obj[type_value]
	}, [type_value])

	let limit = 30;
	let [page_value, set_page] = useState(1)
	let [offset, set_offset] = useState(0);
	useEffect(()=>{
		set_offset(limit*(page_value-1))
	}, [page_value])

	let [res, set_res] = useState({})
	let [page_sum, set_page_sum] = useState(0)
	let search = async function(){
		let buff = await window.api.music_api(['/cloudsearch', {keywords: params.value, type: type_value, offset:offset}])
		buff = buff.body.result
		set_res(buff)
		if(type_value==1){
			// console.log('songCount', buff, buff.songCount);
			set_page_sum(Math.ceil(parseInt(buff.songCount)/limit || 1))
		}else if(type_value==10){
			set_page_sum(Math.ceil(parseInt(buff.albumCount)/limit || 1))
		}else if(type_value==100){
			set_page_sum(Math.ceil(parseInt(buff.artistCount)/limit || 1))
		}
		
	}
	// console.log('page_sum', page_sum);
	// if(page_sum==0){
	// 	search()
	// }
	useEffect(()=> {
		search()
		// console.log('res',res);
	}, [type_value, offset, params])

	return (
		<main className="main flex-1">
			<div className="main_container">
				<div className="tab flex">
					<div>
						{type_keys.map((item)=>{
							return <button key={item[0]} onClick={(e)=>set_type(item[0])} className={item[0]==type_value? 'chosed':''}>{item[1]}</button>
						})}
					</div>
				</div>
				<Child_component data={res}></Child_component>
				<Pagination s={page_sum} page_num={page_value} len={5} set_page={set_page}></Pagination>
			</div>
		</main>
	)
}

export default Search