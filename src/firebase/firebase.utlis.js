import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC63-ouyXsO6UZlVG_KI-SdCAxnicDWnTc',
  authDomain: 'crown-db-cloth.firebaseapp.com',
  databaseURL: 'https://crown-db-cloth.firebaseio.com',
  projectId: 'crown-db-cloth',
  storageBucket: 'crown-db-cloth.appspot.com',
  messagingSenderId: '190333176099',
  appId: '1:190333176099:web:0fa5190cd1455736f16496'
}

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return

  const userRef = firestore.doc(`users/${userAuth.uid}`)

  const snapShot = await userRef.get()

  if (!snapShot.exists) {
    const { displayName, email } = userAuth
    const createdAt = new Date()

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      })
    } catch (error) {
      console.log('error creating user', error.message)
    }
  }

  return userRef
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase
