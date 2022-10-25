import './index.css'
import Show_img from './show_img/index.jsx'
import Show_ul from './show_ul/index.jsx'

let Show_header = function(props){
	// console.log('show_header', props);
	return (
		<div className='show_header'>
			<Show_img url={props.img_url}></Show_img>
			<Show_ul title={props.title} single={props.single} pair={props.pair}></Show_ul>
		</div>
	)
}

export default Show_header