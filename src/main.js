import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
require('firebase/firestore')

var firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyB8R-sumIShvu2Ft4Ke3tkn1nwj3VwwA7Y',
  authDomain: 'aqlvoyoshpazuz.firebaseapp.com',
  databaseURL: 'https://aqlvoyoshpazuz-default-rtdb.firebaseio.com',
  projectId: 'aqlvoyoshpazuz',
  storageBucket: 'aqlvoyoshpazuz.appspot.com',
  messagingSenderId: '459697136835',
  appId: '1:459697136835:web:d792aca651528c837aee76',
  measurementId: 'G-EXHB5TT0FD'
})

Vue.config.productionTip = false

Vue.use(ElementUI)

const firestore = firebaseApp.firestore()

new Vue({
  firestore,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
