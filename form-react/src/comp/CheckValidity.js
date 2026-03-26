import React from 'react';
import './form.css';

class CheckValidity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      result: null,
      loading: false
    };
  }

  checkHandler = async () => {
    const { address } = this.state;
    if (!address.trim()) {
      alert('Please enter a wallet address.');
      return;
    }
    this.setState({ loading: true, result: null });
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/checkvalidity?address=${address.trim()}`
      );
      const data = await response.json();
      this.setState({ result: data, loading: false });
    } catch (err) {
      this.setState({
        result: { success: false, message: 'Error connecting to backend.' },
        loading: false
      });
    }
  };

  getStatusStyle(status) {
    const base = {
      marginTop: '20px',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white'
    };
    if (status === 'valid')          return { ...base, backgroundColor: '#27ae60' };
    if (status === 'expired')        return { ...base, backgroundColor: '#c0392b' };
    if (status === 'not_registered') return { ...base, backgroundColor: '#e67e22' };
    return { ...base, backgroundColor: '#7f8c8d' };
  }

  getStatusIcon(status) {
    if (status === 'valid')          return '✅';
    if (status === 'expired')        return '❌';
    if (status === 'not_registered') return '⚠️';
    return 'ℹ️';
  }

  render() {
    const { address, result, loading } = this.state;
    return (
      <div id='cen'>
        <form id="form" onSubmit={e => e.preventDefault()}>
          <fieldset>
            <h1>Check KYC Validity</h1>
            <p style={{ textAlign: 'center', color: '#fff', marginTop: 0 }}>
              Enter a wallet address to check if its KYC record is still valid.
            </p>
            <p style={{ textAlign: 'center', color: '#ffe082', fontSize: '13px', marginTop: 0 }}>
              ⚠️ Note: KYC reports expire after <strong>5 minutes</strong> on this demo network.
            </p>

            <h2>Wallet Address</h2>
            <div id='sub'>
              <input
                type='text'
                placeholder='Enter Wallet Address (0x...)'
                value={address}
                style={{ width: '100%' }}
                onChange={e => this.setState({ address: e.target.value })}
              />
            </div>
            <br /><br />

            <input
              type="submit"
              id="submit"
              value={loading ? 'Checking...' : 'Check Validity'}
              onClick={this.checkHandler}
              disabled={loading}
            />

            {result && result.success && (
              <div style={this.getStatusStyle(result.status)}>
                {this.getStatusIcon(result.status)} {result.message}
              </div>
            )}
            {result && !result.success && (
              <div style={this.getStatusStyle('error')}>
                ❗ {result.message}
              </div>
            )}

          </fieldset>
        </form>
      </div>
    );
  }
}

export default CheckValidity;
