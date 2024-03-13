import React, { useState } from 'react';

function DeployDiagram({ isOpen, onClose, onDeploy }) {
    const [name, setName] = useState('diagram');
    const [tenantId, setTenantID] = useState('');

    const handleDeploy = () => {
        if (!name.trim()) {
            alert('Please fill out deployment name.');
            return;
        }

        onDeploy(name, tenantId);
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Deploy diagram</h2>
                <form className='deploy-form'>
                    <label>Deployment name</label>
                    <input type="text" value={name} defaultValue="diagram" onChange={(e) => setName(e.target.value)} />
                    <label>Tenant ID</label>
                    <input type="text" value={tenantId} placeholder="Optional" onChange={(e) => setTenantID(e.target.value)} />
                    <button className='action-button' onClick={handleDeploy}>Deploy</button>
                </form>
            </div>
        </div>
    );
}

export default DeployDiagram;
