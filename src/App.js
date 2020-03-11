import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import {
  auth,
  createUserProfileDocument,
  firestore,
  convertCollectionsSnapshotToMap
} from './firebase/firebase.utlis'
import { setCurrentUser } from './redux/user/user.action'
import { selectCurrentUser } from './redux/user/user.selector'
import Homepage from './pages/homepage/Homepage.components'
import ShopPage from './pages/shop/shop.page'
import Header from './components/header/header.component'
import SignInAndSignUp from './pages/sign-in-and-sign-up-page/sign-in-and-sign-up-page.component'
import CheckoutPage from './pages/checkout/checkout.component'
import CollectionPage from './pages/collection/collection.page'
import WithSpinner from './components/with-spinner/with-spinner.component'
import { updateCollections } from './redux/shop/shop.action'

import './App.css'

const CollectionPageWithSpinner = WithSpinner(CollectionPage)

class App extends React.Component {
  state = {
    loading: true
  }
  //Shop page data
  unsubscribeFromSnapshotp = null

  unsubscribeFromAuth = null

  componentDidMount() {
    //Shop Page data
    const { updateCollections } = this.props
    const collectionRef = firestore.collection('collections')

    collectionRef.onSnapshot(async snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot)
      updateCollections(collectionsMap)
      this.setState({ loading: false })
    })

    const { setCurrentUser } = this.props
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth)

        userRef.onSnapshot(snapShot => {
          this.props.setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          })
        })
      }

      setCurrentUser(userAuth)
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth()
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/shop" component={ShopPage} />
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? <Redirect to="/" /> : <SignInAndSignUp />
            }
          />
          <Route exact path="/checkout" component={CheckoutPage} />
          {/* <Route path="/shop/:collectionId" component={CollectionPage} /> */}
          <Route
            path="/shop/:collectionId"
            render={props => (
              <CollectionPageWithSpinner
                isLoading={this.state.loading}
                {...props}
              />
            )}
          />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
  updateCollections: collectionMap => dispatch(updateCollections(collectionMap))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
