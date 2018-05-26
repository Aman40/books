import React, { Component } from 'react';
import './App.css';
import logo from './books-logo.png'
import languages from './languages.json'
import util from 'util'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: "English",
            curr_view: "show_prof", /*Specifies which view should be displayed*/
            /*Options are: sign_up, sign_in, show_prof, edit_prof,...*/
            obj_usr_info: {}, /*Holds user info as an object*/
            loggedin: false,
            chk_sessn: true,
            up_form:{
                alias: "",
                email: "",
                password1: "",
                password2: "",
                sex: "",
                dob: "",
                pref: "",
                about: "",
                student: false,
                school: "",
                schoolzip: "", //Fallback for book's location, and for user's location
                pass_check: false, //This gets sent too, but it's really not necessary!
            },
            in_form: {
                email: "",
                password: "",
            },
            up_err: {
                has_err: false,
                alias: "",
                email: "",
                sex: "",
                dob: "",
                pref: "",
                schoolzip: "",
                about: "",
                school: "",
                password1: ""
            }
        };
        this.english = languages.english; //Sourced from the languages.json file
        this.japanese = languages.japanese;// "
    }
    handleUpChange = (ev)=>{
        const up_form_copy = Object.assign({}, this.state.up_form);

        if(ev.target.name==="password1") { //Check the length and strength
            if(ev.target.value===this.state.up_form.password2) {
                up_form_copy.password1 = ev.target.value;
                up_form_copy.pass_check = true;
                this.setState({up_form: up_form_copy});
            } else {
                up_form_copy.password1 = ev.target.value;
                up_form_copy.pass_check = false;
                this.setState({up_form: up_form_copy});
            }
        }
        else if(ev.target.name==="password2") { //Check that it's equal to the first one
            if(this.state.password1!==ev.target.value) {
                up_form_copy.pass_check = false;
                up_form_copy.password2 = ev.target.value;
                this.setState({up_form: up_form_copy});
            } else {
                up_form_copy.pass_check = true;
                up_form_copy.password2 = ev.target.value;
                this.setState({up_form: up_form_copy});
            }
        } else {
            up_form_copy[ev.target.name] = ev.target.value;
            this.setState({up_form: up_form_copy});
        }
    };
    handleUpSubmit = (ev)=>{
        //Collect the form data, use the FormData object to send it to the db
        //Send URL is http://localhost:3000/signup
        //Method: POST
        console.log(this.state.up_form);
        ev.preventDefault();

        /*Write a custom fd object inheriting the methods I use below and emulates
        * the a FormData instance*/

        let fd = new MyFormData();
        let keys = Object.getOwnPropertyNames(this.state.up_form);
        for(let i=0;i<keys.length;i++) {
            fd.append(keys[i], this.state.up_form[keys[i]]);
        }
        //Append current datetime
        fd.append("curr_date_time", getCurrDate());
        //AJAX to send the form to http://localhost:3000/signup where a nodejs function is waiting
        let xht = new XMLHttpRequest();

        xht.responseType = "document";

        let that = this;
        xht.onreadystatechange = function () {
            if(this.readyState===4 && this.status===200) {
                //Successful. Sign in and redirect to the page with user information.
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;
                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status

                if(srv_res_status===0) {
                    //Success. Redirect to show profile
                    console.log("The form was successfully submitted");
                    let obj_usr_info = JSON.parse(xmlDoc.getElementsByTagName('usr_info')[0].childNodes[0].nodeValue);
                    that.setState({curr_view: "show_prof", obj_usr_info: obj_usr_info, loggedin: true}); //Pass control and data to next view (show_prof)
                } else if (srv_res_status===1) {
                    //Trigger alert or modal error in future
                    console.log("Username or email is already taken");
                } else if(srv_res_status===2) {
                    //Trigger alert or modal error in future
                    console.log("Unsupported characters have been detected in the input. Use only UTF-8 supported characters");
                } else if(srv_res_status===8) {
                    //The form failed validation tests
                    let errArray = JSON.parse(xmlDoc.getElementsByTagName('err_arr')[0].childNodes[0].nodeValue);

                    let err_obj = { /*Reinitialize/empty the previous errors*/
                        has_err: false,
                        alias: "",
                        email: "",
                        sex: "",
                        dob: "",
                        pref: "",
                        about: "",
                        school: "",
                        password1: ""
                    };
                    for(let i=0; i<errArray.length; i++) {
                        err_obj[errArray[i].param] = errArray[i].msg;
                    }
                    //Set error bool to true
                    err_obj.has_err = true;
                    //Render
                    that.setState({up_err: err_obj});
                } else {
                    console.log(`An error with srv_res_status ${srv_res_status} occurred`);
                }
            } else {
                //Display all the returned input errors right onto the form
                console.log(`Status: ${this.status}, readyState: ${this.readyState}`);
            }
        };
        xht.open('POST', 'http://localhost:8000/signup?'+fd, true);
        xht.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xht.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xht.send();

        /**/
    };
    handleInChange = (ev) => {
        const in_form_copy = Object.assign({}, this.state.in_form);

        if(ev.target.name==="email") {
            in_form_copy.email = ev.target.value;
            this.setState({in_form: in_form_copy});
        }

        if(ev.target.name==="password") {
            in_form_copy.password = ev.target.value;
            this.setState({in_form: in_form_copy});
        }
    };
    handleInSubmit = (ev)=>{
        //Collect the form data, use the FormData object to send it to the db
        //Send URL is http://localhost:3000/signin
        //Method: POST
        ev.preventDefault();

        let fd = new FormData();

        let keys = Object.getOwnPropertyNames(this.state.in_form);

        for(let i=0;i<keys.length;i++) {
            fd.append(keys[i], this.state.in_form[keys[i]]);
        }

        //AJAX to send the form to http://localhost:3000/signup where a nodejs function is waiting
        let xht = new XMLHttpRequest();

        xht.responseType = "document";

        let that = this;
        xht.onreadystatechange = function () {
            if(this.readyState===4 && this.status===200) {
                //Successful. Sign in and redirect to the page with user information.
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;
                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status

                if(srv_res_status===0) {
                    //Success. Redirect to show profile
                    console.log("The form was successfully submitted");
                    let obj_usr_info = JSON.parse(xmlDoc.getElementsByTagName('usr_info')[0].childNodes[0].nodeValue);
                    that.setState({curr_view: "show_prof", obj_usr_info: obj_usr_info, loggedin: true}); //Pass control and data to next view (show_prof)
                }

                else if (srv_res_status===1) {
                    //Trigger alert or modal error in future
                    console.log("Username or email is already taken");
                }

                else if(srv_res_status===2) {
                    //Trigger alert or modal error in future
                    console.log("Unsupported characters have been detected in the input. Use only UTF-8 supported characters");
                }

                else {
                    console.log(`An error with srv_res_status ${srv_res_status} occurred`);
                }
            } else {
                //Display all the returned input errors right onto the form
                console.log(`Status: ${this.status}, readyState: ${this.readyState}`);
            }
        };
        xht.open('POST', 'http://localhost:8000/log/in', true);
        xht.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xht.send(fd);
    };

    switchToProfile = ()=>{
        this.setState({curr_view: "show_prof"});
    };

    switchToSignIn = ()=>{
      this.setState({curr_view: "sign_in"});
    };

    switchToSignUp = ()=>{
        this.setState({curr_view: "sign_up"});
    };

    logout = ()=>{
        console.log("Logging out");

        let xht = new XMLHttpRequest();
        let that = this;

        xht.responseType = "document";
        xht.onreadystatechange = function () {
            if(this.readyState===4 && this.status===200) {
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status
                if(srv_res_status===0) {
                    //Destroy the user session here
                    that.setState({loggedin:false, obj_usr_info: {}});
                    document.cookie = "";
                } else if (srv_res_status===1) {
                    //Trigger alert or modal error in future
                    console.log("You need to be logged in to logout. Please login to logout.");
                }
            } else {
                console.log(`ReadyState: ${this.readyState}, Status: ${this.status}`);
            }
        };
        xht.open("GET", "http://localhost:8000/logout", true);
        xht.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xht.send();
    };

    getSession = ()=>{
        /*DEV
          This is only necessary for development
          It's meant to circumvent the problem of
          having the session stored on a different
          server with a different domain
        */
        let xht = new XMLHttpRequest();
        xht.responseType = "document";
        let that = this;

        xht.onreadystatechange = function() {
            if(this.readyState===4 && this.status===200) {
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);

                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;

                console.log(xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue);

                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status

                if(srv_res_status===0) {
                    //Success. Redirect to show profile
                    let obj_usr_info = JSON.parse(xmlDoc.getElementsByTagName('usr_info')[0].childNodes[0].nodeValue);

                    that.setState({loggedin:true, obj_usr_info: obj_usr_info, chk_sessn: false}); //Pass control and data to next view (show_prof)
                }

                else if (srv_res_status===1) {
                    //Trigger alert or modal error in future
                    console.log("You're not logged in. Please log in.");
                }
                that.setState({chk_sessn: false});
            } else {
                console.log(`ReadyState: ${this.readyState}, Status: ${this.status}`);
            }
        };
        xht.open("POST", "http://localhost:8000", true);
        xht.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xht.send();
    };

    componentWillMount = () => {
        /*Before the component renders on the screen, check the db if the session still
        * exists and if it does, fetch the fresh session data. If it doesn't, destroy
        * the locally stored session data*/
        this.getSession();
    };

    switchToContact =()=>{
        this.setState({curr_view: "contact"});

    }

    render() {
       let curr_view = "";

        if(this.state.curr_view==="sign_up") {
            curr_view = (
                <SignUp
                    err_obj = {this.state.up_err}
                    strings={this.state.language === "English" ? this.english : this.japanese}
                    up_form = {this.state.up_form}
                    handleUpChange = {this.handleUpChange}
                    handleUpSubmit = {this.handleUpSubmit}
                />
            );
        } else if(this.state.curr_view==="show_prof") {
            curr_view = (
                <ProfileShow
                    obj_usr_info = {this.state.obj_usr_info}
                    strings = {this.state.language==="English"?this.english:this.japanese}
                />
            );
        } else if(this.state.curr_view==="sign_in") {
            curr_view = (
                <SignIn
                    strings={this.state.language === "English" ? this.english : this.japanese}
                    in_form = {this.state.in_form}
                    handleInChange = {this.handleInChange}
                    handleInSubmit = {this.handleInSubmit}
                />
            );
        } else if(this.state.curr_view==="contact") {
            curr_view = (
                <Contact />
            )
        }

        return (
          <div className="App">
            <LanguageSelect
              onClick={this.toggleLanguage}
              language={this.state.language}
              getSession={this.getSession} //DEV
            />

            <div className={"row App-header"}>
                <div className={"col-sm-2 has-logo"}>
                    <img className={"img-responsive"} src={logo} id={"main-logo"} alt={"Books Home"} />
                </div>
                <div id={"no-logo"} className={"col-sm-8"}>
                    <div className={"row"} id={"no-logo-top"}>
                        <MenuBar
                            loggedin={this.state.loggedin}
                            strings={this.state.language==="English"?this.english:this.japanese}
                            switchToProfile={this.switchToProfile}
                            logout={this.logout}
                            login={this.switchToSignIn}
                            contactClick={this.switchToContact}
                            signup={this.switchToSignUp}
                        />
                    </div>
                    <div className={"row"} id={"no-logo-bottom"}>
                        <SearchBar
                            search_string={this.state.language==="English"?this.english.search:this.japanese.search}
                            onClick={this.handleSearchBarClick} />
                    </div>
                </div>
                <div className={"col-sm-2"}> {/*This is to give the menu symmetry*/}
                </div>
            </div> {/*The app header*/}

            <div className={"row"} id={"col-wrapper"}> {/*The wrapper for the 3 main columns*/}
                <div id={"left-booster"} className={"col-sm-2"}>{/*Left-most column*/}
                </div>
                <div id={"center-core"} className={"col-sm-8"}>{/*Center column*/}
                    <ModularCenterColumn>
                    {curr_view}
                    </ModularCenterColumn>
                </div>
                <div id={"right-booster"} className={"col-sm-2"}>{/*Right-most column*/}
                </div>
            </div>

            <div id={"footer"}>{/*This is the footer*/}
                <div className={"col-sm-4"}>

                </div>
                <div className={"col-sm-4"}>

                </div>
                <div className={"col-sm-4"}>

                </div>
            </div> {/*The footer*/}

          </div>
        );
    }
    toggleLanguage = (event) => {
        if(event.target.id==="language-en") {
            this.setState({language: "English"});
        } else if (event.target.id==="language-jp") {
            this.setState({language: "Japanese"})
        }
    };
    handleSearchBarClick = (event) => {
        event.preventDefault();
    }
}

