import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import {
  firestore,
  convertCollectionsSnapshotToMap
} from './firebase/firebase.utlis'
import { checkUserSession } from './redux/user/user.action'
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

const App = ({ updateCollections, checkUserSession, currentUser }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const collectionRef = firestore.collection('collections')
    collectionRef.onSnapshot(async snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot)
      updateCollections(collectionsMap)
      setLoading(false)
    })
  }, [updateCollections])

  useEffect(() => {
    checkUserSession()
  }, [checkUserSession])

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
            currentUser ? <Redirect to="/" /> : <SignInAndSignUp />
          }
        />
        <Route exact path="/checkout" component={CheckoutPage} />
        <Route
          path="/shop/:collectionId"
          render={props => (
            <CollectionPageWithSpinner isLoading={loading} {...props} />
          )}
        />
      </Switch>
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession()),
  updateCollections: collectionMap => dispatch(updateCollections(collectionMap))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
