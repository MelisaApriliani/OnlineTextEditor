import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EditorStoreProvider } from './stores/EditorStoreProvider';
import Home from './pages/Home';
import DocumentView from './pages/DocumentView';
import './styles/global.css'

const App: React.FC = () => {
    return (
        <EditorStoreProvider>
            <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/timeline" element={<DocumentView/>} />
                        {/* You can add more routes here */}
                    </Routes>
            </Router>
        </EditorStoreProvider>
    );
};

export default App;