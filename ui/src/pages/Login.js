import Page from "./Page";
import { Button, TextField } from '@mui/material';
import { css } from '@emotion/css';
import { errorToast } from '../toast';
import swal from 'sweetalert';




const divLoginStyle = css({ 
   maxWidth: 400, 
   minWidth: 200,
   margin: 10,
   '& > *': {
      margin: '10px auto'
   },
   '& a': {
      display: 'inline-block',
      marginLeft: 5,
      textDecoration: 'none',
   }
});

class Login extends Page {


  

   login = async () => {

      // check
      const txtEmail = document.getElementById('txt-email');
      const txtPassword = document.getElementById('txt-password');

      const email = txtEmail.value;
      const password = txtPassword.value;

      if (!email) {
         errorToast('Email is required');
         return txtEmail.focus();
      }

      if (!password) {
         errorToast('Password is required');
         return txtPassword.focus();
      }

     
      if (email.toLowerCase() === 'claudene@gmail.com' && password === 'admin2023') {
         window.App.authenticated = true;
         window.App.redirect('/dashboard');
      } else {
         swal('Invalid credentials');
      }

      
   }

   _render() {
      
      return <div className="fill-container vh-align">
         <div className={divLoginStyle}>
            <h2 className="halign">Login</h2>

            <TextField
               fullWidth
               label="Email"
               id="txt-email"
               variant="standard"
               size="small"
            />

            <TextField
               fullWidth
               label="Password"
               id="txt-password"
               variant="standard"
               size="small"
               type="password"
            />

            <div style={{
               display: 'grid',
               gridTemplateColumns: '1fr',
               columnGap: 20
            }}>
               <div>
                  <Button fullWidth variant="contained" onClick={this.login}>
                     LOGIN
                  </Button>
               </div>

            </div>
         </div>
      </div>
   }
}

export default Login;