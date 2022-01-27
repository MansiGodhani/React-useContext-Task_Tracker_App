import React from 'react';
import { useContext } from "react";
import Context from "./Context";

const Login = () => {
    const login1 = useContext(Context);
    console.log(login1.status1);
    return (
        <div align="center">
            <h2>Your Login Status :</h2>
            {login1.status1 ? 
                <p>Logged in.</p> : <p>Not login At.</p>
            }
            <button className='btn' style={{ backgroundColor: 'green' }} onClick={login1.login}>Click To Login</button>
        </div>
    )
}

export default Login