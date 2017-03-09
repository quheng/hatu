import React from 'react'
import styles from './index.css'

import { browserHistory } from 'react-router'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
const FormItem = Form.Item

const RegisterForm = Form.create()(React.createClass({
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
      <Form onSubmit={this.handleSubmit} className={styles.registerForm}>
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
          {getFieldDecorator('confirmPassword', {
            rules: [{ required: true, message: 'Please confirm your Password!' }]
          })(
            <Input addonBefore={<Icon type='lock' />} type='password' placeholder='confirm your Password' />
          )}
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit' className={styles.registerFormButton}>
            register
          </Button>
        </FormItem>
      </Form>
    )
  }
}))

class Register extends React.Component {
  render () {
    return (
      <div className={styles.register}>
        <div className={styles.welcomeFont}>
          register a hatu account
        </div>
        <RegisterForm />
      </div>
    )
  }
}

export default Register
