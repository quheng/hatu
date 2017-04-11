import fetch from 'isomorphic-fetch'
import qs from 'querystring'

const URLENCODED_FORM_DATA = 'application/x-www-form-urlencoded'

class ApiFetcher {
  constructor (config) {
    this.config = config
  }

  logIn ({ username, password }) {
    return fetch(`${this.config.server}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': URLENCODED_FORM_DATA
      },
      credentials: 'include',
      body: qs.stringify({
        username,
        password
      })
    })
  }

  signUp ({ username, password }) {
    return fetch(`${this.config.server}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': URLENCODED_FORM_DATA
      },
      credentials: 'include',
      body: qs.stringify({
        username,
        password
      })
    })
  }

  logOut () {
    return fetch(`${this.config.server}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  }

  imageList () {
    return fetch(`${this.config.server}/api/images`, {
      method: 'GET',
      credentials: 'include'
    })
  }

  swcList (image) {
    return fetch(`${this.config.server}/api/swcs/${image}`, {
      method: 'GET',
      credentials: 'include'
    })
  }

  swc (swc) {
    return fetch(`${this.config.server}/dvid/swc/key/${swc}`, {
      method: 'GET',
      credentials: 'include'
    })
  }
}

// todo  get server address
export default new ApiFetcher({server: 'http://localhost:2222'})
