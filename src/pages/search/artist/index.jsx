import './index.css'
import '../../../css/wide_table.css'

import {Link} from 'react-router-dom'

let Artist = function(props){
	let artists = props.data;
	artists = artists.artists || [];
	// console.log('artist', props);
	return (
		<div className='search_artist_container'>
			<div className='search_artist wide_table'>
					{artists.map((item)=>{
						return (
							<Link to={`/artist/${item.id}`} key={item.id}>
								<div className='table_row'>
									<div className='img_container td'>
										<img src={item.picUrl} alt="" />
									</div>
									<div className='td text'>
										<span className='artist_name'>{item.name}</span>
									</div>
								</div>
							</Link>
						)
					})}
			</div>
		</div>
	)
}

export default Artist