import React, { useState } from 'react';

function ErrorPanel({ message, onClose }) {
    const [show, setShow] = useState(true);

    const close = () => {
        setShow(false);
        onClose();
    };

    return (
        <div className={`error-panel ${show ? 'shown' : ''}`}>
            <div className='error-content'>
                <label className='error-message'>{message}</label>
                <button className='action-button error' onClick={close}>Close</button>
            </div>
        </div>
    );
}

export default ErrorPanel;