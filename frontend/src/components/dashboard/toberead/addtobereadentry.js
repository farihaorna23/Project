import React, { Component } from "react";
import SearchBar from "../searchbar";



const usr = JSON.parse(localStorage.getItem('current_user'));
const url = `/rest/submit/${usr}`;

class AddEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      user: "",
    };
  }


  submitHandler = (e) => {
    e.preventDefault();
    
  };

  render() {
    const { title, link, user } = this.state;
    return (
      <div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: 'Courier New',
            fontSize: '25px'
          }}
        >
          My Bookshelf
        </div>
        <br />
        <form onSubmit={this.submitHandler}>
          <div>
            <div style={{paddingLeft:'200px'}}>
              <SearchBar usr={user} list={"tobelist"}/>
            </div>
            <div>
              <br/>
              <button style={{backgroundColor:"steelBlue", color:'white', fontFamily: 'Courier New',width:'500px', height:'40px'}} type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AddEntry;