import './index.css';
import '../../../css/thin_table.css';

let Pop = function(props){
	let style = {width:props.pop+'%'}
	return (
		<div className='pop'>
			<div style={style}>

			</div>
		</div>
	)
}

let Single_song = function(props){
	let song = props.song;
	let name = song.name;
	let ar = song.ar || [];
	ar = ar.map((item, index)=>{
		// return <span key={item.id}>{item.name}</span>
		if(index!=0) return <span key={item.id}><span>/</span><span>{item.name}</span></span>
		else return <span key={item.id}>{item.name}</span>
	})
	let al = song.al
	// console.log('al',al);
	let pop = song.pop
	return (
		<div className='table_row'>
			<div className='table_index td'><p>{props.index.toString().padStart(2, '0')}</p></div>
			<div className="table_row_container">
				<div className='table_1 td'><p>{name}</p></div>
				<div className='table_2 td'><p>{ar}</p></div>
				<div className='table_3 td'><p>{al.name}</p></div>
			</div>
			<div className='pop_container table_4 td'><Pop pop={pop}></Pop></div>
		</div>
	)
}

let Song = function(props){
	// console.log(props);
	let songs = props.data.songs || [];
	// console.log(songs);
	return (
		<div className='search_song_container'>
			<div className='search_song thin_table'>
				<div className='table_row'>
					<div className='table_index td'><p></p></div>
					<div className="table_row_container">
						<div className='table_1 td'><p className='head'>标题</p></div>
						<div className='table_2 td'><p className='head'>歌手</p></div>
						<div className='table_3 td'><p className='head'>专辑</p></div>
					</div>
					<div className='table_4 td'><p className='head'>热度</p></div>
				</div>
				{songs.map((item, index)=>{
					return <Single_song song={item} index={index+1} key={item.id}></Single_song>
				})}
			</div>
		</div>
	)
}

export default Song;