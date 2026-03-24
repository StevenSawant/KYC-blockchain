import React from 'react';

import './form.css';


class Form extends React.Component {
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
  // onSubmit=()=>{
  // 		fetch(,{
  // 		method:"post",
  // 		headers:{"Content-type":"applicant/json"},
  // 		body:JSON.stringify({

  // 			fname:this.state.fname,
  // 			lname:this.state.lname,
  // 			appAddress:this.state.appAddress,
  // 			email:this.state.email,
  // 			phone:this.state.phone;
  // 			bdate:this.state.bdate,
  // 			gender:this.state.gender


  // 		})
  // 	}
  // 	)
  // 	}
  render() {
    return (
      <div id='cen'>
        <form id="form">
          <fieldset>

            <h1>Registration Form</h1>

            <h2>Name of applicant</h2>

            <div id="fullName">
              <input type="text" name="fName" id="fname" placeholder="First Name" required onChange={this.ChangeHandler} />
              <input type="text" name="lName" id="lname" placeholder="Last Name" required onChange={this.ChangeHandler} />
            </div>


            <h2>Contact Details & Wallet</h2>
            <div id='sub'>
              <input
                type='text'
                name='appAddress'
                placeholder="Wallet Address (0x...)"
                required
                onChange={this.ChangeHandler}
              />
              <input
                type='email'
                name='email'
                placeholder='Email Address'
                onChange={this.ChangeHandler}
              />
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Telephone Number"
                required
                onChange={this.ChangeHandler}
              />

            </div>
            <br />
            <h2> Date of Birth</h2>
            <div id='sub'>
              <input
                types='date'
                name='bdate'
                placeholder="MM-DD-YYYY" required
                onChange={this.ChangeHandler}
              />
            </div>
            <br />
            <h2>Gender</h2>
            <div id='sub'>
              <input
                type='text'
                name='gender'
                placeholder="Male, Female, etc."
                onChange={this.ChangeHandler}
              />
            </div>
            <br />
            <h2>Additional Info</h2>
            <div id='sub'>
              <input type="text" name="nationality" placeholder="Nationality" onChange={this.ChangeHandler} />
              <input type="text" name="occupation" placeholder="Occupation" onChange={this.ChangeHandler} />
              <input type="number" name="annualIncome" placeholder="Annual Income ($)" onChange={this.ChangeHandler} />
            </div>
            <br />
            <h2>ID Photo Upload</h2>
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
                console.log("Sending Form Data:", this.state);
                
                const formData = new FormData();
                for (const key in this.state) {
                  formData.append(key, this.state[key]);
                }

                try {
                  const response = await fetch("http://127.0.0.1:5000/api/register", {
                    method: "POST",
                    body: formData
                  });
                  const result = await response.json();
                  if (result.success) {
                    alert('Success! TxHash: ' + result.transactionHash + '\nIPFS: ' + result.ipfsHash);
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
    )
  }

}
export default Form;