import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import VideoDetails from './components/VideoItemDetails'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import SavedVideos from './components/SavedVideos'

import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    isDarkTheme: false,
    savedVideos: [],
    activeTab: 'HOME',
  }

  onChangeTheme = () => {
    this.setState(prev => ({isDarkTheme: !prev.isDarkTheme}))
  }

  addToSaveVideos = videoDetails => {
    const {savedVideos} = this.state
    const videoObject = savedVideos.find(each => each.id === videoDetails.id)
    // console.log(videoObject)
    if (videoObject !== undefined) {
      this.setState(prev => ({
        savedVideos: [...prev.savedVideos],
      }))
    } else {
      this.setState({savedVideos: [...savedVideos, videoDetails]})
    }
  }

  //   addToSavedVideos = async data => {
  //     const {savedVideos} = this.state
  //     if (savedVideos.length > 0) {
  //       const checkSavedVideos = savedVideos.filter(item => item.id === data.id)
  //       if (checkSavedVideos.length === 0) {
  //         await this.setState({
  //           savedVideos: [...savedVideos, data],
  //         })
  //       }
  //     } else {
  //       await this.setState({
  //         savedVideos: [...savedVideos, data],
  //       })
  //     }
  //   }

  removeSaveVideos = id => {
    const {savedVideos} = this.state
    const updatedVideos = savedVideos.filter(each => each.id !== id)
    this.setState({savedVideos: updatedVideos})
  }

  activeTabItem = item => {
    this.setState({activeTab: item})
  }

  render() {
    const {isDarkTheme, savedVideos, activeTab} = this.state
    // console.log(isDarkTheme)

    return (
      <CartContext.Provider
        value={{
          isDarkTheme,
          savedVideos,
          addToSaveVideos: this.addToSaveVideos,
          activeTabItem: this.activeTabItem,
          activeTab,
          onChangeTheme: this.onChangeTheme,
          removeSaveVideos: this.removeSaveVideos,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <ProtectedRoute exact path="/videos/:id" component={VideoDetails} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}
export default App
