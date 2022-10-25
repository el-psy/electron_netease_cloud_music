import { useState, lazy, Suspense } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import {Routes, Route, HashRouter, Outlet, redirect} from 'react-router-dom'

// import Header from './pages/header/inedx.jsx'
// import Sider from './pages/sider/index.jsx'
import Layout from './pages/layout'
import Home from './pages/home/index.jsx'
import Loading from './components/loading/index.jsx'

let Album = lazy(()=> import('./pages/album/index.jsx'));
let Playlist = lazy(()=> import('./pages/playlist/index.jsx'));
let Login = lazy(()=> import('./pages/login/index.jsx'));
let Search = lazy(()=>import('./pages/search/index.jsx'));
let Artist = lazy(()=>import('./pages/artist/index.jsx'));

function App() {

	return (
		<HashRouter>
			<Suspense fallback={<Loading/>}>
				<Routes>
					<Route path='/' element={<Layout />}>
						<Route path='' element={<Home/>}></Route>
						<Route path='login' element={<Login />}></Route>
						<Route path='playlist/:id' element={<Playlist/>}></Route>
						<Route path='album/:id' element={<Album />}></Route>
						<Route path='artist/:id' element={<Artist/>}></Route>
						<Route path='search/:value' element={<Search/>}></Route>
					</Route>
				</Routes>
			</Suspense>
		</HashRouter>
	)
}

export default App
