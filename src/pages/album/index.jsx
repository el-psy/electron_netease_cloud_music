import './index.css';
import '../../css/thin_table.css'

import Show_header from '../../components/show_header';

import React from "react";
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';

let Pop = function(props){
	let style = {width:props.pop+'%'}
	return (
		<div className='pop'>
			<div style={style}>

			</div>
		</div>
	)
}


let Album = function(props){
	// console.log('album', props);
	let params = useParams();
	console.log('album', params);

	let [head, set_head] = useState({
		title:'',
		img_url:'',
		single:[],
		pair:[]
	})
	let [table_data, set_table] = useState([])

	let get_album_info = async function(){
		let res = await window.api.music_api(['/album', {id: params.id}])
		console.log(res);
		let head_buff = {
			title:'',
			img_url:'',
			single:[],
			pair:[]
		}
		let publishTime = new Date(res.body.album.publishTime)
		head_buff.title = res.body.album.name
		head_buff.img_url = res.body.album.picUrl;
		head_buff.pair = [
			{
				head:'歌手',
				body:res.body.album.artist.name
			},
			{
				head:'时间',
				body:publishTime.toLocaleDateString().replace(/\//g,'-')
			}
		]
		set_head(head_buff)

		let songs = res.body.songs;

		let table_buff = songs.map((item, index)=>{
			return {
				name: item.name,
				artist: item.ar[0].name,
				album: res.body.album.name,
				time: item.dt,
				cp: item.cp,
				id:item.id,
				pop: <Pop pop={item.pop}></Pop>
			}
		})

		set_table(table_buff)
	}

	useEffect(()=>{
		get_album_info();
	}, [params]);
	return (
		<main className='main'>
			<Show_header img_url={head.img_url} title={head.title} single={head.single} pair={head.pair}></Show_header>
			<div className="album_table thin_table">
				<div className="table_row">
					<div className='table_index td'><p></p></div>
					<div className="table_row_container">
						<div className='table_1 text td'><p>标题</p></div>
						<div className='table_2 text td'><p>歌手</p></div>
						<div className='table_3 text td'><p>专辑</p></div>
					</div>
					<div className='table_4 td'><p>时长</p></div>
					<div className='table_5 td'><p>热度</p></div>
				</div>

				{table_data.map((item, index)=>{
					return (
						<div className="table_row" key={item.id}>
							<div className='table_index td'><p>{index+1}</p></div>
							<div className="table_row_container">
								<div className='table_1 text td'><p>{item.name}</p></div>
								<div className='table_2 text td'><p>{item.artist}</p></div>
								<div className='table_3 text td'><p>{item.album}</p></div>
							</div>
							<div className='table_4 td'><p>{item.time}</p></div>
							<div className='table_5 td'>{item.pop}</div>
						</div>
					)
				})}
			</div>
		</main>
	)
}

export default Album