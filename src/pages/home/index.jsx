import './index.css'

import React from 'react'
import {observer} from 'mobx-react'
import { Link, Outlet } from 'react-router-dom'
import Banner from '../../components/banner/index.jsx'
import Playlist from '../../components/playlist'
import Store_context from '../../store/index.js'

class Home extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			banner:[],
			playlist:[]
		}
	}

	async get_banner(){
		let res = await window.api.music_api(['/banner', {}])
		// console.log(res.body.banners);
		this.setState({
			banner: res.body.banners
		})
	}

	async get_playlist(){
		let res;
		if(this.context.user.uid === ''){
			res = await window.api.music_api(['/personalized', {}])
		}else{
			res = await window.api.music_api(['/recommend/resource', {}])
		}
		this.setState({
			playlist: res.body.result.slice(0, 10)
		})
		// console.log(res.body.result);
	}

	async componentDidMount(){
		await this.get_banner();
		console.log(this.context)
		await this.get_playlist();
	}

	render(){
		return (
			<main className='main flex-1'>
				<div className="main_container">
					<Banner banner={this.state.banner}></Banner>
					<div className="playlist_container">
						{this.state.playlist.map((item, index, _list)=>{
							return (
								<Link to={`/playlist/${item.id}`} key={item.id}>
									<Playlist img={item.picUrl} name={item.name} id={item.id}></Playlist>
								</Link>
							)
							
						})}
					</div>
				</div>
			</main>
		)
	}
}
Home.contextType = Store_context;
export default observer(Home)