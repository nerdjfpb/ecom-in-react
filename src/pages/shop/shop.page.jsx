import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import CollectionOverview from '../../components/collection-overview/collection-overview.component'
import {
  firestore,
  convertCollectionsSnapshotToMap
} from '../../firebase/firebase.utlis'
import { updateCollections } from '../../redux/shop/shop.action'
import WithSpinner from '../../components/with-spinner/with-spinner.component'

const CollectionOverViewWithSpinner = WithSpinner(CollectionOverview)

class ShopPage extends React.Component {
  state = {
    loading: true
  }

  unsubscribeFromSnapshotp = null

  componentDidMount() {
    const { updateCollections } = this.props
    const collectionRef = firestore.collection('collections')

    collectionRef.onSnapshot(async snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot)
      updateCollections(collectionsMap)
      this.setState({ loading: false })
    })
  }

  render() {
    const { match } = this.props
    const { loading } = this.state
    return (
      <div className="shop-page">
        <Route
          exact
          path={`${match.path}`}
          render={props => (
            <CollectionOverViewWithSpinner isLoading={loading} {...props} />
          )}
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updateCollections: collectionMap => dispatch(updateCollections(collectionMap))
})
export default connect(null, mapDispatchToProps)(ShopPage)
