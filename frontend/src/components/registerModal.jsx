import React, { Component } from 'react';
import privacyPolicyDocument from '../documents/PrivacyPolicy.pdf';
import ReactDOM from 'react-dom';
import '../stylesheets/registerModal.css';

const API_URL = require('../config.js');

class RegisterModal extends Component {
// add address
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        confirmPass: '',
        fname: '',
        lname: '',
        Street_Name:'',
        Postal_Code:'',
        role: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.register = this.register.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  
  async register(e){
    e.preventDefault();
    try{
        let data = JSON.stringify({
            user: {
              email: this.state.email,
              password: this.state.password,
              confirmPass: this.state.confirmPass,
              fname: this.state.fname,
              lname: this.state.lname,
              Street_Name: this.state.Street_Name,
              Postal_Code: this.state.Postal_Code,
              role: this.state.role
            }
        });
        
        if(this.state.password !== this.state.confirmPass){
          const passwordMatch = <p>Your password and confirmation password do not match</p>;
          ReactDOM.render(passwordMatch, document.getElementById('errorMessage'));
          return false; //matching password
        }

        //making sure the password count is greater than 6
        if ((this.state.password).length < 6 || (this.state.confirmPass).length < 6) {
          const passwordError = <p>Your password must have a minimum of 6 characters</p>;
          ReactDOM.render(passwordError, document.getElementById('errorMessage'));
          return false
        }

        //making sure the password contains numbers and letters to ensure a good security
        //returns a boolean
        if (!(/\d/.test(this.state.password))) {
          const passwordError = <p>Your password must contain atleast a number</p>;
          ReactDOM.render(passwordError, document.getElementById('errorMessage'));
          return false
        }


        let response = await fetch(API_URL+"/user/register", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: data
      });
      if (response.ok){
        console.log(response);
          console.log('Register Success')
          document.getElementById('submitBtnRegister').hidden = true;
          document.getElementById('confirmIconRegister').hidden = false;
          try{
            let data = JSON.stringify({
              user: {
                email: this.state.email,
                password: this.state.password,
              }
            });
            await fetch(API_URL+"/user/login", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: data
          }).then((response) => {
            if(response.ok){
              response.json().then((data) => {
                console.log('Got User: ', data);
                sessionStorage.setItem('loggedin', true);
                sessionStorage.setItem('user', data.user.email);
                sessionStorage.setItem('userRole', data.user.role);
                setTimeout(function(){
                  window.location.reload();
                  }, 1500);
              }).catch(e => {
                console.log(e.stack);
                sessionStorage.setItem('loggedin', false);
                sessionStorage.setItem('user', data.user.email);
                sessionStorage.setItem('userRole', data.user.role);
              });
            }
          });
        }
        catch(e){
            console.log(e.stack);
        }
      }
      //the response received an error probably due to a user taking the same email
      //will display an error message on below the register header
      else {
        const emailInUse = <p>Email is already taken by another user. Please use a different email</p>;
        ReactDOM.render(emailInUse, document.getElementById('errorMessage'));
      }
    }
    catch(e){
        console.log(e.stack);
    }
  }

  render() {
    return (
      <div className="RegisterModal">
        <div className="modal fade" id="registerModal" role="dialog" aria-labelledby="registerModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title" id="registerModalLabel">Register</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>

              </div>
              <div className="modal-body text-center">
              <div id="errorMessage"></div>
                <form onSubmit={this.register}>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="fname" type="text" className="form-control text-center" id="fnameRegisterInput" aria-describedby="firstName" placeholder="First Name" required/>
                  </div>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="lname" type="text" className="form-control text-center" id="lnameRegisterInput" aria-describedby="lastName" placeholder="Last Name Initial" required/>
                  </div>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="email" type="email" className="form-control text-center" id="emailRegisterInput" aria-describedby="emailRegister" placeholder="Email" required/>
                  </div>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="password" type="password" className="form-control text-center" id="passwordRegisterInput" placeholder="Password" required/>
                  </div>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="confirmPass" type="password" className="form-control text-center" id="confirmPassRegisterInput" placeholder="Confirm Password" required/>
                  </div>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="Street_Name" type="text" className="form-control text-center" id="streetAddRegisterInput" placeholder="Street Name"/>
                  </div>
                  <div className="form-group">
                    <input onChange={this.handleChange} name="Postal_Code" type="text" className="form-control text-center" id="postalRegisterInput" placeholder="Postal / Zip Code " required/>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="selectRole">Choose your desired account type:</label>
                    <select name="role" className="form-control text-center" id="selectRole" required>
                      <option value="guest">Guest</option>
                      <option value="resident">Resident</option>
                      <option value="worker">Worker</option>
                      <option value="associate">Associate</option>
                    </select>
                  </div>
                  {/* Privacy Policy Check */}
                  <div className="form-group">
                    <input type="checkbox" id="privacyPolicy" name="privacyPolicy" value="privacyPolicyCheck" required/>
                    <label htmlFor="privacyPolicy">&nbsp;I have read and agree to the <a href={privacyPolicyDocument} target="popup">privacy policy</a></label>
                  </div>
                  <div>
                    <button id="submitBtnRegister" type="submit" className="btn btn-primary">Register</button>
                    <i id="confirmIconRegister" hidden className="fas fa-check fa-2x"></i>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterModal;
