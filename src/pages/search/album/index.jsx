import './index.css'
import '../../../css/wide_table.css'
import {Link} from 'react-router-dom'

let Artist = function(props){
	return (
		<>
			{props.artists.map((item, index)=>{
				if(index==0) return <span key={item.id}>{item.name}</span>
				else return <span key={item.id}>/<span>{item.name}</span></span>
			})}
		</>
	)
}

let Album = function(props){
	// console.log('album', props);
	let albums = props.data
	if(!albums['albums']){
		return null
	}
	albums = albums.albums
	// console.log('album', albums)
	// return <div></div>
	return (
		<div className='search_album_container'>
			<div className="search_album wide_table">
					{albums.map((item)=>{
						return (
							<Link to={`/album/${item.id}`} key={item.id}>
								<div className='table_row'>
									<div className='img_container td'>
										<img src={item.blurPicUrl} alt="" className="album" />
									</div>
									<div className="table_row_container">
										<div className='table_1 text td'>
											<span className='album_name'>{item.name}</span>
										</div>
										<div className='table_2 text td'>
											<span><Artist artists={item.artists}></Artist></span>
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

export default Album