class MenuBar extends Component {
    render() {
        let account_tab = "";
        if(this.props.loggedin) {
            account_tab = (
                <DropDownMenu innerText={this.props.strings.account}>
                    <div
                        className={"drop-down-item"}
                        onClick={this.props.switchToProfile}
                    >{this.props.strings.profile}</div>
                    <div
                        className={"drop-down-item"}
                        onClick={this.props.logout}
                    >{this.props.strings.logout}</div>
                </DropDownMenu>
            );
        } else {
            account_tab = (
                <DropDownMenu innerText={this.props.strings.account}>
                    <div
                        className={"drop-down-item"}
                        onClick={this.props.login}
                    >{this.props.strings.login}</div>
                    <div
                        className={"drop-down-item"}
                        onClick={this.props.signup}
                    >{this.props.strings.signup}</div>
                </DropDownMenu>
            );
        }
        return (
          <div id={"menu-bar"} className={"row"}>
              <div className={"menu-button col-sm-2"}>{this.props.strings.home}</div>
              {account_tab}
              <div className={"menu-button col-sm-2"}>{this.props.strings.about}</div>
              <div
                  className={"menu-button col-sm-2"}
                  onClick={this.props.contactClick}
              >{this.props.strings.contact}</div>
          </div>
        );
    }
}

class DropDownMenu extends Component{
    render() {
        //The children come in form of <a></a>
        let child_components = [];
        for(let i=0;i<this.props.children.length;i++) {
            child_components.push(
              <li key={i}>{this.props.children[i]}</li>
            );
        }
        return (
            <div className={"dropdown menu-button col-sm-2"}>
                <div
                    className={"dropdown-toggle"}
                    data-toggle={"dropdown"}
                >
                    {this.props.innerText+""}
                     <span className={"caret"}>{false}</span>
                </div>
                <ul className={"dropdown-menu"}>
                    {child_components}
                </ul>
            </div>
        );
    }
}

