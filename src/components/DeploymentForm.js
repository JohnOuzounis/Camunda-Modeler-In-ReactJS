import React, { useState } from 'react';

function DeployDiagram({ isFormOpen, onClose, onDeploy }) {
    const [name, setName] = useState('diagram');
    const [variables, setVariables] = useState([]);

    const handleVariableChange = (index, key, value) => {
        const updatedVariables = [...variables];
        updatedVariables[index][key] = value;
        setVariables(updatedVariables);
    };

    const handleAddVariable = () => {
        setVariables([...variables, { name: '', value: '' }]);
    };

    const handleRemoveVariable = (index) => {
        const updatedVariables = [...variables];
        updatedVariables.splice(index, 1);
        setVariables(updatedVariables);
    };

    const handleDeploy = () => {
        if (!name.trim()) {
            alert('Please fill out deployment name.');
            return;
        }

        const variablesValid = variables.every(variable => variable.name.trim() && variable.value.trim());
        if (!variablesValid) {
            alert('Please fill out all variable names and values.');
            return;
        }

        const vars = {};
        variables.forEach(variable => {
            vars[variable.name] = variable.value;
        });
        onDeploy(name, vars);
        onClose();
    };

    return (
        <div className={`modal ${isFormOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Deploy diagram</h2>
                <form className='deploy-form'>
                    <label>Deployment name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <button className='action-button' type='button' onClick={handleAddVariable}>+</button>
                    <div className="variable-list">
                        {variables.map((variable, index) => (
                            <div key={index} className="variable-item">
                                <input
                                    type="text"
                                    value={variable.name}
                                    onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                                    placeholder="Variable name"
                                />
                                <input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                                    placeholder="Value"
                                />
                                <button className='action-button error' type="button" onClick={() => handleRemoveVariable(index)}>-</button>
                            </div>
                        ))}
                    </div>
                </form>
                <button className='action-button' onClick={handleDeploy}>Deploy & Run</button>
            </div>
        </div>
    );
}

export default DeployDiagram;
