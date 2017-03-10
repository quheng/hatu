import fetch from 'isomorphic-fetch'
import qs from 'querystring'

const URLENCODED_FORM_DATA = 'application/x-www-form-urlencoded'

class ApiFetcher {
  constructor (config) {
    this.config = config
  }

  async logIn ({ username, password }) {
    return await fetch(`${this.config.server}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': URLENCODED_FORM_DATA
      },
      body: qs.stringify({
        username,
        password
      }),
    })
  }

  async signUp ({ username, password }) {
    return await fetch(`${this.config.server}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': URLENCODED_FORM_DATA
      },
      body: qs.stringify({
        username,
        password
      }),
    })
  }

  async logOut () {
    return await fetch(`${this.config.server}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  }
}

// todo  get server address
export default new ApiFetcher({server: 'http://localhost:2222'})