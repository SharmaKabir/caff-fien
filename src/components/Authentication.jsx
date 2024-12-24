import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Authentication(props) {
  const {handleCloseModal} = props;
  const [isRegistration, setIsRegisteration] = useState(false); //FOR SIGNING IN OR SIGNING OUT!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false); //bool state, use is
  const [error, setError] = useState(null);
  const { signup, login}= useAuth();

  async function handleAuthenticate() {
      if(!email || !email.includes('@') || !password || password.length<6 || isAuthenticating){ //guard clause
        return;
      }
      try {
        setIsAuthenticating(true);
        setError(null);
        if(isRegistration){
          await signup(email,  password );
        }else{
          await login(email, password);
        }
        console.log("Login successful, closing modal");
        handleCloseModal();
      } 
      catch (error) {
        setError(error.message);
        console.error(error);
      }
      finally{
        setIsAuthenticating(false);
      }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistration ?'Sign Up' : 'Login'}</h2>
      <p>{isRegistration ? 'Create an account!':'Sign in to your account!'}</p>
      {error && <p >❌ oops! {error}</p>}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Email"
        type="email"
      />
      <input value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }} placeholder="Password" type="password" />
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ?  "Authenticating... Please wait!" :"Submit"}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>{ isRegistration ?'Already have an account?' :'Don\'t have an account?'}</p>
        <button onClick={() => {
          setIsRegisteration(!isRegistration);
        }}>
          <p>{isRegistration ? 'Sign in' :"Sign up "}</p>
        </button>
      </div>
    </>
  );
}
