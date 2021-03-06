// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import List, { ListItem } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import withWidth, { isWidthUp } from 'material-ui/utils/withWidth';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import LightbulbOutline from 'material-ui-icons/LightbulbOutline';
import ArrowDropRight from 'material-ui-icons/ChevronLeft';
import Refresh from 'material-ui-icons/Refresh';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import MobileStepper from 'material-ui/MobileStepper';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import AppDrawer from 'training/src/components/AppDrawer';
import AppSearch from 'training/src/components/AppSearch';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';

import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';

import Lang from '../language';
import Code from '../code';
import config from '../config';
import { initCache, getData, getRouter, getCache } from '../utils/helpers';
import { APP_TYPE_COMPANY, CHECK_CODE, APP_TYPE_UNLOGIN, NOTICE, LOGIN, ORG_LOGIN, REGISTER_COMPANY, CHECK_AVAILABLE,CHECK_CODE_PASSWORD,REGISTER_CHECKCODE,REGISTER_NEW } from '../enum';

import Base from '../pages/com/infos/base.paper'
import Express from '../pages/com/infos/express.paper'
import Finance from '../pages/com/infos/finance.paper'
import Admin from '../pages/com/infos/admin.paper'

import CommonAlert from './CommonAlert';
import BeingLoading from './BeingLoading';
import { access } from 'fs';

function getTitle(routes) {
  for (let i = routes.length - 1; i >= 0; i -= 1) {
    if (routes[i].hasOwnProperty('title')) {
      return routes[i].title;
    }
  }

  return null;
}

const styleSheet = createStyleSheet('AppFrame', theme => ({
  '@global': {
    html: {
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      lineHeight: '1.2',
      overflowX: 'hidden',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      fontFamily: '"Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif'
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
      width: 'auto',
    },
  },
  appFrame: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
  grow: {
    flex: '1 1 auto',
  },
  title: {
    marginLeft: 40,
    flex: '0 1 auto',
  },
  appBar: {
    transition: theme.transitions.create('width'),
  },
  appBarHome: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  [theme.breakpoints.up('lg')]: {
    drawer: {
      width: '150px',
    },
    appBarShift: {
      width: 'calc(100% - 150px)',
    },
    navIconHide: {
      display: 'none',
    },
  },
}));

const COMPANY_LOING_INDEX = 0;
const COMPANY_REGISTER_INDEX = 1;
const ORANIZATION_LOING_INDEX = 2;

const palette = createPalette({
  primary: blue,
  accent: pink,

});
const theme = createMuiTheme({ palette });

