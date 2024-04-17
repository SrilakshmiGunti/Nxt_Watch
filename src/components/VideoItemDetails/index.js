import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'

import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from 'react-icons/ai'
import {RiPlayListAddFill} from 'react-icons/ri'

import CartContext from '../../context/CartContext'

import Header from '../Header'

import SideBar from '../SideBar'

import {
  VideoDetailsContainer,
  ProductsLoaderContainer,
  VideoDetailsSideContainer,
  VideoDetailsTitle,
  VideoDetailsTextContainer,
  ViewsDetailsContainer,
  LikesContainer,
  ViewsText,
  IconContainer,
  HorizontalLine,
  ChannelLogo,
  ChannelContainer,
  ChannelDetailsContainer,
  LogoContainer,
  NotFoundContainer,
  Image,
  Heading,
  Desc,
  NavLink,
  Retry,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoItemDetails extends Component {
  state = {
    videoDetails: [],
    apiStatus: apiStatusConstants.initial,
    isVideoSaved: false,
    isLiked: false,
    isDisliked: false,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const videoDetailsApiUrl = `https://apis.ccbp.in/videos/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(videoDetailsApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.video_details.id,
        publishedAt: fetchedData.video_details.published_at,
        description: fetchedData.video_details.description,
        title: fetchedData.video_details.title,
        videoUrl: fetchedData.video_details.video_url,

        viewCount: fetchedData.video_details.view_count,
        thumbnailUrl: fetchedData.video_details.thumbnail_url,
        channel: {
          name: fetchedData.video_details.channel.name,
          profileImageUrl: fetchedData.video_details.channel.profile_image_url,
          subscriberCount: fetchedData.video_details.channel.subscriber_count,
        },
      }
      //   console.log(updatedData)
      this.setState({
        videoDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSpecificVideoDetails = () => (
    <CartContext.Consumer>
      {value => {
        const {videoDetails, isLiked, isDisliked} = this.state
        const {
          id,
          channel,
          description,
          viewCount,
          videoUrl,
          title,
          publishedAt,
          //  videoSaved,
        } = videoDetails
        const {name, profileImageUrl, subscriberCount} = channel
        const {savedVideos, isDarkTheme, addToSaveVideos, removeSaveVideos} =
          value
        const isThisSavedVideo = savedVideos.find(
          each => each.id === videoDetails.id,
        )
        let videoSavedStatus = false
        //  console.log(isThisSavedVideo)
        if (isThisSavedVideo !== undefined) {
          videoSavedStatus = isThisSavedVideo.videoSaved
        }
        //  const {addToSaveVideos} = value

        const addOrRemoveItem = () => {
          if (videoSavedStatus === true) {
            removeSaveVideos(id)
          } else {
            addToSaveVideos({...videoDetails, videoSaved: true})
          }
        }

        const saveVideoToList = () => {
          this.setState(
            prev => ({isVideoSaved: !prev.isVideoSaved}),
            addOrRemoveItem(),
            // addToSaveVideos(videoDetails),
          )
        }

        const onClickLikeButton = () => {
          this.setState(prev => ({isLiked: !prev.isLiked, isDisliked: false}))
        }

        const onClickDislikeButton = () => {
          this.setState(prev => ({
            isDisliked: !prev.isDisliked,
            isLiked: false,
          }))
        }

        const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'

        const textColor = isDarkTheme ? '#f9f9f9' : '#181818'

        const likeClass = isLiked ? '#2563eb' : '#64748b'
        const dislikeClass = isDisliked ? '#2563eb' : '#64748b'

        const saveIconClass = videoSavedStatus ? '#4f46e5' : '#64748b'

        const likeIcon = isLiked ? <AiFillLike /> : <AiOutlineLike />
        const dislikeIcon = isDisliked ? (
          <AiFillDislike />
        ) : (
          <AiOutlineDislike />
        )

        return (
          <>
            <Header />
            <VideoDetailsContainer bgColor={bgColor}>
              <SideBar />
              <VideoDetailsSideContainer
                data-testid="videoItemDetails"
                bgColor={bgColor}
              >
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="90%"
                  height="500px"
                />
                <VideoDetailsTextContainer>
                  <VideoDetailsTitle color={textColor}>
                    {title}
                  </VideoDetailsTitle>
                  <ViewsDetailsContainer>
                    <ViewsText color={textColor}>{viewCount} views </ViewsText>
                    <ViewsText color={textColor}>{publishedAt}</ViewsText>
                    <LikesContainer>
                      <IconContainer
                        type="button"
                        color={likeClass}
                        onClick={onClickLikeButton}
                      >
                        {likeIcon}
                        <ViewsText color={likeClass}>Like</ViewsText>
                      </IconContainer>
                      <IconContainer
                        color={dislikeClass}
                        type="button"
                        onClick={onClickDislikeButton}
                      >
                        {dislikeIcon}
                        <ViewsText color={dislikeClass}>Dislike</ViewsText>
                      </IconContainer>
                      <IconContainer
                        type="button"
                        onClick={saveVideoToList}
                        color={saveIconClass}
                      >
                        <RiPlayListAddFill />
                        <ViewsText color={saveIconClass}>
                          {videoSavedStatus ? 'Saved' : 'Save'}
                        </ViewsText>
                      </IconContainer>
                    </LikesContainer>
                  </ViewsDetailsContainer>
                  <HorizontalLine />
                  <ChannelContainer>
                    <LogoContainer>
                      <ChannelLogo src={profileImageUrl} alt="channel logo" />
                    </LogoContainer>
                    <ChannelDetailsContainer>
                      <ViewsText color={textColor}>{name}</ViewsText>
                      <ViewsText color={textColor}>
                        {subscriberCount} Subscribers
                      </ViewsText>
                      <ViewsText color={textColor}> {description}</ViewsText>
                    </ChannelDetailsContainer>
                  </ChannelContainer>
                </VideoDetailsTextContainer>
              </VideoDetailsSideContainer>
            </VideoDetailsContainer>
          </>
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

  renderFailureView = () => (
    <NotFoundContainer>
      <Image
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <Heading>Oops! Something Went Wrong</Heading>
      <Desc className="jobs-failure-description">
        We are having some trouble to complete your request. Please try again.
      </Desc>
      <NavLink>
        <Retry className="button" type="button" onClick={this.getVideoDetails}>
          Retry
        </Retry>
      </NavLink>
    </NotFoundContainer>
  )

  renderAllVideos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSpecificVideoDetails()

      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderAllVideos()}</>
  }
}

export default VideoItemDetails
