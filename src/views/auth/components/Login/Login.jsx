import React, { useEffect, useState } from "react";
import "../assets/css/index.css";
import { message, notification } from "antd";
import { authenticate } from "../../../../_services";
import { useDispatch } from "react-redux";
import { userService } from "../../../../_services";
import "./login.css";
import {
  setRefreshToken,
  setAccessToken,
} from "../../../../_helpers/globalVariables";
import LoginPic from './passpic.png';
import Logo from './logo13.png';
import Username from './username.png';
import Password from './password.png';
import Mail from './mail.png';
import TextField from '@mui/material/TextField';


const Login = () => {
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginTrial, setLoginTrial] = useState(false);
  const [resetPassword, setCreatePassword] = useState(null);
  const dispatch = useDispatch();

  const handleResetPass = (e) => {
    e.preventDefault();
    setCreatePassword(true);
  };

  const onCancel = (params) => {
    // history.push("/");
  };

  const toLogin = (e) => {
    e.preventDefault();
    setCreatePassword(false);
  };

  const login = (e) => {
    e.preventDefault();
    setLoginTrial(true);
    if (!username) return message.warn("Please input username");
    if (!password) return message.warn("Please input password");
    setLoading(true);
      
      userService
        .authenticate(username, password)
        .then(
          (response) => {
            const { access_token, refresh_token } = response.data;
            if (access_token) {
              // const currentUser = {
              //   user: username,
              //   token: access_token,
              //   refresh_token,
              //   picture: `/assets/img/avatars/sunny.png`,
              // };

              message.success(
                `Welcome ${username} you have logged in successfully!`
              );
              setAccessToken(access_token, true);
              setRefreshToken(refresh_token);
              setLoading(false);
            } else {
              message.error(`Error Occurred while login, please try again!`);
              setLoading(false);
            }
          },
          (error) => {
            let message = "User Deactivated or Does Not Exist";
            if (error) {
              setLoading(false);
              message = error?.response?.data;
            }

            notification.error({
              message: `Authentication Error`,
              description: `${message.error_description}`,
            });

            dispatch(failure(error));
            setLoading(false);
          }
        );
  };
  const resetPass = (e) => {
    e.preventDefault();
    if (email) {
      let params = {
        email: email,
      };
      setLoading(true);
      userService
        .reset_password(params)
        .then(() => {
          setLoading(false);
          message.success(
            "Your password has beeen reset successfully. Please check your email"
          );
          setCreatePassword(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      message.warning("Please input your email!");
    }
  };
  return (
    <div className='LoginPageContainer'>
      <div className='LoginPageInnerContainer'>
        <div className='ImageContianer'>
          <img src={LoginPic} className='GroupImage' alt='#' />
        </div>
        <div className='LoginFormContainer'>
          <div className='LoginFormInnerContainer'>
            <div className='LogoContainer'>
              <img src={Logo} className='logo' alt='#' />
              <header className='header'>Streamline HR. Simplify Success.</header>
            </div>
            <header className='header'>
              {resetPassword ? 'Reset Password' : ''}
            </header>
            {resetPassword ? (
              <header className='subHeader'>
                Forgot your <b>Smart Hr-System!</b> Please Enter your email
              </header>
            ) : (
              <header className='subHeader'>
                {/* Welcome to <b>Smart Hr-System!</b> Please Enter your Details */}
                {/* Login */}
              </header>
            )}

            <form>
              {!resetPassword ? (
                <>
                  <div className='inputContainer'>
                     <TextField style={{ width: '370px' }} size="small" label="username"  variant="outlined"onChange={(e) => setUserName(e.target.value)} />
                  </div>
                  <div className='inputContainer'>
             <TextField style={{ width: '370px' }} size="small" type="password" label="password"  variant="outlined" onChange={(e) => setPassword(e.target.value)} />

                  </div>
                </>
              ) : (
                <div className='inputContainer'>
               <TextField style={{ width: '370px' }} size="small" type="email" label="Email"  variant="outlined" onChange={(e) => setEmail(e.target.value)}/>

                </div>
              )}
              {!resetPassword ? (
                <div className='OptionsContainer'>
                  <a
                    href='/hr-payroll'
                    className='ForgotPasswordLink'
                    onClick={(e) => handleResetPass(e)}
                  >
                    Forgot Password?
                  </a>
                </div>
              ) : null}

              {resetPassword ? (
                <>
                  <button className='LoginButton' onClick={resetPass}>
                    Reset Password
                  </button>
                  <button
                    className='LoginButton1'
                    onClick={() => setResetPassword(false)}
                  >
                    Back to Login
                  </button>
                </>
              ) : (
                <button className='LoginButton' onClick={login}>
                  Login
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