class LanguageSelect extends Component {
    render() {
        const selected = {
          backgroundColor: "gray"
        };
        return (
          <div id={"ls-tab"}>
              <div
                  style={this.props.language==="English"? selected : {}}
                  className={"ls-btn"} id={"language-en"}
                  onClick={this.props.onClick}>
                  English
              </div>
              <div
                  style={this.props.language==="Japanese"? selected : {}}
                  className={"ls-btn"}
                  id={"language-jp"}
                  onClick={this.props.onClick}>
                  日本語
              </div>
              <div className={"ls-btn"} onClick={this.props.getSession}>
                  Refresh
              </div>
          </div>
        );
    }
}

class SearchBar extends Component {
    render() {
        return (
            <div className={"search-bar col-sm-12"} >
                <form>
                    <div className={"input-group"}>
                        <input
                            type="text" className={"form-control"}
                            placeholder={this.props.search_string} />
                            <div className={"input-group-btn"}>
                                <button onClick={this.props.onClick} className={"btn btn-default"} type={"submit"}>
                                    <i className={"glyphicon glyphicon-search"}/>
                                </button>
                            </div>
                    </div>
                </form>
            </div>
        );
    }
}

class ModularCenterColumn extends Component {
    //Component represents a view of the central column
    //By replacing one with another, it gives the illusion of different pages.
    //Could be used for holding sign up, sign in, search results, e.t.c
    //It'll take its content in form of childred props
    render () {
        return (
            <div className={"center-col col-sm-12"}>
            {this.props.children}
            </div>
        );
    }
}

class SignUp extends Component {
    render () {
        let prefectures = this.props.strings.prefectures.map((pref)=>{
            return (
                <option
                    value={pref}
                    key={pref}
                >{pref}</option>
            )
        });

        let modal = "";

        if(this.props.err_obj.has_err) {
            //Open the modal and show the error
            let err_obj_keys = Object.keys(this.props.err_obj)
            let err_comp_list = [];
            for(let i=0; i<err_obj_keys.length; i++) {
                if(err_obj_keys[i]!=="has_err" && err_obj_keys[i]!=="") {
                    err_comp_list.push(
                        <p className={"error"} key={err_obj_keys[i]}>{this.props.err_obj[err_obj_keys[i]]}</p>
                    );
                }
            }
            modal = (
                <NotifierModal modal_header={"Form Error:"}>
                    {err_comp_list}
                </NotifierModal>
            );
        }

        return (
            <div>
                <form className={"form-vertical"} autoComplete={"on"}>
                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"}>{this.props.strings.alias}:</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"alias"}
                                type={"text"} className={"form-control"}
                                onChange={this.props.handleUpChange}
                                value={this.props.up_form.alias}
                                required={true}
                            />
                            <div className={"error"}>
                                {this.props.err_obj.alias}
                            </div>
                        </div>
                    </div>

                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"}>{this.props.strings.email}:</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"email"}
                                type={"email"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                value={this.props.up_form.email}
                                required={true}
                            />
                            <div className={"error"}>
                                {this.props.err_obj.email}
                            </div>
                        </div>
                    </div>

                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >{this.props.strings.sex}:</label>
                        <div className={"col-sm-10"}>
                            <div className={"radio"}>
                                <label>
                                    <input
                                        name={"sex"}
                                        type={"radio"}
                                        value={"M"}
                                        onChange={this.props.handleUpChange}
                                    />
                                    {this.props.strings.male}
                                </label>
                            </div>
                            <div className={"radio"}>
                                <label>
                                    <input
                                        name={"sex"}
                                        type={"radio"}
                                        value={"F"}
                                        onChange={this.props.handleUpChange}
                                    />
                                    {this.props.strings.female}
                                </label>
                            </div>
                            <div className={"error"}>
                                {this.props.err_obj.sex}
                            </div>
                        </div>
                    </div>

                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >{this.props.strings.dob}:</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"dob"}
                                type={"date"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                value={this.props.up_form.dob}
                                required={true}
                            />
                            <div className={"error"}>
                                {this.props.err_obj.dob}
                            </div>
                        </div>
                    </div>


                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >{this.props.strings.prefecture}:</label> {/*This is gonna need it's own component*/}
                        <div className={"col-sm-10"}>
                            <select
                                name={"pref"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                            >
                                {prefectures}
                            </select>
                            <div className={"error"}>
                                {this.props.err_obj.pref}
                            </div>
                        </div>
                    </div>


                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >{this.props.strings.form_about}:</label>
                        <div className={"col-sm-10"}>
                            <textarea
                                name={"about"}
                                type={"text"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                required={true}
                            ></textarea>
                            <div className={"error"}>
                                {this.props.err_obj.about}
                            </div>
                        </div>
                    </div>


                    <div className={"check-box row"}>
                        <label className={"col-sm-2 control-label"} >{this.props.strings.student}:</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"student"}
                                type={"checkbox"}
                                onChange={this.props.handleUpChange}
                                required={true}
                            />
                        </div>
                    </div><br/>


                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >{this.props.strings.school}:</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"school"}
                                type={"text"}
                                disabled={!this.props.up_form.student}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                required={true}
                            />
                            <div className={"error"}>
                                {this.props.err_obj.school}
                            </div>
                        </div>
                    </div>

                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >School Zip Code:</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"schoolzip"}
                                type={"number"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                required={true}
                            />
                            <div className={"error"}>
                                {this.props.err_obj.schoolzip}
                            </div>
                        </div>
                    </div>


                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >
                            {this.props.strings.password}:</label>
                        <div className={this.props.up_form.password1.length>7?"col-sm-10 has-success":"col-sm-10 has-error"}>
                            <input
                                name={"password1"}
                                type={"password"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                required={true}
                            />
                            <div className={"error"}>
                                {this.props.err_obj.password1}
                            </div>
                        </div>
                    </div>


                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >
                            {this.props.strings.password2}:</label>
                        <div className={this.props.up_form.pass_check?"has-success col-sm-10": "has-error col-sm-10"}>
                            <input
                                name={"password2"}
                                type={"password"}
                                className={"form-control"}
                                onChange={this.props.handleUpChange}
                                required={true}
                            />
                        </div>
                    </div>


                    <div className={"form-group row"}>
                        <input
                            id={"sign-in-submit"}
                            type={"submit"}
                            value={this.props.strings.send}
                            onClick={this.props.handleUpSubmit}
                        />
                    </div>

                </form>
            </div>
        );
    }
}

class ProfileShow extends Component {
    //This displays the users profile info. After signing up/in, the user is redirected here
    render() {
        let obj_usr_info = this.props.obj_usr_info;

        return (
            <div className={"myContainer"}>

                <ul className={"nav nav-tabs"}>
                    <li className={"active"}><a data-toggle={"tab"} href={"#home"}>About</a></li>
                    <li><a data-toggle={"tab"} href={"#menu1"}>My Books</a></li>
                </ul>

                <div className={"tab-content"}>

                    <div id={"home"} className={"tab-pane fade in active"}>
                        <div id={"user-info"}>
                            <div>
                                <h3>About Me</h3>
                                <p>
                                    {obj_usr_info.about}
                                </p>
                            </div>
                            <div>
                                <table className={"table table-responsive"}>
                                    <tbody>

                                    <tr>
                                        <th>
                                            {this.props.strings.alias}
                                        </th>
                                        <td>
                                            {obj_usr_info.alias}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.uid}
                                        </th>
                                        <td>
                                            {obj_usr_info.uid}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.sex}
                                        </th>
                                        <td>
                                            {obj_usr_info.sex}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.dob}
                                        </th>
                                        <td>
                                            {obj_usr_info.dob}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.prefecture}
                                        </th>
                                        <td>
                                            {obj_usr_info.pref}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.email}
                                        </th>
                                        <td>
                                            {obj_usr_info.email}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.about}
                                        </th>
                                        <td>
                                            {obj_usr_info.about}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            {this.props.strings.school}
                                        </th>
                                        <td>
                                            {obj_usr_info.school}
                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div id={"menu1"} className={"tab-pane fade"}>
                        <Books strings={this.props.strings} />
                    </div>

                </div>
            </div>

        );
    }
}

