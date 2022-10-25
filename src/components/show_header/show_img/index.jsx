import './index.css'

let Show_img = function(props){
	return (
		<div className='show_img_container'>
			<img src={props.url} alt="" />
		</div>
	)
}

export default Show_img