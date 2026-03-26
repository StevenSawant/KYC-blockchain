import React from 'react';
import './form.css';

class UpdateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: '',
      lName: '',
      appAddress: '',
      email: '',
      phone: '',
      bdate: '',
      gender: '',
      nationality: '',
      occupation: '',
      annualIncome: '',
      imageFile: null
    };
  }

  ChangeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  FileChangeHandler = (event) => {
    this.setState({ imageFile: event.target.files[0] });
  }

  render() {
    return (
      <div id='cen'>
        <form id="form">
          <fieldset>

            <h1>Update KYC Form</h1>
            <p style={{textAlign:'center', color:'#fff', marginTop:0}}>
              Update your existing KYC record on the blockchain.
            </p>

            <h2>Registered Wallet Address</h2>
            <div id='sub'>
              <input
                type='text'
                name='appAddress'
                placeholder="Your Registered Wallet Address (0x...)"
                required
                style={{width:'100%'}}
                onChange={this.ChangeHandler}
              />
            </div>
            <br />

            <h2>Updated Name</h2>
            <div id="fullName">
              <input type="text" name="fName" placeholder="First Name" required onChange={this.ChangeHandler} />
              <input type="text" name="lName" placeholder="Last Name" required onChange={this.ChangeHandler} />
            </div>

            <h2>Updated Contact Details</h2>
            <div id='sub'>
              <input type='email' name='email' placeholder='Email Address' onChange={this.ChangeHandler} />
              <input type="tel" name="phone" placeholder="Telephone Number" required onChange={this.ChangeHandler} />
            </div>
            <br />

            <h2>Updated Date of Birth</h2>
            <div id='sub'>
              <input type='text' name='bdate' placeholder="MM-DD-YYYY" required onChange={this.ChangeHandler} />
            </div>
            <br />

            <h2>Updated Gender</h2>
            <div id='sub'>
              <input type='text' name='gender' placeholder="Male, Female, etc." onChange={this.ChangeHandler} />
            </div>
            <br />

            <h2>Updated Additional Info</h2>
            <div id='sub'>
              <input type="text" name="nationality" placeholder="Nationality" onChange={this.ChangeHandler} />
              <input type="text" name="occupation" placeholder="Occupation" onChange={this.ChangeHandler} />
              <input type="number" name="annualIncome" placeholder="Annual Income ($)" onChange={this.ChangeHandler} />
            </div>
            <br />

            <h2>Updated ID Photo</h2>
            <div id='sub'>
              <input type="file" name="imageFile" accept="image/*" onChange={this.FileChangeHandler} required />
            </div>
            <br /><br />

            <input
              type="submit"
              name="submit"
              id="submit"
              onClick={async (e) => {
                e.preventDefault();
                const formData = new FormData();
                for (const key in this.state) {
                  formData.append(key, this.state[key]);
                }
                try {
                  const response = await fetch("http://127.0.0.1:5000/api/update", {
                    method: "POST",
                    body: formData
                  });
                  const result = await response.json();
                  if (result.success) {
                    alert('KYC Updated! TxHash: ' + result.transactionHash + '\nNew IPFS: ' + result.ipfsHash);
                  } else {
                    alert('Error: ' + result.message);
                  }
                } catch (err) {
                  console.error("API Error:", err);
                  alert('Error connecting to the KYC backend API.');
                }
              }}
            />

          </fieldset>
        </form>
      </div>
    );
  }
}

export default UpdateForm;
