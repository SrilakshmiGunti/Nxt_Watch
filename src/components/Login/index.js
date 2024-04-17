import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import CartContext from '../../context/CartContext'

import {
  LoginFormContainer,
  FormContainer,
  LoginWebsiteLogo,
  InputContainer,
  LoginButton,
  UserNameInputField,
  PasswordInputField,
  InputLabel,
  ShowHideContainer,
  ErrorMessage,
  CheckboxInput,
} from './styledComponents'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    isCheckedPassword: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onShowHidePassword = () => {
    this.setState(prev => ({isCheckedPassword: !prev.isCheckedPassword}))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <InputLabel htmlFor="username">USERNAME</InputLabel>
        <UserNameInputField
          type="text"
          id="username"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password, isCheckedPassword} = this.state
    return (
      <>
        <InputLabel htmlFor="password">PASSWORD</InputLabel>
        <PasswordInputField
          type={isCheckedPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
        <ShowHideContainer>
          <CheckboxInput
            type="checkbox"
            id="show-password"
            checked={isCheckedPassword}
            onChange={this.onShowHidePassword}
          />
          <InputLabel htmlFor="show-password">Show Password</InputLabel>
        </ShowHideContainer>
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <CartContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'
          const formBgColor = isDarkTheme ? '#181818' : '#f9f9f9'

          return (
            <LoginFormContainer bgColor={bgColor}>
              <FormContainer
                onSubmit={this.submitForm}
                formBgColor={formBgColor}
              >
                <LoginWebsiteLogo
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                  alt="website logo"
                />
                <InputContainer>{this.renderUsernameField()}</InputContainer>
                <InputContainer>{this.renderPasswordField()}</InputContainer>
                <LoginButton type="submit">Login</LoginButton>
                {showSubmitError && <ErrorMessage>*{errorMsg}</ErrorMessage>}
              </FormContainer>
            </LoginFormContainer>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default Login