class Books extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _openModal: false, //This shows the status of the BookDetails modal
            itemNumber: 0,
            _hasLoaded: false, //After the first loading > true. So loadBooks is only called once
            active_view: "books", //"books", "add-book", "edit-book"
            books_result: [],
            limit: 50
        }
    }
    switchToAddBook=()=>{this.setState({active_view: "add-books"});}
    cancelAddBook=()=>{this.setState({active_view: "books"})}

    loadBooks = ()=>{
        //Fetch all books from the db then setState
        console.log("Fetching books");
        let xht = new XMLHttpRequest();
        xht.responseType = "document";

        let that = this;

        xht.onreadystatechange = function () {
            if(this.readyState===4 && this.status===200) {
                let xmlDoc = this.responseXML;
                //Set cookie: DEV only
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;

                console.log(xmlDoc);

                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status
                if(srv_res_status===0) {
                    //TODO: finish the Book component and display the books in the Books compt
                    console.log("Yuuge success!");
                    let books = JSON.parse(xmlDoc.getElementsByTagName('bks_info')[0].childNodes[0].nodeValue);
                    that.setState({books_result:books, active_view: "books"});
                } else {
                    console.log("Couldn't load books because: "+srv_res_status);
                }

            } else {
                console.log("Books Status: "+this.status);
                console.log("Books.readystate: "+this.readyState);
            }
        }

        xht.open('POST', 'http://localhost:8000/books/fetch?limit='+this.state.limit, true);
        xht.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xht.send();
    }
    componentWillMount=()=>{
        this.loadBooks();
    }

    setLimit = (event)=>{
        this.setState({limit:event.target.value});
    }

    showBookDetails=(i)=>{
        console.log("Clicked on number: "+i);
        this.setState({_openModal: true, itemNumber: i});
    }

    closeModal = (ev)=>{
        //Pass the same function to
        this.setState({_openModal: false})
    }
    editBook = ()=>{
      //TODO: _openModal=true and activeView="edit-books" should never co-exist
      //edit-books will use the same state.itemNumber used by BookDetails
      this.setState({active_view: "edit-books", _openModal: false});
    }
    render() {
        let detailsModal = "";
        if(this.state._openModal) {
            console.log("Preparing the modal");
            detailsModal = (
                <BookDetails
                    editBook={this.editBook}
                    book={this.state.books_result[this.state.itemNumber]}
                    close={this.closeModal}
                    reloadParent={this.closeModal}
                    />
            )
        }
        let books = [];

        if(this.state.active_view==="books" && this.state.books_result.length) {
          //We have some books, display them if the view is active
            for(let i=0; i<this.state.books_result.length; i++) {
                books.push(//Build the book component here
                    <div
                        key={this.state.books_result[i].BookID}
                        className={"book-capsule"}
                        onClick={()=>{this.showBookDetails(i)}}
                    >
                        <div className={"bc-top"}>
                            <div className={"bc-t-top col-12"}>
                                <img src={this.state.books_result[i].images.length?
                                    this.state.books_result[i].images[0].ImgURI:
                                    "http://localhost:8000/images/placeholder.jpg"}
                                     className={"book-img"} />
                            </div>
                            <div className={"bc-t-bottomcol-12"}>
                                <div className={"bc-tb-top"}>
                                    <h4><b>{this.state.books_result[i].Title}</b></h4>
                                </div>
                                <div className={"bc-tb-bottom row"}>
                                    <div className={"bc-tbb-left col-6"}>
                                        <b>{this.state.books_result[i].Price} ¥</b>
                                    </div>
                                    <div className={"bc-tbb-right col-6"}>
                                        {this.state.books_result[i].OfferExpiry.split('T')[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"bc-bottom"}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>
                                            Author:
                                        </th>
                                        <td className={"gray-text"}>
                                            {this.state.books_result[i].Authors}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Publisher:
                                        </th>
                                        <td className={"gray-text"}>
                                            {this.state.books_result[i].Publisher}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Published:
                                        </th>
                                        <td className={"gray-text"}>
                                            {this.state.books_result[i].Published}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Pages:
                                        </th>
                                        <td className={"gray-text"}>
                                            {this.state.books_result[i].PageNo}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            ISBN:
                                        </th>
                                        <td className={"gray-text"}>
                                            {this.state.books_result[i].ISBN}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Added:
                                        </th>
                                        <td className={"gray-text"}>
                                            {this.state.books_result[i].DateAdded}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            }
        }
        let active_view = "";
        if(this.state.active_view==="books") {
            active_view = (
                <div id={"books-container"}>
                    <div id={"books-head"}>
                        <div id={"select-max"}>
                            <select  onChange={this.setLimit}>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <button className={"inline btn"} onClick={this.switchToAddBook}>
                            <span className={"glyphicon glyphicon-plus"}></span> Add Books
                        </button>
                    </div>
                    <div id={"books-body"}>
                        {books?books:"You have no books to show!"}
                    </div>
                    {detailsModal}
                </div>
            )
        } else if(this.state.active_view==="add-books") {
            active_view = (
                <AddBook
                    context={"add-book"}
                    book={""}
                    cancel={this.cancelAddBook}
                    strings={this.props.strings}
                    loadBooks={this.loadBooks}
                />
            )
        } else if(this.state.active_view==="edit-books") {
          active_view = (
              <AddBook
                context={"edit-book"}
                book={this.state.books_result[this.state.itemNumber]} //pass the books
                cancel={this.cancelAddBook}
                strings={this.props.strings}
                loadBooks={this.loadBooks}
              />
          )
        }

        return (
            <div>
                {active_view}
            </div>
        );
    }
}

class AddBook extends Component {
    constructor(props) {
        super(props)
        this.state={
            init_done: false, //Initialization. Pre-filling old data
            values: {
                title: "",
                authors: "",
                published: "",
                edition: 1,
                language: "",
                description: "",
                cover: "",
                page_no: "",
                publisher: "",
                isbn: "",
                is_new: false,
                condition: "",
                location: "",
                zipcode: "",
                price: 0,
                deliverable: false,
                offer_expiry: ""
            },
            errors: {
                title: "",
                authors: "",
                published: "",
                edition: "",
                language: "",
                description: "",
                cover: "",
                page_no: "",
                publisher: "",
                isbn: "",
                is_new: "",
                condition: "",
                location: "",
                zipcode: "",
                price: "",
                deliverable: "",
                offer_expiry: ""
            }
        }
    }
    componentDidMount = ()=>{
        if(this.props.context==="edit-book" && !this.state.init_done) {
            //set the values object in the state;
            let values =  {
                title: this.props.book.Title,
                authors: this.props.book.Authors,
                published: this.props.book.Published,
                edition: this.props.book.Edition,
                language: this.props.book.Language,
                description: this.props.book.Description,
                cover: this.props.book.Cover,
                page_no: this.props.book.PageNo,
                publisher: this.props.book.Publisher,
                isbn: this.props.book.ISBN,
                is_new: this.props.book.New===1,
                condition: this.props.book.Condition,
                location: this.props.book.Location,
                price: this.props.book.Price,
                deliverable: this.props.book.Deliverable===1,
                offer_expiry: this.props.book.OfferExpiry.split('T')[0]
            }
            this.setState({init_done: true, values: values});
        }
    }

    handleSubmit=(ev)=>{
        //Get the form data
        console.log(this.state.values);
        //prevent default
        ev.preventDefault();

        let fd = new MyFormData(); //Custom object
        let keys = Object.keys(this.state.values);

        for(let i=0; i<keys.length; i++) {
            fd.append(keys[i], this.state.values[keys[i]]);
        }
        fd.append("curr_date", getCurrDate());
        if(this.props.context==="edit-book") {
          fd.append("book_id", this.props.book.BookID);
        }

        let xht = new XMLHttpRequest();
        xht.responseType = "document";
        let that=this;//use
        xht.onreadystatechange = function () {
            if(this.readyState===4 && this.status===200) {
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                //Set the new cookie //DEV
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;

                console.log(xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue);

                let srv_res_status = parseInt(xmlDoc.getElementsByTagName("srv_res_status")[0].childNodes[0].nodeValue, 10);

                if(srv_res_status===0) {
                    //Success. Switch to the "show_books" view
                    that.props.loadBooks();
                } else if(srv_res_status===8) {
                    //The form failed validation tests
                    let errArray = JSON.parse(xmlDoc.getElementsByTagName('err_arr')[0].childNodes[0].nodeValue);
                    let err_obj = { /*Reinitialize/empty the previous errors*/
                        has_err: false,
                        title: "",
                        authors: "",
                        published: "",
                        edition: "",
                        language: "",
                        description: "",
                        cover: "",
                        page_no: "",
                        publisher: "",
                        isbn: "",
                        is_new: "",
                        condition: "",
                        location: "",
                        zipcode: "",
                        price: "",
                        deliverable: "",
                        offer_expiry: ""
                    };
                    for(let i=0; i<errArray.length; i++) {
                        err_obj[errArray[i].param] = errArray[i].msg;
                    }
                    //Set error bool to true
                    err_obj.has_err = true;
                    console.log("Error obj:");
                    console.log(err_obj);
                    //Render
                    that.setState({errors: err_obj});
                } else {
                    console.log("A problem occurred. srv_res_status: "+srv_res_status);
                }

            } else {
                console.log(`readyState: ${this.readyState}, status: ${this.status}`);
            }
        }
        if(this.props.context==="add-book") {
            xht.open("POST", "http://localhost:8000/books/alter/add?"+fd, true);
        } else {
            xht.open("POST", "http://localhost:8000/books/alter/edit?"+fd, true);
        }
        xht.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xht.send();
    }

    handleChange=(event)=>{
            let values_copy = Object.assign({}, this.state.values);

            if(event.target.name==="deliverable") {
                values_copy.deliverable = !values_copy.deliverable;
            } else if(event.target.name==="is_new") {
                values_copy.is_new = !values_copy.is_new;
            } else {
                values_copy[event.target.name] = event.target.value;

            }
            this.setState({values: values_copy});
        }

    render() {

        //Get languages from here
        let langObj = this.props.strings.languages;

        let sortable = [];

        for(let key in langObj) {
            sortable.push([key, langObj[key]]);
        }
        sortable.sort((a, b)=>{
            return a>b?1:-1;
        });

        let languages = [(
            <option key={"option"} value={"wrong_choice"}>
                {this.props.strings.lang_select_prompt}
            </option>
        )];
        for(let i=0; i<sortable.length; i++) {
            languages.push(
                <option
                    value={sortable[i][0]}
                    key={sortable[i][0]}
                >
                    {sortable[i][1]}
                </option>
            )
        }
        return (
                <div>
                    <form className={"form-vertical"}>
                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label required"}>{this.props.strings.books.title}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"title"}
                                    type={"text"}
                                    className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.title}
                                />
                                <div className={"error"}>
                                    {this.state.errors.title}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label required"} >{this.props.strings.books.language}:</label> {/*This is gonna need it's own component*/}
                            <div className={"col-sm-10"}>
                                <select
                                    name={"language"}
                                    className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.language}
                                >
                                    {languages}
                                </select>
                                <div className={"error"}>
                                    {this.state.errors.language}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.authors}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"authors"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.authors}
                                    placeholder={"E.g Aman Haman, Kvothe Arliden, ..."}
                                />
                                <div className={"error"}>
                                    {this.state.errors.authors}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.description}:</label>
                            <div className={"col-sm-10"}>
                                <textarea
                                    name={"description"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.description}
                                >{this.state.values.description}</textarea>
                                <div className={"error"}>
                                    {this.state.errors.description}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label required"} >{this.props.strings.books.book_cover}:</label>
                            <div className={"col-sm-10"}>
                                <div className={"radio"}>
                                    <label>
                                        <input
                                            name={"cover"}
                                            type={"radio"}
                                            value={"paper_back"}
                                            onChange={this.handleChange}
                                            checked={this.state.values.cover==="paper_back"}
                                        />
                                        {this.props.strings.books.paper_back}
                                    </label>
                                </div>
                                <div className={"radio"}>
                                    <label>
                                        <input
                                            name={"cover"}
                                            type={"radio"}
                                            value={"hard_back"}
                                            onChange={this.handleChange}
                                            checked={this.state.values.cover==="hard_back"}
                                        />
                                        {this.props.strings.books.hard_back}
                                    </label>
                                </div>
                                <div className={"error"}>
                                    {this.state.errors.cover}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label  required"}>{this.props.strings.books.page_no}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"page_no"}
                                    type={"number"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.page_no}
                                />
                                <div className={"error"}>
                                    {this.state.errors.page_no}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.publisher}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"publisher"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.publisher}
                                />
                                <div className={"error"}>
                                    {this.state.errors.publisher}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.published}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"published"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.published}
                                    min={"1700"}
                                    maxLength={"4"}
                                    minLength={"4"}
                                />
                                <div className={"error"}>
                                    {this.state.errors.published}
                                </div>
                            </div>
                        </div>

                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.edition}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"edition"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.edition}
                                />
                                <div className={"error"}>
                                    {this.state.errors.edition}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.isbn}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"isbn"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.isbn}
                                />
                                <div className={"error"}>
                                    {this.state.errors.isbn}
                                </div>
                            </div>
                        </div>


                        <div className={"check-box row"}>
                            <label className={"col-sm-2 control-label"} >{this.props.strings.books.is_new}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"is_new"}
                                    type={"checkbox"}
                                    onChange={this.handleChange}
                                    checked={this.state.values.is_new==1}
                                />
                                <div className={"error"}>
                                    {this.state.errors.is_new}
                                </div>
                            </div>
                        </div><br/>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.condition}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"condition"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.condition}
                                />
                                <div className={"error"}>
                                    {this.state.errors.condition}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>Zip Code:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"zipcode"}
                                    type={"number"} 
                                    className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.zipcode}
                                />
                                <div className={"error"}>
                                    {this.state.errors.zipcode}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.location}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"location"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.location}
                                />
                                <div className={"error"}>
                                    {this.state.errors.location}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.price} (¥):</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"price"}
                                    type={"text"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.price}
                                />
                                <div className={"error"}>
                                    {this.state.errors.price}
                                </div>
                            </div>
                        </div>


                        <div className={"check-box row"}>
                            <label className={"col-sm-2 control-label"} >{this.props.strings.books.deliverable}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"deliverable"}
                                    type={"checkbox"}
                                    onChange={this.handleChange}
                                    checked={this.state.values.deliverable==1}
                                />
                                <div className={"error"}>
                                    {this.state.errors.deliverable}
                                </div>
                            </div>
                        </div><br/>


                        <div className={"form-group row"}>
                            <label className={"col-sm-2 control-label"}>{this.props.strings.books.offer_expiry}:</label>
                            <div className={"col-sm-10"}>
                                <input
                                    name={"offer_expiry"}
                                    type={"date"} className={"form-control"}
                                    onChange={this.handleChange}
                                    value={this.state.values.offer_expiry}
                                />
                                <div className={"error"}>
                                    {this.state.errors.offer_expiry}
                                </div>
                            </div>
                        </div>


                        <div className={"form-group row"}>
                            <input
                                id={"sign-in-submit"}
                                type={"submit"}
                                className={"btn-success"}
                                value={this.props.strings.send}
                                onClick={this.handleSubmit}
                            />
                            <input
                                id={"sign-in-submit"}
                                type={"submit"}
                                className={"btn-danger"}
                                value={this.props.strings.cancel}
                                onClick={this.props.cancel}
                            />
                        </div>

                    </form>
                </div>
            )
    }
}