const TabContainer = props =>
  <div className={'nyx-login-body'}>
    {props.children}
  </div>;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class AppFrame extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    drawerOpen: false,
    open: false,
    anchorEl: undefined,
    logged: Boolean(sessionStorage.getItem("logged")),
    apptype: Number(sessionStorage.getItem("apptype")),
    showRegister: true,
    name: Lang[window.Lang].pages.main.input_your_account,
    password: "",
    check_code: "",
    code_img_url: "",
    image: "",
    register_phone_number:"",
    classify:0,
    activeStep: 0,
    index: 0,
    count:60,
    liked:true,
    check_register:true,
    unavailable: false,
    password_error: false,
    repeat_error: false,
    login_phone:"",
    register_account:"",
    available_result: "",
    password_result: "",
    repeat_result: "",
    phone_number: "",
    findPassword: false,
    phone_code: "",
    register_phone_code:"",
    register_password:"",
    register_repeat_password:"",
    beingLoading: false,
    openloginNoticeDialog:false,
    // 提示状态
    alertOpen: false,
    alertType: NOTICE,
    alertCode: Code.LOGIC_SUCCESS,
    alertContent: "",
    alertAction: []
  };

  componentWillMount() {
    window.CacheData = {};
    this.getRoutes();
    //document.getElementById("code_img").src=getRouter(CHECK_CODE).url;
    // this.get_check_code();
    if (!sessionStorage.logged || sessionStorage.logged === false) {
       this.context.router.push("/");

    } else {
      switch (Number(sessionStorage.apptype)) {
        case APP_TYPE_COMPANY:
          if (window.location.pathname === "/") {
            //运维修改
            this.context.router.push("/com/home");
          }
          break;
      }

    }
    addEventListener("loading", (e) => {
      this.setState({
        beingLoading: true
      })
    })
    addEventListener("dataOnload", (e) => {
      this.setState({
        beingLoading: false
      })
    })
    addEventListener("session_invalid", (e) => {

      // sessionStorage.logged = false;
      // sessionStorage.apptype = APP_TYPE_UNLOGIN;
      // sessionStorage.session = "";
      // window.location = "/";
      this.popUpNotice(NOTICE, 0, "您的session无效");
      this.logout();
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.findPassword === false && nextState.findPassword === true) {
      document.getElementById("login_password" + this.state.index).value = "";
      document.getElementById("check_code" + this.state.index).value = "";
    }
  }

  getRoutes = () => {
    var cb = (route, message, arg) => {
      try {
        if (message.code === Code.LOGIC_SUCCESS) {
          for (var key in message.data.routelist) {
            sessionStorage.setItem(key, JSON.stringify(message.data.routelist[key]));
          }
          var img_url = getRouter(CHECK_CODE).url;
          this.setState({ code_img_url: img_url });
          // this.setState({ code_img: this.getElementById("code_img" + this.state.index).src = getRouter(CHECK_CODE).url + "&time=" + Math.random() })
        } else {
          this.popUpNotice(NOTICE, 0, message.msg);
        }
      } catch (e) {
      }
    }
    getData({ url: config.routers }, { type: APP_TYPE_COMPANY, version: config.version }, cb);
  }

  check_available = (account) => {
    var cb = (route, message, arg) => {
      if (message.msg_code === Code.ACCOUNT_CAN_USE) {
        this.setState({
          unavailable: false,
          available_result: message.msg
        })
      } else {
        this.setState({
          unavailable: true,
          available_result: message.msg
        })
      }

    }
    getData(getRouter(CHECK_AVAILABLE), { key: "account", value: account }, cb);
  }

  register = (account, password,repeat, mobile,code) => {
    // 判断两次密码是否一致
    console.log(account+password+mobile+code)
    if (password !== repeat) {
      return;
    }
    if (account === "" || password === "") {
      return;
    }
    var cb = (route, message, arg) => {
      if (message.code === Code.LOGIC_SUCCESS) {
        
        sessionStorage.session = message.data.session;
        sessionStorage.accent = arg.account;
        sessionStorage.apptype = 1;
        sessionStorage.logged = true;
        //运维修改
        
        sessionStorage.classify=0;
        if(localStorage.loginNotice!="已读"){
          localStorage.loginNotice="未读";
        }
        this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
       //运维修改
       console.log(this.context.router)
        this.context.router.push("/com/home");
      }
      this.popUpNotice(NOTICE, 0, message.msg);
    }

    getData(getRouter(REGISTER_NEW), { account: account, password: password, mobile:mobile,code:code }, cb, { account: account, password: password });
  }

  login_success = (type) => {
    this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
    switch (type) {
      case APP_TYPE_COMPANY:
      //运维修改
        this.context.router.push("/com/home");
        break;
    }
  }

  login = (account, password, check_code) => {
    var cb = (route, message, arg) => {
      
      // Code.LOGIC_SUCCESS
      if (message.code === Code.LOGIC_SUCCESS) {
      //  debugger;
      //  console.log(message.data.session);
        sessionStorage.logged = true;
        //运维修改
        sessionStorage.classify=0;
        if(localStorage.loginNotice!="已读"){
          localStorage.loginNotice="未读";
        }
        
        sessionStorage.modules_id = message.data.modules_id;
        sessionStorage.account = arg["account"];
        sessionStorage.session = message.data.session;
        sessionStorage.apptype = arg["type"];
        this.login_success(Number(arg["type"]));
      } else {
        this.popUpNotice(NOTICE, 0, message.msg);
      }
    }

    var apptype;
    if (window.type === 1) {
      apptype = APP_TYPE_COMPANY;
      getData(getRouter(LOGIN), { account: account, password: password, type: 0, checkcode: check_code }, cb, { account: account, type: apptype });
    } 
  }

  register_check_button=()=>{
    var cb = (route, message, arg) => {
      this.popUpNotice(NOTICE, 0, message.msg);
      if (message.code === Code.LOGIC_SUCCESS) {
         this.setState({
          check_register:false
         })
      
      }
  }
  getData(getRouter(REGISTER_CHECKCODE), {code:this.state.register_phone_code,mobile:this.state.register_phone_number}, cb, {});
  }
  handleNext = () => {
    if (this.state.activeStep === 5) {
      this.login(name, password);
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleChange = (event, index) => {
    this.setState({ index });
  };

  handleChangeIndex = index => {
    this.setState({ index });
  };

  RegisterStep = () => {
    switch (this.state.activeStep) {
      // 遵守协议
      // case 0:
      //   return <div>
      //     <Typography>遵循中软科技以下条款</Typography>
      //   </div>
      case 0:
        return (this.state.check_register?<div>
          <TextField
            error={this.state.unavailable}
            name="register_account"
            id="register_account"
            style={{height:"4.2rem"}}
            label={Lang[window.Lang].pages.main.com_account}
            fullWidth={true}
            onFocus={(e) => {
              this.setState({
                unavailable: false,
                available_result: "请输入公司全称"
              })
            }}
            onChange={(e)=>{
              this.setState({
                register_account:e.target.value,
              })
            }}
            onBlur={(e) => {
              console.log(this.state.register_account)
              if (document.getElementById("register_account").value === "") { } else {
                this.check_available(document.getElementById("register_account").value);
              }
            }}
            helperText={this.state.available_result}
          />
          <TextField
            label={"请输入手机号"}
            id={"register_phone_number"}
            type="register_phone_number"
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ register_phone_number: event.target.value })}
          />
          <a

           style={{color:"#2196f3",marginTop:"1.4rem"}}
            className={'nyx-send-checkcode'}
            onClick={() => {
             // console.log(this.state.name)
              // if(this.state.name==Lang[window.Lang].pages.main.input_your_account){
              //   this.popUpNotice(NOTICE, 0,"请输入公司全称");
              //   return false;
              // }
              if(this.state.register_phone_number==""){
                this.popUpNotice(NOTICE, 0,"请输入手机号");
                return false;
              }
              
              if(this.state.liked){
                this.timer = setInterval(function () {
                  var count = this.state.count;
                  this.state.liked = false;
                  count -= 1;
                  if (count < 1) {
                    this.setState({
                      liked: true
                    });
                    count = 60;
      　　　　　　　　clearInterval(this.timer);
                  }
                  this.setState({
                    count: count
                  });
                }.bind(this), 1000);
              }
              if(this.state.count==60){
                var cb = (route, message, arg) => {
                  // Code.LOGIC_SUCCESS
                  this.popUpNotice(NOTICE, 0, message.msg);
                }
                getData(getRouter("register_sendcode"), { mobile: this.state.register_phone_number}, cb, {});
                var apptype;
             
              }
            }}
            
          >
            {this.state.liked ? '获取验证码' : this.state.count + '秒后重新获取验证码'}
          </a>
          <TextField
            label={"验证码"}
            id={"register_phone_code" + this.state.index}
            type="register_phone_code"
            style={{
              width: "75%",
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
              marginTop:15
            }}
            fullWidth={true}
            onChange={event => this.setState({ register_phone_code: event.target.value })}
          />
       <Button
            className="nyx-btn-circle"
            raised
            color="primary"
            onClick={() => {
              if(this.state.register_account==""){
                this.popUpNotice(NOTICE, 0,"请输入公司全称");
                return false;
              }
              if(this.state.register_phone_number==""){
                this.popUpNotice(NOTICE, 0,"请输入手机号");
                return false;
              }
              if(this.state.register_phone_code==""){
                this.popUpNotice(NOTICE, 0,"请输入验证码");
                return false;
              }
              this.register_check_button();
            }}
          >
            {Lang[window.Lang].pages.main.register_check_button}
          </Button>
          
        </div>:
        <div>
         <div>
         <TextField
            error={this.state.password_error}
            id="register_password"
            label={Lang[window.Lang].pages.main.password}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
             
            }}
            type="password"
            fullWidth={true}
            defaultValue={this.state.register_password}
            onChange={(e) => {
              this.setState({
                register_password:e.target.value
              })
            }}
            helperText={this.state.password_result}
          />
          <TextField
            style={{
              marginLeft: "auto",
              marginRight: "auto",
             marginTop:15
            }}
            error={this.state.repeat_error}
            id="repeat_password"
            label={Lang[window.Lang].pages.main.repeat_password}
            type="password"
            fullWidth={true}
            defaultValue={this.state.register_repeat_password}
            onBlur={(e) => {
              if (document.getElementById("register_password").value === "" && document.getElementById("repeat_password").value === "") {
                this.setState({
                  repeat_error: false,
                  password_error: false,
                  repeat_result: "",
                  password_result: ""
                })
              } else {
                if (document.getElementById("register_password").value === "") {
                  this.setState({
                    repeat_error: true,
                    repeat_result: Lang[window.Lang].ErrorCode[1001]
                  })
                } else if (document.getElementById("repeat_password").value !== document.getElementById("register_password").value) {
                  this.setState({
                    repeat_error: true,
                    repeat_result: Lang[window.Lang].ErrorCode[1000]
                  })
                } else {
                  this.setState({
                    repeat_error: false,
                    password_error: false,
                    repeat_result: "",
                    password_result: ""
                  })
                }
              }
            }}
            onChange={(e) => {
              this.setState({
                register_repeat_password:e.target.value
              })
            }}
            helperText={this.state.repeat_result}
          />
        <Button
            className="nyx-btn-circle"
            raised
            color="primary"
            onClick={() => {
              console.log(this.state.register_account);
              let account = this.state.register_account;
              account=account.replace(/（/g,'('); 
              account=account.replace(/ /g,''); 
              account=account.replace(/）/g,')');  
             
              let password =this.state.register_password;
              let repeat =this.state.register_repeat_password;
              let mobile = this.state.register_phone_number;
              let code = this.state.register_phone_code;
              if(this.state.register_password==""){
                this.popUpNotice(NOTICE, 0,"请输入密码");
                return false;
              }
              if(this.state.register_repeat_password==""){
                this.popUpNotice(NOTICE, 0,"请再次输入密码");
                return false;
              }
              this.register(account, password,repeat, mobile,code);//TODO

            }}
          >
            {Lang[window.Lang].pages.main.register_button}
          </Button>
         </div>
           
          </div>)
      case 2:
        return <div>
          <Base />
        </div>
      case 3:
        return <div>
          <Finance />
        </div>
      case 4:
        return <div>
          <Express />
        </div>
      case 5:
        return <div>
          <Admin />
        </div>
    }
  }

  RegisterView = () => {
    return (
      <div>
        {this.RegisterStep()}
      </div>
    )
  }

  LoginView = () => {
    return (
      this.state.findPassword ?
        <div>
          <TextField
            id={"login_name" + this.state.index}
            label={COMPANY_LOING_INDEX === this.state.index ? Lang[window.Lang].pages.main.com_account : Lang[window.Lang].pages.main.org_account}
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={
              event => this.setState({ name: event.target.value })}
          />
          <TextField
            label={"短信验证码"}
            id={"phone_number"}
           // type="phone_number"
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
              height:"5rem"
            }}
            fullWidth={true}
            onChange={event => this.setState({ phone_code: event.target.value })}
            helperText={this.state.login_phone}
          />
          
          <a

           style={{color:"#2196f3"}}
            className={'nyx-send-checkcode'}
            onClick={() => {
             console.log(this.state.name)
              if(this.state.name==Lang[window.Lang].pages.main.input_your_account){
                this.popUpNotice(NOTICE, 0,"请输入公司全称");
                return false;
              }
              if(this.state.liked){
                this.timer = setInterval(function () {
                  var count = this.state.count;
                  this.state.liked = false;
                  count -= 1;
                  if (count < 1) {
                    this.setState({
                      liked: true
                    });
                    count = 60;
      　　　　　　　　clearInterval(this.timer);
                  }
                  this.setState({
                    count: count
                  });
                }.bind(this), 1000);
              }
              if(this.state.count==60){
                var cb = (route, message, arg) => {
                  // Code.LOGIC_SUCCESS
                  if (message.code === Code.LOGIC_SUCCESS) {
                   // window.CacheData.base = arg.data;
                   this.setState({
                     login_phone:"验证码已发送至"+message.data.tel
                   })
                  
                }
                  this.popUpNotice(NOTICE, 0, message.msg);
                }
                var apptype;
               // var name = this.state.name;
               // getData(getRouter("forget_code_login"), { account: this.state.name, code: this.state.phone_code, }, cb, { account: name });
                if (window.type === 1) {
                  apptype = APP_TYPE_COMPANY;
                  console.log(this.state.name)
                  getData(getRouter("login_sendcode"), { account: this.state.name}, cb, {});
                } 
  
              }
              
             
            //  getData(getRouter("forget_code"), { account: this.state.name, tel: this.state.phone_number, }, cb, {});

            }}
            
          >
            {this.state.liked ? '获取验证码' : this.state.count + '秒后重新获取验证码'}
          </a>
          
          {/* <TextField
            label={"验证码"}
            id={"phone_code" + this.state.index}
            type="phone_code"
            style={{
              width: "75%",
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ phone_code: event.target.value })}
          /> */}
        
          <Button
            raised
            color="primary"
            className={'nyx-btn-circle'}
            onClick={() => {
              this.setState({
                login_phone:""
              })
            var cb = (route, message, arg) => {
              // Code.LOGIC_SUCCESS
              if (message.code === Code.LOGIC_SUCCESS) {
                sessionStorage.logged = true;
                sessionStorage.classify=0;
                if(localStorage.loginNotice!="已读"){
                  localStorage.loginNotice="未读";
                }
                sessionStorage.account = arg["account"];
                sessionStorage.session = message.data.session;
                sessionStorage.apptype = arg["type"];
                this.login_success(Number(arg["type"]));
                // this.popUpNotice(NOTICE, message.code, Lang[window.Lang].pages.main.login_success);
              } else {
                this.popUpNotice(NOTICE, 0, message.msg);
              }
            }

            var apptype;
            var name = this.state.name;
            name=name.replace(/（/g,'(');  
            name=name.replace(/）/g,')');  
            name=name.replace(/ /g,''); 
            console.log(name);
           // getData(getRouter("forget_code_login"), { account: this.state.name, code: this.state.phone_code, }, cb, { account: name });
            if (window.type === 1) {
              console.log("0000");
              apptype = APP_TYPE_COMPANY;
              getData(getRouter("login_telcode"), { account: name, code: this.state.phone_code }, cb, { account: name, type: apptype });
            } 
            }}
          >
            {"登录"}
          </Button>
          <br/>
          <a 
           style={{color:"#2196f3",fontSize:"12px",cursor:"pointer",position:"relative",top:"2.4rem"}}
           onClick={() => {
            this.setState({
              findPassword: false,
              login_phone:""
            })
          }}
          >{"密码登录?"}</a>
        </div > :
        <div>
          <TextField
            id={"login_name" + this.state.index}
            label={COMPANY_LOING_INDEX === this.state.index ? Lang[window.Lang].pages.main.com_account : Lang[window.Lang].pages.main.org_account}
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => {this.setState({ name: event.target.value })
           
          }}
          />
          <TextField
            label={Lang[window.Lang].pages.main.password}
            id={"login_password" + this.state.index}
            type="password"
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ password: event.target.value })}
          />
           <TextField
            label={"验证码"}
            id={"check_code" + this.state.index}
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit, 
              width: "50%"
            }}
            onChange={event => this.setState({ check_code: event.target.value })}
            fullWidth={true}
          />
          <ListItem

