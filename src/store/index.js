import User_store from './user.js'
import {configure} from 'mobx';
import React from 'react'
configure({
	enforceActions: 'never'
})

class Store {
	constructor(){
		this.user = new User_store()
	}
}

const store = new Store()
const Store_context = React.createContext(store)
// const use_store = ()=> React.useContext(context)

export default Store_context