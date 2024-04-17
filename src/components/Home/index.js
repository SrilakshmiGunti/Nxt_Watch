import {Component} from 'react'

import {IoMdClose} from 'react-icons/io'

import Header from '../Header'

import SearchVideos from '../SearchVideos'

import CartContext from '../../context/CartContext'

import {
  HomeContainer,
  HomeSideContainer,
  BannerImage,
  BannerDescription,
  HomeStickyContainer,
  CloseButton,
  ModalContainer,
  GetItNowButton,
  BannerImageContainer,
} from './styledComponents'

import SideBar from '../SideBar'

class HomeRoute extends Component {
  state = {bannerClose: false}

  onCloseBanner = () => {
    this.setState({bannerClose: true}, this.renderHomeVideos)
  }

  renderHomeVideos = () => {
    const {bannerClose} = this.state

    return (
      <>
        <BannerImageContainer data-testid="banner" bannerClose={bannerClose}>
          <ModalContainer>
            <BannerImage
              src=" https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
              alt="nxt watch logo"
            />
            {!bannerClose && (
              <BannerDescription>
                Buy Nxt Watch Premium prepaid plans with UPI
              </BannerDescription>
            )}
            <GetItNowButton>GET IT NOW</GetItNowButton>
          </ModalContainer>
          <CloseButton
            type="button"
            data-testid="close"
            onClick={this.onCloseBanner}
          >
            <IoMdClose size={30} color="#231f20" />
          </CloseButton>
        </BannerImageContainer>
        <SearchVideos />
      </>
    )
  }

  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColor = isDarkTheme ? '#181818' : '#f9f9f9'

          return (
            <>
              <Header />
              <HomeContainer bgColor={bgColor} data-testid="home">
                <HomeStickyContainer>
                  <SideBar onChangeActiveTab={this.onChangeActiveTab} />
                </HomeStickyContainer>
                <HomeSideContainer bgColor={bgColor}>
                  {this.renderHomeVideos()}
                </HomeSideContainer>
              </HomeContainer>
            </>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default HomeRoute