/* onClick={() => {this.get_check_code(); }} */
style={{
  marginLeft: "auto",//styleManager.theme.spacing.unit,
  marginRight: "auto",//theme.spacing.unit, 
  width: "25%",
  display: "inline-block"
}}>
<img
  id={"code_img" + this.state.index}
  style={{
    height: "45px",
    position: "absolute",
    width: "80%"
  }}
  src={this.state.code_img_url}
  onClick={event => this.setState({ code_img: event.target.src = getRouter(CHECK_CODE).url + "&time=" + Math.random() })}


/>

</ListItem>
           <br/>
          {this.state.index == 0 ? 
          <a 
           style={{color:"#2196f3",fontSize:"12px",cursor:"pointer"}}
            onClick={() => {
              
              this.setState({
                findPassword: true
              })
            }}>{"短信验证码登录?"}</a> : ""}

         
          
          <Button
            raised
            color="primary"
            className={'nyx-btn-circle'}
            onClick={() => {
              this.setState({
                login_phone:""
              })
              var name = this.state.name;
              name=name.replace(/（/g,'(');  
              name=name.replace(/）/g,')');  
              name=name.replace(/ /g,''); 
              var password = this.state.password;
              var check_code = this.state.check_code;
              if (name === "") {
                this.popUpNotice(NOTICE, 0, "您没有输入账号")
                return
              } else if (password === "") {
                this.popUpNotice(NOTICE, 0, "您没有输入密码")
                return
              } else if (check_code === "") {
                this.popUpNotice(NOTICE, 0, "您没有输入验证码")
                return
              }

              this.login(name, password, check_code);
            }}
          >
            {Lang[window.Lang].pages.main.login_button}
          </Button>

        </div>

    )
  }

  OrgLoginView = () => {
    return this.LoginView();
  }

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleDrawerToggle = () => {
    if (!sessionStorage.logged || sessionStorage.logged === false) {
      return;
    }
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  handleToggleShade = () => {
    this.props.dispatch({ type: 'TOGGLE_THEME_SHADE' });
  };

  handleLogout = () => {
    this.state.logged = false;
    this.setState({ logged: sessionStorage.getItem("logged"), apptype: 0 });
  }

  logout = () => {
    sessionStorage.logged = false;
    sessionStorage.account = "";
    sessionStorage.session = "";
    sessionStorage.apptype = APP_TYPE_UNLOGIN;
    this.context.router.push("/");
    this.popUpNotice("notice", 0, "登出成功");
    this.handleLogout();
  }

  popUpNotice(type, code, content, action = [() => {
    this.setState({
      alertOpen: false,
    })
  }, () => {
    this.setState({
      alertOpen: false,
    })
  }]) {
    this.state.alertContent = content;
    this.state.alertType = type;
    this.state.alertCode = code;
    this.state.alertAction = action;
    this.setState({
      alertOpen: true,
    });
  }
  handleRequestClose = () => {
    this.setState({
        openloginNoticeDialog:false,
    })
}
  loginNoticeDialog = () => {
    return (
        <Dialog  open={this.state.openloginNoticeDialog} onRequestClose={this.handleRequestClose} >
            {/* <DialogTitle >
               <div style = {{color:"rgba(0,0,0,0.54)"}}>
               平台通知
               </div>
            </DialogTitle>
            <DialogContent>
            <ul className="nyx-login-select_list_Dialog">
              <li><span>01.</span>{Lang[window.Lang].pages.main.notice_one}
              <a style={{fontSize:"16px",color:"#4aa8ae"}} target="view_window" href="http://www.csi-s.org.cn/miitnew_webmap/miitnew_pmbzgf/2015/07/17/1778896c187945e08b3effb9fcd7bc76.html"> 查看原文</a></li>
              <li><span>02.</span>{Lang[window.Lang].pages.main.notice_two}</li>
              <li><span>03.</span>{Lang[window.Lang].pages.main.notice_three}</li>
              <li><span>04.</span>{Lang[window.Lang].pages.main.notice_four}</li>
            </ul>
            </DialogContent> */}
            <DialogTitle >
               <div style = {{color:"rgba(0,0,0,0.54)"}}>
               通知
               </div>
            </DialogTitle>
            <DialogContent>
            <ul style={{width:"880px"}} className="nyx-login-select_list_Dialog">
            <li  style={{textIndent:"36px",lineHeight:"2"}}>鉴于信息系统集成及服务行业项目管理人员的业务管理及调整的需要，项目管理人员培训报名自发布通知之日起暂停网上培训报名。</li>
            <li style={{textAlign:"right",marginTop:"3rem"}}> 2018年10月19日</li>
            </ul>
            </DialogContent>
            <DialogActions>
                <div>
                    <Button
                        onClick={() => {
                          localStorage.loginNotice="已读";
                            sessionStorage.classify=1;
                            console.log(this.context.router+"确认平台通知")
                            this.context.router.push("/com/home");
                           location.reload();
                            this.fresh();
                            this.handleRequestClose()
                        }}
                    >
                        {Lang[window.Lang].pages.main.certain_button}
                    </Button>
                    <Button
                        onClick={() => {
                            this.handleRequestClose()
                        }}
                    >
                        {Lang[window.Lang].pages.main.cancel_button}
                    </Button>
                </div>
            </DialogActions>
        </Dialog >
    )
}
  LoginTable = () => {
    return <div className={'nyx-login-bg'}>
      <div className={'nyx-login'}>
      
        <div 
        // style={{backgroundColor:"transparent",boxShadow:"none"}} 
        className={'nyx-login-window'}>
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  index={this.state.index}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="公司登录" />
                  <Tab label="公司注册" />
                 
                </Tabs>
                
              </AppBar>
              <SwipeableViews index={this.state.index} onChangeIndex={this.handleChangeIndex}>

                <TabContainer>
                  {this.LoginView()}
                </TabContainer>
                <TabContainer>
                  {this.RegisterView()}
                </TabContainer>
              </SwipeableViews>
              {/* <div style={{color:"#fff",}}>
                <p style={{fontWeight:"500",fontSize:"1.8rem"}}>通知</p>
                <p style={{fontSize:"1.2rem",textIndent:"38px",lineHeight:"2"}}>鉴于信息系统集成及服务行业项目管理人员的业务管理及调整的需要，项目管理人员培训报名自发布通知之日起暂停网上培训报名。</p>
                <p style={{fontSize:"1.2rem",textAlign:"right"}}>2018年10月19日</p>
              </div> */}
              <div style={{top:"-193px"}} className="nyx-notice-login nyx-display-none">
               
              <h3 style={{ color: "#FFFFFF" }}>联系电话</h3>
              <div className="nyx-login-window-acctention">
               中软培训：010-51527242/51527581
              </div>
              <div className="nyx-login-window-acctention">
                北京赛迪：010-88559217/88559355
              </div>
              <div className="nyx-login-window-acctention">
                广州赛宝：020-87237821/87236251
              </div>
                <div className="nyx-login-window-acctention">
                  系统维护：010-51527580
              </div>
              </div>
            </div> 
        </div>

      </div>
    </div>
  }

  render() {

    const { children, routes, width } = this.props;

    const classes = this.props.classes;
    const title = getTitle(routes);

    let drawerDocked = isWidthUp('lg', width);
    let navIconClassName = classes.icon;
    let appBarClassName = classes.appBar;

    if (title === null) {
      // home route, don't shift app bar or dock drawer
      drawerDocked = false;
      appBarClassName += ` ${classes.appBarHome}`;
    } else {
      navIconClassName += ` ${classes.navIconHide}`;
      appBarClassName += ` ${classes.appBarShift}`;
    }

    return (
      <div className="nyx">
        {sessionStorage.getItem("logged") === "true" ?
       //运维修改
         sessionStorage.classify==0?<div className="nyx-login-style">
           <div style={{height:"130px"}} className="nyx-login-select">
             <img className="nyx-login-select-log" src="../css/img/logo-02.png"/>
             <div className="nyx-login-select-title">系统集成项目管理人员学习平台</div>
           </div>
           <div className="nyx-login-select">
            {/* <ul className="nyx-login-select_list">
              <li style={{fontSize:"24px",paddingBottom:"1rem"}}>平台通知</li>
              <li><span>01.</span>{Lang[window.Lang].pages.main.notice_one}
              <a style={{fontSize:"18px",color:"#4aa8ae"}} target="view_window" href="http://www.csi-s.org.cn/miitnew_webmap/miitnew_pmbzgf/2015/07/17/1778896c187945e08b3effb9fcd7bc76.html"> 查看原文</a></li>
              <li><span>02.</span>{Lang[window.Lang].pages.main.notice_two}</li>
              <li><span>03.</span>{Lang[window.Lang].pages.main.notice_three}</li>
              <li><span>04.</span>{Lang[window.Lang].pages.main.notice_four}</li>
            </ul> */}
            <ul style={{width:"890px"}} className="nyx-login-select_list">
              <li style={{fontSize:"24px",paddingBottom:"1rem"}}>通知</li>
              <li style={{textIndent:"36px",lineHeight:"2"}}>鉴于信息系统集成及服务行业项目管理人员的业务管理及调整的需要，项目管理人员培训报名自发布通知之日起暂停网上培训报名。</li>
              <li style={{textAlign:"right",marginTop:"3rem"}}> 2018年10月19日</li>
              {/* <li><span>03.</span>{Lang[window.Lang].pages.main.notice_three}</li>
              <li><span>04.</span>{Lang[window.Lang].pages.main.notice_four}</li> */}
            </ul>
           </div>
           <div className="nyx-login-select">
           <div style={{float:"right",width:"300px",marginRight:"45px",height:"220px"}}>
           <div
         className="nyx-login-select-button"
          style={{paddingLeft:0,height:"150px"}}
          onClick={()=>{
          //  sessionStorage.classify=2;
          //   this.context.router.push("/com/home");
          //   location.reload();
          }}><span style={{lineHeight:"90px",textAlign:"center"}}>
            运维项目经理
            </span>
            <span style={{fontSize:"18px",float:"right",lineHeight:"30px",paddingLeft:"30px"}}>即将上线<div className="nyx-login-select-img"></div></span>
            
          </div>
          <div style={{float:"left",width:"290px"}}>
            <a className="nyx-instructions">常见问题与回答<i className="glyphicon glyphicon-question-sign nyx-instructions-glyphicon"></i></a>
              <a className="nyx-instructions">填报说明<i className="glyphicon glyphicon-info-sign nyx-instructions-glyphicon"></i></a>
            </div>
           </div>
           <div style={{float:"right",width:"300px",marginRight:"45px",height:"220px"}}>
           <div
           className="nyx-login-select-button"
           
           onClick={()=>{
            console.log(localStorage.loginNotice)
             if(localStorage.loginNotice==="未读"){
              this.setState({
                openloginNoticeDialog:true
               })
             }else{
              sessionStorage.classify=1;
              console.log(this.context.router)
              this.context.router.push("/com/home");
              location.reload();
              this.fresh();
             }
          //  sessionStorage.classify=1;
          //  console.log(this.context.router)
          //  this.context.router.push("/com/home");
          //  location.reload();
          // this.fresh();
          }}>
          <span style={{lineHeight:"90px",textAlign:"center"}}>
          项目经理
          </span>
          
         <span style={{fontSize:"18px",float:"right",lineHeight:"30px"}}>暂停报名 <div className="nyx-login-select-img"></div></span>
            
          </div>
           <div style={{float:"left",width:"290px"}}>
           <a href="http://www.csst.com.cn/uploadfile/doc/csi-Q&Av2.pdf" target="view_window" className="nyx-instructions">常见问题与回答<i className="glyphicon glyphicon-question-sign nyx-instructions-glyphicon"></i></a>
              <a href="http://www.csst.com.cn/uploadfile/doc/csi-01.pdf" target="view_window" className="nyx-instructions">填报说明<i className="glyphicon glyphicon-info-sign nyx-instructions-glyphicon"></i></a>
           </div>
          </div>
          <div className="nyx-login-select_v">
             版本编号:V1.202<br/>
             开发自:<br/>
             项目管理人员培训工作组<br/>
             系统维护电话:<br/>010-51527580
           </div>
           </div>
           
           <div style={{clear:"both"}}></div>
        </div>:sessionStorage.classify==1?<div className={classes.appFrame}>
       {/* //运维修改 */}
        {/* <div className={classes.appFrame}> */}
       <AppBar className={appBarClassName + ' nyx-topbar'}>
        <Toolbar>
        <IconButton
        color="contrast"
        onClick={this.handleDrawerToggle}
        className={navIconClassName}
        >
        <MenuIcon />
        </IconButton>
        {title !== null &&
        <Typography className={classes.title} type="title" color="inherit" noWrap>
        {title}
        </Typography>}
        <div className={classes.grow} />
        <h2 className="nyx-training_title" style={{ float: "right" }}>{"信息系统集成及服务项目管理人员培训报名系统"}</h2>
        <IconButton
        title="刷新数据"
        color="contrast"
        onClick={() => {
        window.currentPage.fresh();
        }}>
        <i className="glyphicon glyphicon-refresh"></i>
        </IconButton><IconButton
        title="退出登录"
        color="contrast"
        onClick={() => {

        this.logout()
        }}>
        <i className="glyphicon glyphicon-log-out"></i>
        </IconButton>
        {/* //运维修改 */}
        </Toolbar>
        </AppBar>
        <AppDrawer
        className={classes.drawer + ' nyx-sidebar'}
        docked={drawerDocked}
        routes={routes}
        onRequestClose={this.handleDrawerClose}
        open={sessionStorage.getItem("logged") === "true" ? (drawerDocked || this.state.drawerOpen) : false}
        />
        {children}
        </div>:
        <div className={classes.appFrame}>
        <AppBar className={appBarClassName + ' nyx-topbar'}>
        <Toolbar>
        <IconButton
        color="contrast"
        onClick={this.handleDrawerToggle}
        className={navIconClassName}
        >
        <MenuIcon />
        </IconButton>
        {title !== null &&
        <Typography className={classes.title} type="title" color="inherit" noWrap>
        {title}
        </Typography>}
        <div className={classes.grow} />
        <h2 className="nyx-training_title" style={{ float: "right" }}>{"运维项目管理人员培训报名系统"}</h2>
        <IconButton
        title="刷新数据"
        color="contrast"
        onClick={() => {
        window.currentPage.fresh();
        }}>
        <i className="glyphicon glyphicon-refresh"></i>
        </IconButton><IconButton
        title="退出登录"
        color="contrast"
        onClick={() => {

        this.logout()
        }}>
        <i className="glyphicon glyphicon-log-out"></i>
        </IconButton>

        </Toolbar>
        </AppBar>
        <AppDrawer
        className={classes.drawer + ' nyx-sidebar'}
        docked={drawerDocked}
        routes={routes}
        onRequestClose={this.handleDrawerClose}
        open={sessionStorage.getItem("logged") === "true" ? (drawerDocked || this.state.drawerOpen) : false}
        />
        {children}
        </div>

          : this.LoginTable()}
         
          {this.loginNoticeDialog()}
        <CommonAlert
          show={this.state.alertOpen}
          type={this.state.alertType}
          code={this.state.alertCode}
          content={this.state.alertContent}
          action={this.state.alertAction}>
        </CommonAlert>
        {this.state.beingLoading ?
          <BeingLoading /> : ''
        }
      </div>
    );
  }
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
};

export default compose(withStyles(styleSheet), withWidth(), connect())(AppFrame);
