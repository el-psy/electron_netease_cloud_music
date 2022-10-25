const fs = require('fs')
const path = require('path')
const request = require('./util/request')
const { cookieToJson } = require('./util/index')
const decode = require('safe-decode-uri-component')


async function getModulesDefinitions(
  modulesPath,
  specificRoute,
  doRequire = true,
) {
  const files = await fs.promises.readdir(modulesPath)
  const parseRoute = (/** @type {string} */ fileName) =>
    specificRoute && fileName in specificRoute
      ? specificRoute[fileName]
      : `/${fileName.replace(/\.js$/i, '').replace(/_/g, '/')}`

  const modules = files
    .reverse()
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
      const identifier = file.split('.').shift()
      const route = parseRoute(file)
      const modulePath = path.join(modulesPath, file)
      const module = doRequire ? require(modulePath) : modulePath

      return { identifier, route, module }
    })

  return modules
}


class App {
	constructor(){
		this.routes = {}
		this.cookie = {}
	}
	use(route, http_fn){
		this.routes[route] = http_fn
	}
	http(route, params){
    console.log(route)
    console.log(this.routes[route])
		let res = this.routes[route]({query:params, cookie: this.cookie, body:{}}, {})
		if(res.cookie){
			this.cookie = res.cookie
		}
		return res
	}
}

async function consturctServer(moduleDefinitions) {
  const app = new App()

  for (const moduleDef of moduleDefinitions) {
    // Register the route.
    app.use(moduleDef.route, async (req, res) => {

      [req.query, req.body].forEach((item) => {
        if (typeof item.cookie === 'string') {
          item.cookie = cookieToJson(decode(item.cookie))
        }
      })

      let query = Object.assign(
        {},
        { cookie: req.cookies },
        req.query,
        req.body,
        req.files,
      )
	  const moduleResponse = await moduleDef.module(query, (...params) => {
		// 参数注入客户端IP
		const obj = [...params]

		return request(...obj)
	  })
	  return moduleResponse

    })
  }

  return app
}

let request_api = async function(mode_path) {
  const special = {
    'daily_signin.js': '/daily_signin',
    'fm_trash.js': '/fm_trash',
    'personal_fm.js': '/personal_fm',
  }
  let moduleDefinitions = await getModulesDefinitions(path.join(__dirname, mode_path), special)
	req = await consturctServer(moduleDefinitions)
	return req
}

// let core = async function(){
//   req = await request_api('module');
//   print_json = await req.http('/cloudsearch', {'keywords': '螢塚'})
// 	print_json = JSON.stringify(print_json, space=4)
// 	console.log(print_json)
// }

// core('module')

module.exports =  request_api