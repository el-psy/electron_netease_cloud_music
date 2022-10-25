import './index.css';
import '../../css/thin_table.css'

import Show_header from '../../components/show_header';

import React from "react";
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';

let get_head = function(detail){
	let head_buff = {
		title:'',
		img_url:'',
		single:[],
		pair:[]
	}
	head_buff.title = detail.playlist.name;
	head_buff.img_url = detail.playlist.coverImgUrl
	head_buff.single = [
		`${detail.playlist.creator.nickname} 创建`
	]
	head_buff.pair = [
		{
			head:'歌曲',
			body:detail.playlist.trackCount
		},
		{
			head:'播放',
			body:detail.playlist.playCount
		},
		{
			head:'标签',
			body:detail.playlist.tags.join('/')
		},
		{
			head:'简介',
			body:detail.playlist.description
		}
	]
	return head_buff
}

let Playlist = function(props){
	// console.log('playlist', props);
	let params = useParams();
	// console.log('params', params);

	let [head, set_head] = useState({
		title:'',
		img_url:'',
		single:[],
		pair:[]
	})
	let [table_data, set_table] = useState([])

	let get_playlist_info = async function(){
		let res = await window.api.music_api(['/playlist/detail', {id: params.id}])
		let detail = res.body
		res = await window.api.music_api(['/playlist/track/all', {id: params.id}])
		let songs = res
		console.log('songs', songs);

		set_head(get_head(detail))

		let table_buff = songs.body.songs.map((item, index)=>{
			return {
				name: item.name,
				artist: item.ar[0].name,
				album: item.al.name,
				time: item.dt,
				cp: songs.body.privileges[index].cp,
				id:item.id
			}
		})
		set_table(table_buff)
	}
	useEffect(()=>{
		get_playlist_info()
	}, [params])
	return (
		<main className='main'>
			<Show_header img_url={head.img_url} title={head.title} single={head.single} pair={head.pair}></Show_header>
			<div className='playlist_table thin_table'>
				<div className="table_row">
					<div className='table_index td'><p></p></div>
					<div className="table_row_container">
						<div className='table_1 text td'><p>标题</p></div>
						<div className='table_2 text td'><p>歌手</p></div>
						<div className='table_3 text td'><p>专辑</p></div>
					</div>
					<div className='table_4 td'><p>时间</p></div>
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
						</div>
					)
				})}	
			</div>
		</main>
	)
}

export default Playlist