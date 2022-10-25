import {makeAutoObservable} from 'mobx';

class User {
	constructor() {
		this.uid = '';
		makeAutoObservable(this)
	}
}

export default User