class SignIn extends Component {
    render() {
        return (
            <div>
                <form className={"form-vertical"} autoComplete={"on"}>

                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"}>{this.props.strings.email}</label>
                        <div className={"col-sm-10"}>
                            <input
                                name={"email"}
                                type={"email"}
                                className={"form-control"}
                                onChange={this.props.handleInChange}
                                value={this.props.in_form.email}
                                required={true}
                            />
                        </div>
                    </div>

                    <div className={"form-group row"}>
                        <label className={"col-sm-2 control-label"} >
                            {this.props.strings.password}</label>
                        <div className={this.props.in_form.password.length>7?"col-sm-10 has-success":"col-sm-10 has-error"}>
                            <input
                                name={"password"}
                                type={"password"}
                                className={"form-control"}
                                onChange={this.props.handleInChange}
                                required={true}
                            />
                        </div>
                    </div>


                    <div className={"form-group row"}>
                        <input
                            id={"sign-in-submit"}
                            type={"submit"}
                            value={this.props.strings.send}
                            onClick={this.props.handleInSubmit}
                        />
                    </div>

                </form>
            </div>
        );
    }
}

class NotifierModal extends Component {
    componentDidMount = ()=>{
        /*The very existence of this modal
        * signifies the presence of errors in the form
        * So, display it as soon as it's created*/
        document.getElementById("opn-err-frm-up").click();
        /*Destroy the component*/
        let modal = document.getElementById("myModal");
        window.onclick = (event)=>{
            if(event.target===modal) {
                console.log("Destroying modal");
                modal.parentNode.removeChild(modal);
            }
        }
    }

