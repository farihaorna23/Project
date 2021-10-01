import React, { Component } from "react";
// import { Link } from "react-router-dom";

// const url = '/rest/login'


class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmitLogin = (e) => {
        e.preventDefault();
        /*
        var formData = new FormData();
        formData.append('email', this.state.email);
        formData.append('password', this.state.password);

        const requestOptions = {
            method: 'POST',
            body: formData
        };

        fetch('/rest/login', requestOptions)
            .then(response => {
                console.log(response.status);
                console.log(response.data);
                this.setState({account: response.data});
                return response.json();
            })
            .catch(function(error) {
                console.log('Request failed', error)
            });
        alert("Successfully Logged In!");
        */

        fetch('/rest/login', {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        }).then(response => {

            if (response.status === 401) {
            alert("Wrong combination");
            
            }
            else
            {
            alert("successfully Logged In");
            }
            })
            .catch(function(error) {
            
                alert("Something went wrong");
            });

    }
    //handle submitlogin

    render() {
     const username = this.state.username;
     const password = this.state.password;
     return (  <div>
            <b>Log in</b>
            <br/>
            <br/>
            <form onSubmit={this.handleSubmitLogin}>
                <table border="0">
                    <tbody>
                        <tr>
                            <td>Username:</td>
                            <td>
                                <input type="username" name="username" size="20" autoCorrect="off" spellCheck="false"
                                       autoCapitalize="off" value={username} onChange={this.handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td>
                                <input type="password" name="password" size="20"
                                       required value={password} onChange={this.handleChange}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <input type="submit" value="Submit"/>
            </form>
            <a href="forgot">Forgot your password?</a>
            <br/>
            <div>
                Don't have an account? 
                <a href="/signup"> Sign Up Here!</a>
            </div>
            <br/>
            
        </div>
        );
    }
}

export default Login;

// import React, { Component } from "react";

// // const url = '/rest/login'

// class Login extends Component {
//     constructor() {
//         super();
//         this.state = {
           
//         }
//     }
    

//     render() {
     
//      return (  
//         <div>
//          Login
//         </div>
//     );
//     }
// }

// export default Login;


