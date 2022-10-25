import './index.css'
import React from 'react'
import {Outlet} from 'react-router-dom'

import Header from '../header/inedx'
import Sider from '../sider'

class Layout extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<>
				<Header />
				<div className='flex flex-row flex-1 w-full'>
					<Sider />
					<Outlet />
				</div>
			</>
		)
	}
}

export default Layout