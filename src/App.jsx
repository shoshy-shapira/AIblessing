import React, { useState } from 'react';
import { ThreadContext } from './ThreadContext';
import Home from './component/Home';

function App() {
    const [thread, setThread] = useState('');

    return (
        <ThreadContext.Provider value={{ thread, setThread }}>
            <Home />
        </ThreadContext.Provider>
    );
}

export default App;
