import React from 'react'
import styles from './index.css'
import api from '../../api'

import { Link, browserHistory } from 'react-router'
import { Form, Icon, Input, Button, message } from 'antd'
const FormItem = Form.Item

const LoginForm = Form.create()(React.createClass({
  getInitialState: () => ({
    loading: false
  }),
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        api.logIn(values)
          .then(res => {
            this.setState({ loading: false })
            if (res.status === 200) {
              message.success('登录成功')
              setTimeout(() => {
                browserHistory.push('/')
              }, 300)
            } else {
              message.error('incorrect username or password')
              this.props.form.setFieldsValue({
                password: ''
              })
            }
          })
      }
    })
  },
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input addonBefore={<Icon type='user' />} placeholder='Username' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input addonBefore={<Icon type='lock' />} type='password' placeholder='Password' />
          )}
        </FormItem>
        <FormItem>
          <Button
            type='primary'
            htmlType='submit'
            loading={this.state.loading}
            className={styles.loginFormButton}>
            Log in
          </Button>
          Or <Link to='/signup'>sign up now! </Link>
        </FormItem>
      </Form>
    )
  }
}))

class Login extends React.Component {
  render () {
    return (
      <div className={styles.login}>
        <div className={styles.welcomeFont}>
          Welcome to Hatu, please login first !
        </div>
        <LoginForm />
      </div>
    )
  }
}

export default Login