    destroyModal=(event)=>{
        /*Completely destroy the modal*/
        let modal = document.getElementById("myModal");
        modal && modal.parentNode.removeChild(modal);

    }

    render() {
        return (
            <div id="myModal" className={"modal fade"} role={"dialog"} onClick={this.destroyModal}>
                <div className={"modal-dialog"}>

                    <div className={"modal-content"}>
                        <div className={"modal-header"}>
                            <button
                                type={"button"}
                                className={"close"}
                                onClick={this.destroyModal}
                            >&times;</button>
                            <h4 className={"modal-title"}>{this.props.modal_header}</h4>
                        </div>
                        <div className={"modal-body"}>
                            {this.props.children}
                        </div>
                        <div className={"modal-footer"}>
                            <button
                                type={"button"}
                                className={"btn btn-default"}
                                onClick={this.destroyModal}
                            >Close</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

class Contact extends Component {
    componentDidMount=()=>{

    }
    render() {
        return (
            <div id="contact" className={"container-fluid bg-grey"}>
                <h2 className={"text-center"}>CONTACT</h2>
                <div className={"row"}>
                    <div className={"col-sm-5"}>
                        <p>Contact us and well get back to you within 24 hours.</p>
                        <p><span className={"glyphicon glyphicon-map-marker"}></span> Minoh, Osaka - Japan</p>
                        <p><span className={"glyphicon glyphicon-phone"}></span> +81 8038033438</p>
                        <p><span className={"glyphicon glyphicon-envelope"}></span> amaniham40@gmail.com</p>
                    </div>
                    <div className={"col-sm-7 slideanim"}>
                        <div className={"row"}>
                            <div className={"col-sm-6 form-group"}>
                                <input className={"form-control"} id={"name"} name={"name"} placeholder={"Name"} type={"text"} required={"required"}/>
                            </div>
                            <div className={"col-sm-6 form-group"}>
                                <input className={"form-control"} id={"email"} name={"email"} placeholder={"Email"} type={"email"} required={"required"}/>
                            </div>
                        </div>
                        <textarea className={"form-control"} id={"comments"} name={"comments"} placeholder={"Comment"} rows={"5"}></textarea><br/>
                        <div className={"row"}>
                            <div className={"col-sm-12 form-group"}>
                                <button className={"btn btn-default pull-right"} type={"submit"}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

class BookDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeImg: 0,
            activeViewRight: "book-info", //Else: add-images, delete-book,
            errors: "",
            thumbnails: [],
            blobs: [],
            for_deletion: [],
        }
    }

    switchTo = (cmp)=>{
        this.setState({activeViewRight: cmp})
    }
    openImageSelector=()=>{
        document.getElementById("chooseBookImgs").click();
    }
    handleUpload = (ev)=>{
        ev.preventDefault();
        //Get each of the blobs, one after another, append them to a FormData instance and
        //Upload them with multipart. No te olvides el cookie
        let fd = new FormData();
        for(let i=0;i<this.state.blobs.length;i++) {
            fd.append("image_"+i, this.state.blobs[i]);
        }
        //Append the BookID
        fd.append("bookID", this.props.book.BookID);
        let that = this;
        //Enter the XMLHttpRequest object
        let xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        xhr.onreadystatechange = function(ev){
            if(this.readyState===4 && this.status===200) {
                console.log("Bingo!");
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;
                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status

                if(srv_res_status===0) {
                    console.log("Images uploaded");
                    that.props.reloadParent();
                } else {
                    console.log("Image upload failed. Check xmlDoc for details");
                }
            } else {
                console.log("ReadyState: "+this.readyState);
                console.log("Status: "+this.status);
            }
        }

        xhr.open("POST", "http://localhost:8000/books/images/upload", true);
        xhr.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xhr.send(fd);
    }
    handleChange=(ev)=>{
        /*When a user selects images,
          1. Check the MIME type to make sure they're really images
          2. Check there's not more than 5 images. Further restrictions will be applied
                when the user uploads the images, after looking at how many they already
                uploaded for the same item
          3. Display thumbnails of the images the max sizes are 400x400px;
          4. Upon uploading, upload each of the images one by one. Or, perform a custom
                pre-flight check for how many images the user already has in the db and
                allow them to delete any excesses
        */
        console.log("Handling change");
        let fileList = this.inputElement.files;
        //Check the number of files
        let currCount = fileList.length + this.props.book.images;
        if(currCount>5) {
            this.setState({errors: "Each book can have up to 5 pictures"});
        }
        //Create {display:none} canvases into the id="tmp-canvas" <div/> besides thumbnail <img>s
        let fileReader = new FileReader();
        let that = this;
		let filesLeft = fileList.length;

        fileReader.onload = (e)=>{
			//Check if there are any files left, read them AsDataURL
            console.log("Done loading");
            let img = (
                    <img
                        key={that.state.thumbnails.length}
                        style={{maxWidth: "200px", height: "auto"}}
                        src={e.target.result}/>
            )
            //create a virtual image and canvas from which to get the upload version with a
            //toned down quality(size)
            let hidnImg = document.createElement('img');
            //hidnImg.style = 'width: "100%"; height: "auto"; display: "none"'
            hidnImg.onload = (ev)=>{
				if(filesLeft!==0) {
					//This way, the upload process is essentially asynchronous but shoganai
					console.log("Files"+fileList[filesLeft-1].name);
			        fileReader.readAsDataURL(fileList[filesLeft-1]);
					filesLeft = filesLeft-1;
				}

				console.log("Loaded image: "+ev.target.width);
                //Create a hidden canvas
                let canvas = document.createElement('canvas');
                canvas.width = ev.target.width;
                canvas.height = ev.target.height;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(ev.target, 0,0);
                //Immediately remove the image and save it as a blob in the state
                //Later insert a quality inversely proportional to the size of the image.
                let blob = canvas.toBlob((blob)=>{
                    let blobs_copy = that.state.blobs.splice(0, that.state.blobs.length);
                    blobs_copy.push(blob);
                    that.setState({blobs: blobs_copy});
                }, "image/jpeg", 0.5);
            }
            hidnImg.src = e.target.result;

            //And thus, when the image loads, get a ctx2d of it.
            //Get a copy of the thumbnails array and append to it
            let thumbnails_copy = that.state.thumbnails.slice(0,that.state.thumbnails.length);
            thumbnails_copy.push(img);
            that.setState({thumbnails:thumbnails_copy});
        }

        console.log("Files"+fileList[filesLeft-1].name);
        fileReader.readAsDataURL(fileList[filesLeft-1]);
		filesLeft = filesLeft-1;

    }
    toggleIdForDel = (id)=>{
        let arr_cp = [];
        arr_cp = this.state.for_deletion.slice(0, this.state.for_deletion.length); //copy the array
        if(arr_cp.includes(id)) { //If it's already there, "delete that"
            let indx = arr_cp.indexOf(id);
            let new_arr = [];
            for(let i = 0;i<arr_cp.length;i++) {
                if(i!=indx) {
                    new_arr.push(arr_cp[i]);
                }
            }
            arr_cp = new_arr;
        } else { //Else, add it
            arr_cp.push(id);
        }
        console.log("For deletion: "+arr_cp);
        this.setState({for_deletion: arr_cp});
    }
    deleteImgs = ()=>{
        let that = this;
        let fd = new MyFormData();
        fd.append("id_arr", JSON.stringify(this.state.for_deletion));
        let xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        xhr.onreadystatechange = function () {
            if(this.readyState===4 && this.status===200) {
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;
                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status

                if(srv_res_status===0) {
                    console.log("Images deleted");
                    that.props.reloadParent();
                } else {
                    console.log("Image deletion failed. Check xmlDoc for details");
                }
            } else {
                console.log("ReadyState: "+this.readyState);
                console.log("Status: "+this.status);
            }
        }
        xhr.open('POST', 'http://localhost:8000/books/images/delete?'+fd, true);
        xhr.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xhr.send();
    }
    deleteBook = ()=>{
        let that = this;
        let fd = new MyFormData();
        fd.append("BookID", this.props.book.BookID);

        let xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        xhr.onreadystatechange = function () {
            if(this.readyState===4 && this.status === 200) {
                let xmlDoc = this.responseXML;
                console.log(xmlDoc);
                document.cookie = xmlDoc.getElementsByTagName('cookie')[0].childNodes[0].nodeValue;
                let srv_res_status = parseInt(xmlDoc.getElementsByTagName('srv_res_status')[0].childNodes[0].nodeValue, 10);//get the server response status

                if(srv_res_status===0) {
                    console.log("Book Deleted");
                    that.props.reloadParent();
                } else {
                    console.log("Book deletion failed. Check xmlDoc for error details");
                }
            } else {
                console.log("ReadyState: "+this.readyState);
                console.log("Status: "+this.status);
            }
        }
        xhr.open('POST', 'http://localhost:8000/books/images/delete?'+fd, true);
        xhr.setRequestHeader('Set-Cookie',document.cookie.split(';').splice(-1)[0].trim());
        xhr.send();
    }
    render() {

        let carousel = "";
        if(this.props.book.images.length<3) {
            //No carousel
            carousel=(
                <div className={"full-width"}>{/*Insert the images here*/}

                </div>
            )
        } else {
            let carouselIndicators=[];
            for(let i=0; i<this.props.book.images.length;i++) {
                carouselIndicators.push(
                    <li
                        data-target={"#myCarousel"}
                        data-slide-to={i}
                        key={this.props.book.images[i].ImgID}
                        className={!i?"active":""}
                    >
                    </li>
                )
            }

            let carouselInner = [];
            for(let i=0;i<this.props.book.images.length;i++) {
                carouselInner.push (
                    <div key={this.props.book.images[i].ImgID}
                         className={!i?"active item":"item"}>
                        <Img src={this.props.book.images[i].ImgURI} />
                    </div>
                )
            }

            carousel=(
                <div className={"bd-l-top carousel slide"} id={"myCarousel"} data-ride={"carousel"}>
                    <ol className={"carousel-indicators"}>
                        {carouselIndicators}
                    </ol>
                    {/*wrapper for slides*/}
                    <div className={"carousel-inner"}>
                        {carouselInner}
                    </div>
                    {/*Left and right controls*/}
                    <a className={"left carousel-control"} href={"#myCarousel"}
                       data-slide={"prev"}>
                        <span className={"glyphicon glyphicon-chevron-left"}></span>
                        <span className={"sr-only"}>Previous</span>
                    </a>
                    <a className={"right carousel-control"} href={"#myCarousel"} data-slide={"next"}>
                        <span className={"glyphicon glyphicon-chevron-right"}></span>
                        <span className={"sr-only"}>Next</span>
                    </a>
                </div> /*End of carousel*/
            )
        }

        let imgSrc = "";
        if(this.props.book.images.length) {
            //There are images. Display the first one
            imgSrc=this.props.book.images[this.state.activeImg].ImgURI;
        } else {
            //No images. Display the default
            imgSrc="http://localhost:8000/images/placeholder.jpg";
        }

        let activeView = "";

        if(this.state.activeViewRight==="book-info") {
            activeView=(
                <div className={"bd-right col-sm-6"}>
                    <div className={"bd-r-top"}>
                        <h3 align={"center"}><b>{this.props.book.Title}</b></h3>
                        <p>
                            {this.props.book.Description}
                        </p>
                        {/*The table with the rest of the data*/}
                        <table>
                            <tbody>
                            <tr>
                                <th>
                                    Language:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Language}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Authors:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Authors}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Publisher:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Publisher}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Published:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Published}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Pages:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.PageNo}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    ISBN:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.ISBN}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Added:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.DateAdded}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Cover:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Cover}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Location:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Location}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Price:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Price}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Deliverable:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.Deliverable?"Yes":"No"}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Available_Until:
                                </th>
                                <td className={"gray-text"}>
                                    {this.props.book.OfferExpiry}
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <div style={{"verticalAlign":"bottom"}} className={"bd-r-btm row"}>
                        <button
                          className={"col-xs-6 button"}
                          onClick={this.props.editBook}>Edit</button>
                        <button
                            onClick={()=>this.switchTo("delete-book")}
                            className={"col-xs-6 button"}>Delete</button>
                    </div>
                </div>
            )
        } else if(this.state.activeViewRight==="add-images") {
            activeView = (
                    <div className={"bd-right col-sm-6"}>
                        <div className={"error"}>{this.state.errors}</div>
                        <form>
                            <input
                                ref={(el)=>this.inputElement = el} /*A ref to access the files*/
                                id={"chooseBookImgs"}
                                onChange={this.handleChange}
                                style={{display: "none"}}
                                type="file"
                                multiple={"multiple"}
                                accept={"image/*"}
                                className={"col-xs-6 button"}/>
                        </form>
                        <div style={{"marginTop": "50px"}} className={"row"}>
                            <button
                                onClick={this.openImageSelector}
                                className={"col-xs-6 button"}>Select Images</button>
                            <button
                                onClick={()=>this.switchTo("book-info")}
                                className={"col-xs-6 button"}>Cancel</button>
                        </div>
                        <div id={"tmp-canvas"}>{/*Display the temporary canvases and imgs here*/}
                            {this.state.canvases}
                            {this.state.thumbnails}
                        </div>

                        <button
                            style={{position: "absolute", bottom: "10px", left: "0px"}}
                            onClick={this.handleUpload}
                            className={"col-xs-12"}>Upload</button>
                    </div>
                )
        } else if(this.state.activeViewRight==="delete-images") {
            //Create an array of thumbnails with a check button to the right for the user to
            //mark images for deletion plus an OK button
            let thumbnails = [];
            for(let i=0;i<this.props.book.images.length;i++) {
                thumbnails.push(
                    <div className={"row"}>
                        <div className={"col-xs-6"} style={{height:"100px"}}>
                            <Img src={this.props.book.images[i].ImgURI}/>
                        </div>
                        <div className={"col-xs-6"}>
                            <input
                                type={"checkbox"}
                                onClick={()=>this.toggleIdForDel(this.props.book.images[i].ImgID)}/>
                        </div>
                    </div>
                )
            }

            activeView = (
                <div className={"bd-right col-sm-6"}>
                    <div style={{marginTop: "50px", height: "417px", overflowY: "scroll"}}>
                        {thumbnails}
                    </div>
                    <div className={"bd-l-btm full-width row"}>
                        <button
                            onClick={()=>this.switchTo("book-info")}
                            className={"btn btn-light col-xs-6"}
                        >Cancel</button>
                        <button
                            onClick={this.deleteImgs}
                            className={"btn btn-light col-xs-6"}
                        >Finish</button>
                    </div>
                </div>
            )
        } else if(this.state.activeViewRight==="delete-book") {
            activeView = (
                    <div className={"bd-right col-sm-6"}>
                        <div  style={{marginTop: "50px"}}>
                            <p>Are you sure you want to delete the book</p>
                            <div className={"row"}>
                                <button
                                    className={"btn btn-danger col-xs-6"}
                                    onClick={this.deleteBook}
                                >
                                    Yes
                                </button>
                                <button
                                    className={"button col-xs-6 btn btn-success"}>
                                    No
                                </button>
                            </div>
                        </div>

                    </div>
                )
        }
        return (
            <div name={"modal"} className={"modal"} onClick={this.props.closeModal}>
                <div className={"modal-content row"}>
                    <span name={"close"} onClick={this.props.close} className={"close"}>&times;</span>
                    <div className={"bd-left col-sm-6"}>
                        <div className={"bd-l-top"}>
                            {carousel}
                        </div>
                        <div className={"bd-l-btm full-width row"}>
                            <button
                                onClick={()=>this.switchTo("add-images")}
                                className={"button col-xs-6"}
                            >Add Images</button>
                            <button
                                onClick={()=>this.switchTo("delete-images")}
                                className={"button col-xs-6"}
                            >Delete Images</button>
                        </div>
                    </div>
                    {activeView} {/*Right. Conditionally rendered*/}
                </div>
            </div>
        )
    }
}

