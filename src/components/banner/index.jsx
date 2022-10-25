import './index.css'
import React from 'react'

class Banner extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			center:0,
			classes:[]
		}
		this.repeat_handler = undefined;
		this.click_point = false;
		this.init_classes = this.init_classes.bind(this)
		this.get_index = this.get_index.bind(this)
		this.to_right = this.to_right.bind(this)
		this.to_left = this.to_left.bind(this)
	}

	get_index(center){
		let center_index, left_index, right_index;
		center_index = center
		if(center == this.props.banner.length-1){
			right_index = 0
		}else{
			right_index = center_index+1
		}
		if(center == 0){
			left_index = this.props.banner.length-1
		}else{
			left_index = center_index-1
		}
		return {'center_index':center_index, 'right_index':right_index, 'left_index':left_index}
	}

	init_classes(){
		let classes = []
		if(!this.props.banner){
			return ;
		}
		let {center_index, left_index, right_index} = this.get_index(this.state.center)
		for(let index in this.props.banner){
			if(index == center_index){
				classes.push('banner_center')
			}else if(index == left_index){
				classes.push('banner_left')
			}else if(index == right_index){
				classes.push('banner_right')
			}else {
				classes.push('banner_back')
			}
		}
		// console.log(classes);
		this.setState({
			classes: classes
		})
	}

	to_right(){
		let center = (this.state.center+1)%this.props.banner.length;
		this.setState((state, props)=>{
			return {center: (state.center+1)%props.banner.length}
		})
		let {center_index, left_index, right_index} = this.get_index(center)
		let classes = this.props.banner.map(()=> 'banner_back')
		classes[center_index] = 'left_center'
		// console.log(left_index);
		classes[left_index] = 'back_left'
		classes[right_index] = 'center_right'
		classes[right_index+1<this.props.banner.length ? right_index+1: 0] = 'right_back'
		this.setState({
			classes: classes
		})
	}

	to_left(){
		let center = (this.state.center-1+this.props.banner.length)%this.props.banner.length;
		this.setState((state, props)=>{
			return {center: (state.center-1+props.banner.length)%props.banner.length}
		})
		let {center_index, left_index, right_index} = this.get_index(center)
		let classes = this.props.banner.map(()=> 'banner_back')
		classes[center_index] = 'right_center'
		// console.log(left_index);
		classes[left_index] = 'center_left'
		classes[right_index] = 'back_right'
		classes[left_index-1>0 ? left_index-1: this.props.banner.length-1] = 'left_back'
		this.setState({
			classes: classes
		})
	}

	componentDidMount(){
		this.repeat_handler = setInterval(() => {
			this.to_left()
		}, 6000);
		this.init_classes();
	}
	
	componentDidUpdate(pre_props, pre_state){
		if(pre_props != this.props){
			this.init_classes();
		}
		// this.init_classes();
	}

	componentWillUnmount(){
		clearInterval(this.repeat_handler)
	}

	render(){
		let {banner: banner_list} = this.props;
		// let class_list = this.get_classes(banner_list);
		// console.log(banner_list);
		// let single = banner_list[0];
		// console.log(single);
		return (
			<div className='banner relative'>
				{this.state.classes.map((item, index)=>{
					return <img draggable="false" src={banner_list[index].imageUrl} className={item} key={banner_list[index].imageUrl}/>
				})}
				<img draggable="false" src={banner_list.length>0 ? banner_list[0].imageUrl:''} className='banner_center' style={{position: 'relative', visibility:'hidden'}}/>
				{/* {<img draggable="false" src={this.get_first_img()} className='banner_center'/>} */}
				<button className='button_right' onClick={this.to_right}>{'>'}</button>
				<button className='button_left' onClick={this.to_left}>{'<'}</button>
			</div>
		)
	}
}

export default Banner