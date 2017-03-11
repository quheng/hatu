import React from 'react'
import styles from './index.css'
import api from '../../api'

import { Link, browserHistory } from 'react-router'
import { Form, Icon, Input, Button, message } from 'antd'
const FormItem = Form.Item

const SignUpForm = Form.create()(React.createClass({
  getInitialState: () => ({
    loading: false
  }),
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password !== values.confirmPassword) {
          message.error('The two passwords don\'t match')
          return
        }
        this.setState({ loading: true })

        api.signUp(values)
          .then(res => {
            message.success('注册成功，请登录')
            this.setState({ loading: false })
            if (res.status === 200) {
              setTimeout(() => {
                browserHistory.push('/login')
              }, 500)
            } else {
              res.json().then(({ error }) => {
                message.error(error)
                this.props.form.setFieldsValue({
                  username: '',
                  password: '',
                  confirmPassword: ''
                })
              })
            }
          })
      }
    })
  },
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={styles.signUpForm}>
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
          {getFieldDecorator('confirmPassword', {
            rules: [{ required: true, message: 'Please confirm your Password!' }]
          })(
            <Input addonBefore={<Icon type='lock' />} type='password' placeholder='confirm your Password' />
          )}
        </FormItem>
        <Link to='/login'>already have account? </Link>
        <FormItem>
          <Button
            type='primary'
            htmlType='submit'
            loading={this.state.loading}
            className={styles.signUpFormButton
            }>
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
          sign up for Hatu
        </div>
        <SignUpForm />
      </div>
    )
  }
}

export default SignUp