class Img extends Component {
    //This is meant to adjust dimensions of the image with
    //Javascript (by setting element css styles) to cater for the variable aspect ratios
    constructor(props) {
        super(props);
        this.state={
            style: {},
            dimsOK: false, //Are the dimensions OK? To avoid an infinite loop of loading and rend
        }
    }

    setDims=(ev)=>{ //Set dimentions
        let img=ev.target;
        let style = {};

        if(img.width<img.height) { //Portrait. Set styling accordingly
            style = {height: "inherit", width: "auto"};
        } else { //Landscape or square. Set style accordingly
            style={height: "auto", width: "100%"};
        }
        this.setState({style: style, dimsOK: true});
    }
    render() {
        return (
            <img
                onLoad={!this.state.dimsOK? this.setDims:null}
                style={this.state.style}
                src={this.props.src}
            />
        )
    }
}

function MyFormData() {
    this._urlenc = ""; //The URL encoded formdata
    this.append = (key, val)=>{
        if(this._urlenc==="") {
            //The first appending. Don't prepend the "&"
            this._urlenc=`${key}=${val}`;
        } else {
            this._urlenc+=`&${key}=${val}`;
        }
    }
    this.toString = ()=>{
        return this._urlenc;
    }
}

function getCurrDate() {
    let date = new Date();
    //YYYY:MM:DD HH:MM:SS Unix datetime string, mysql compatible
    let month = date.getMonth();
    month++; //Javascript month is 0 based. 0=January, 11=December
    if(month<10) {
        month="0"+month.toString();
    }
    let day = date.getDate();
    if(day<10) {
        day="0"+day.toString();
    }
    let hours = date.getHours();
    if(hours<10) {
        hours="0"+hours.toString();
    }
    let minutes = date.getMinutes();
    if(minutes<10) {
        minutes="0"+minutes.toString();
    }
    let seconds = date.getSeconds();
    if(seconds<10) {
        seconds="0"+seconds.toString();
    }
    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export default App;
//DEV: Everything marked DEV is for development purposes and to be removed for a production version of the application;
//Extend to include past papers. kakomon. Student's will love that!
//And remember to send the cookie with each AJAX request
//In the home "dashboard", display a section of the books closest to the client from their location
//More such classes by: "might be interested",

/*
ISSUES:

*/
