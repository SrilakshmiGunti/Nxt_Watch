import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {AiFillFire} from 'react-icons/ai'

import VideoCard from '../VideoCard'

import CartContext from '../../context/CartContext'

import Header from '../Header'

import SideBar from '../SideBar'

import {
  HomeContainer,
  SavedVideosContainer,
  VideosContainer,
  TrendingHeadContainer,
  TrendingLogo,
  TrendingHead,
  ProductsLoaderContainer,
  HomeStickyContainer,
  VideosSideContainer,
  Image,
  NotFoundContainer,
  Heading,
  Desc,
} from './styledComponents'

class SavedVideos extends Component {
  renderSavedVideos = () => (
    <CartContext.Consumer>
      {value => {
        const {savedVideos, isDarkTheme} = value

        const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'

        const textColor = isDarkTheme ? '#f9f9f9' : '#181818'

        //  console.log(savedVideos)
        const isVideosAvailable = savedVideos.length === 0

        return isVideosAvailable ? (
          <NotFoundContainer bgColor={bgColor}>
            <Image
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
              alt="no saved videos"
            />
            <Heading className="cart-empty-heading" textColor={textColor}>
              No saved videos found
            </Heading>
            <Desc textColor={textColor}>
              You can save your videos while watching them.
            </Desc>
          </NotFoundContainer>
        ) : (
          <SavedVideosContainer>
            <TrendingHeadContainer bgColor={bgColor}>
              <TrendingLogo>
                <AiFillFire />
              </TrendingLogo>
              <TrendingHead color={textColor}>Saved Videos</TrendingHead>
            </TrendingHeadContainer>

            <VideosContainer bgColor={bgColor}>
              {savedVideos.map(each => (
                <VideoCard key={each.id} details={each} />
              ))}
            </VideosContainer>
          </SavedVideosContainer>
        )
      }}
    </CartContext.Consumer>
  )

  renderLoadingView = () => (
    <ProductsLoaderContainer
      className="products-loader-container"
      data-testid="loader"
    >
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </ProductsLoaderContainer>
  )

  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'
          const sideBarClass = isDarkTheme ? '#181818' : '#f9f9f9'

          return (
            <>
              <Header />
              <HomeContainer>
                <HomeStickyContainer>
                  <SideBar sideBarClass={sideBarClass} />
                </HomeStickyContainer>
                <VideosSideContainer
                  data-testid="savedVideos"
                  bgColor={bgColor}
                >
                  {this.renderSavedVideos()}
                </VideosSideContainer>
              </HomeContainer>
            </>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default SavedVideos
