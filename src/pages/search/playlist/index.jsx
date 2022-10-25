import './index.css'
import '../../../css/wide_table.css'

import {Link} from 'react-router-dom'

let Playlist = function(props){
	let playlists = props.data;
	playlists = playlists.playlists || [];
	// console.log('playlists', playlists);
	return (
		<div className='search_playlist_container'>
			<div className='search_playlist wide_table'>
				{playlists.map((item)=>{
					return (
						<Link to={`/playlist/${item.id}`} key={item.id}>
							<div className='table_row'>
								<div className='img_container td'>
									<img src={item.coverImgUrl} alt="" />
								</div>
								<div className="table_row_container">
									<div className='table_1 text td'>
										<span className='playlist_name'>{item.name}</span>
									</div>
									<div className='table_2 text td'>
										<span className='playlist_creator'>{item.creator.nickname}</span>
									</div>
									<div className='table_3 text td'>
										<span className='playlist_playcount'>播放: {item.playCount}</span>
									</div>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}

export default Playlist