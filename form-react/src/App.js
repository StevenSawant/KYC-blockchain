
import { useState } from 'react';
import './App.css';
import Form from './comp/form.js';
import UpdateForm from './comp/UpdateForm.js';
import CheckValidity from './comp/CheckValidity.js';

function App() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="App">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px 0 0 0',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'register' ? '#3E6F80' : '#a0bec8',
            color: 'white'
          }}>
          Register KYC
        </button>
        <button
          onClick={() => setActiveTab('update')}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'update' ? '#3E6F80' : '#a0bec8',
            color: 'white'
          }}>
          Update KYC
        </button>
        <button
          onClick={() => setActiveTab('check')}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'check' ? '#3E6F80' : '#a0bec8',
            color: 'white'
          }}>
          Check Validity
        </button>
      </div>

      {activeTab === 'register' && <Form />}
      {activeTab === 'update' && <UpdateForm />}
      {activeTab === 'check' && <CheckValidity />}
    </div>
  );
}

export default App;
