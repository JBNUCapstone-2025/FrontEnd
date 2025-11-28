import React from "react"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./approutes/AppRoutes" // 라우트 정의한 컴포넌트

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
