import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Create from './components/Create.jsx'
import MyRelease from './components/MyRelease.jsx'
import Detail from './components/Detail.jsx'
import App from './App.jsx'
import { store } from './store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="myrelease" element={<MyRelease />} />
          <Route path="detail/:addr" element={<Detail />} />
        </Route>
      </Routes>
    </HashRouter>
  </Provider>
)
