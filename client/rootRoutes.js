import Home from './component/Home'
import Login from './component/Login'
import SignUp from './component/SignUp'

export default [
  {
    path: '/',
    component: Home
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/signup',
    component: SignUp
  }
]
