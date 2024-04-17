import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillFire} from 'react-icons/ai'

import VideoCard from '../VideoCard'

import Header from '../Header'

import SideBar from '../SideBar'

import CartContext from '../../context/CartContext'

import {
  SearchVideosContainer,
  VideosContainer,
  TrendingHeadContainer,
  TrendingLogo,
  TrendingHead,
  ProductsLoaderContainer,
  TrendStickyContainer,
  TrendSideContainer,
  TrendsContainer,
  NotFoundContainer,
  Image,
  Heading,
  Desc,
  NavLinkTwo,
  Retry,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Trending extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchedVideos: [],
  }

  componentDidMount() {
    this.getTrendingVideos()
  }

  getTrendingVideos = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/trending`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.videos.map(each => ({
        id: each.id,
        channel: {
          name: each.channel.name,
          profileImageUrl: each.channel.profile_image_url,
        },
        publishedAt: each.published_at,
        thumbnailUrl: each.thumbnail_url,
        viewCount: each.view_count,
        title: each.title,
      }))
      this.setState({
        searchedVideos: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.ok !== true) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderTrendingVideos = () => {
    const {searchedVideos} = this.state

    return (
      <CartContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'

          const textColor = isDarkTheme ? '#f9f9f9' : '#181818'
          return (
            <SearchVideosContainer bgColor={bgColor}>
              <TrendingHeadContainer color={textColor} bgColor={bgColor}>
                <TrendingLogo>
                  <AiFillFire />
                </TrendingLogo>
                <TrendingHead color={textColor}>Trending</TrendingHead>
              </TrendingHeadContainer>

              <VideosContainer>
                {searchedVideos.map(each => (
                  <VideoCard key={each.id} details={each} />
                ))}
              </VideosContainer>
            </SearchVideosContainer>
          )
        }}
      </CartContext.Consumer>
    )
  }

  renderLoadingView = () => (
    <ProductsLoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </ProductsLoaderContainer>
  )

  renderFailureView = () => (
    <CartContext.Consumer>
      {value => {
        const {isDarkTheme} = value

        const failureImage = isDarkTheme
          ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
          : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'

        return (
          <NotFoundContainer>
            <Image src={failureImage} alt="failure view" />
            <Heading>Oops! Something Went Wrong</Heading>
            <Desc className="jobs-failure-description">
              We are having some trouble to complete your request.Please try
              again.
            </Desc>
            <NavLinkTwo>
              <Retry type="button" onClick={this.getTrendingVideos}>
                Retry
              </Retry>
            </NavLinkTwo>
          </NotFoundContainer>
        )
      }}
    </CartContext.Consumer>
  )

  renderAllVideos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTrendingVideos()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'

          return (
            <div>
              <Header />
              <TrendsContainer bgColor={bgColor}>
                <TrendStickyContainer>
                  <SideBar />
                </TrendStickyContainer>
                <TrendSideContainer data-testid="trending" bgColor={bgColor}>
                  {this.renderAllVideos()}
                </TrendSideContainer>
              </TrendsContainer>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default Trending
