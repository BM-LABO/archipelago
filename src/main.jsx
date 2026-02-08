import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// このファイルは、index.htmlの<div id="root">に
// App.jsx（カタログ本体）を流し込む「実行スイッチ」の役割を果たします。

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
