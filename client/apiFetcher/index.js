
export default class ApiFetcher {
  constructor (config) {
    this.config = config
  }

  async logIn ({ username, password }) {
    return await fetch(`${this.config.server}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': URLENCODED_FORMDATA
      },
      body: qs.stringify({
        username,
        password
      }),
      credentials: 'include'
    })
  }

  async signUp ({ username, password, confirm, email, phone }) {
    return await fetch(`${this.config.server}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': URLENCODED_FORMDATA
      },
      body: qs.stringify({
        username,
        password,
        confirm,
        email,
        phone
      }),
      credentials: 'include'
    })
  }

  async logOut () {
    return await fetch(`${this.config.server}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  }
}
