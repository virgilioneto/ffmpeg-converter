const CLIENT_ID = 'ceSfHlzX1dW8ppuHxztCDyKd203eK90Z'
const DOMAIN = 'amarian.auth0.com'
let idToken = null
let profile = null

class Auth0 {

  static init () {
    Auth0.lock = new Auth0Lock(CLIENT_ID, DOMAIN, {
      auth: { redirect: false, sso: false }
    })
    idToken = localStorage.getItem('id_token') || null
    profile = JSON.parse(localStorage.getItem('profile')) || null

    Auth0.lock.on('authenticated', onAuthenticated)
  }

  static get profile () {
    return profile
  }

  static signIn () {
    Auth0.lock.show()
  }

  static signOut () {
    idToken = null
    profile = null
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    window.location.reload(true)
  }
}

function onAuthenticated (authResult = {}) {
  idToken = authResult.idToken
  localStorage.setItem('id_token', idToken)
  Auth0.lock.getProfile(authResult.idToken, (error, profileData) => {
    if (error) throw error
    profile = profileData
    localStorage.setItem('profile', JSON.stringify(profile))
    window.location.reload(true)
  })
  Auth0.lock.hide()
}

module.exports = Auth0