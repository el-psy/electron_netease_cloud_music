import './index.css'
import React from 'react'

class Playlist extends React.Component {
	constructor(props){
		super(props)
		this.state={
			id:props.id
		}
	}

	render(){
		return (
			<div className='playlist_square'>
				<div className='relative'>
					<img src={this.props.img} alt="" className='playlist_img'/>
					<div className="w-8 h-8 svg_container">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
	<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
	</svg>
					</div>
				</div>
				<p className='playlist_name'>{this.props.name}</p>
			</div>
		)
	}
}

export default Playlist