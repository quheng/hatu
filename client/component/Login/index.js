import React from 'react'
import styles from './index.css'

import { Link } from 'react-router'
import { Form, Icon, Input, Button } from 'antd'
const FormItem = Form.Item

const LoginForm = Form.create()(React.createClass({
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  },
  render () {
    console.log(this.props)
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
        <FormItem>
          {getFieldDecorator('userName', {
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
          <Button type='primary' htmlType='submit' className={styles.loginFormButton}>
            Log in
          </Button>
          Or <Link to='/register'>register now! </Link>
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