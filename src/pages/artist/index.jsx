import './index.css'
import '../../css/thin_table.css'

import React, { useState } from 'react'
import {useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'

import Pagination from '../../components/pagination/index.jsx';
import Show_header from '../../components/show_header';

let Hot_song = function(props){
	let [hot_songs, set_hot] = useState([])
	let get_hot_songs = async function(){
		let res = await window.api.music_api(['/artist/top/song', {id: props.id}])
		let songs = res.body.songs;
		let songs_buff = songs.map((item, index)=>{
			return {
				name: item.name,
				album: item.al.name,
				time: item.dt,
				id: item.id
			}
		})
		set_hot(songs_buff);
		console.log('Hot song', res);
	}

	useEffect(()=>{
		get_hot_songs()
	}, [props]);

	return (
		<div className="hot_song_table thin_table">
			<div className="table_row">
					<div className='table_index td'><p></p></div>
					<div className="table_row_container">
						<div className='table_1 text td'><p>标题</p></div>
						<div className='table_2 text td'><p>专辑</p></div>
					</div>
					<div className='table_3 td'><p>时长</p></div>
			</div>
			{hot_songs.map((item, index)=>{
				return (
					<div className="table_row" key={item.id}>
						<div className='table_index td'><p>{index+1}</p></div>
						<div className="table_row_container">
							<div className='table_1 text td'><p>{item.name}</p></div>
							<div className='table_2 text td'><p>{item.album}</p></div>
						</div>
						<div className='table_3 td'><p>{item.time}</p></div>
					</div>
				)
			})}
		</div>
	)
}

let Artist_album = function(props){
	let [albums, set_albums] = useState([]);
	let [page_value, set_page] = useState(1);

	let get_albums = async function(){
		let limit = 30;
		let offset = (page_value-1)*limit;
		let res = await window.api.music_api(['/artist/album', {id: props.id, offset:offset}])
		let albums_buff = res.body.hotAlbums.map((item, index)=>{
			return {
				id:item.id,
				picUrl: item.picUrl,
				name: item.name
			}
		})
		set_albums(albums_buff);
		console.log('album', offset, albums_buff);
	}

	useEffect(()=>{
		get_albums()
	}, [props, page_value]);

	useEffect(()=>{
		console.log('albums', albums);
	}, [albums])
	console.log('albums', props.size);
	return (
		<div className="artist_album">
			<div className="albums_grid">
				{albums.map((item)=>{
					return (
						<Link to={`/album/${item.id}`} key={item.id}>
							<div className="album_square">
								<div className="img_container">
									<img src={item.picUrl} alt="" />
								</div>
								<div className="album_name">
									{item.name}
								</div>
							</div>
						</Link>
						
					)
					
				})}
			</div>
			<Pagination s={props.size} page_num={page_value} len={5} set_page={set_page}></Pagination>
		</div>
	)
}

let Artist = function(props){
	let params = useParams();
	// console.log('artist', params);

	let [tab_index, set_tab] = useState(0)
	let [album_size, set_album] = useState(0);
	let Tab_com = [
		<Hot_song id={params.id}></Hot_song>,
		<Artist_album id={params.id} size={Math.ceil(album_size/30)}></Artist_album>
	]

	let [head_data, set_head] = useState({
		title:'',
		img_url:'',
		single:[],
		pair:[]
	})

	let get_artist_info = async function(){
		let res = await window.api.music_api(['/artist/detail', {id: params.id}])
		let detail = res.body.data.artist;
		let head_buff = {
			title:detail.name,
			img_url:detail.cover,
			single:[],
			pair:[
				{
					head:'歌曲数',
					body:detail.musicSize,
				},
				{
					head:'专辑数',
					body:detail.albumSize
				},
				{
					head:'MV数',
					body:detail.mvSize
				}
			]
		}
		set_head(head_buff)
		set_album(parseInt(detail.albumSize))
		// console.log(typeof detail.albumSize)
		// console.log(res);
	}

	useEffect(()=>{
		get_artist_info()
	}, [params])

	return (
		<main className='main'>
			<Show_header img_url={head_data.img_url} title={head_data.title} single={head_data.single} pair={head_data.pair}></Show_header>
			<div className="album_tab_select_container">
				<button onClick={(e)=>set_tab(0)}>热曲50首</button>
				<button onClick={(e)=>set_tab(1)}>专辑</button>
			</div>
			<div className="album_tab_container">
				{Tab_com[tab_index]}
			</div>
		</main>
	)
}


export default Artist