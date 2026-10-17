import React from 'react';
import ReactDOM from 'react-dom/client';
import TearableNotebookApp from './components/tearable/TearableNotebookApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('tearable-root')).render(
  <React.StrictMode>
    <TearableNotebookApp />
  </React.StrictMode>
);
