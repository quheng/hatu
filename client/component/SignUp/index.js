import React from 'react'
import styles from './index.css'

import { Form, Icon, Input, Button } from 'antd'
const FormItem = Form.Item

const SignUpForm = Form.create()(React.createClass({
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
      <Form onSubmit={this.handleSubmit} className={styles.signUpForm}>
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
          <Button type='primary' htmlType='submit' className={styles.signUpFormButton}>
            sign up
          </Button>
        </FormItem>
      </Form>
    )
  }
}))

class SignUp extends React.Component {
  render () {
    return (
      <div className={styles.signUp}>
        <div className={styles.welcomeFont}>
          sign up for hatu
        </div>
        <SignUpForm />
      </div>
    )
  }
}

export default SignUp
