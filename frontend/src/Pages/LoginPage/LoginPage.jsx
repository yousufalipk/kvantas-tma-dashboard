import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../Context/Firebase';

// Login Form Import
import LoginForm from '../../Components/Forms/LoginForm/LoginForm';

const LoginPage = () => {
  const { setAuthPage } = useFirebase();

  useEffect(()=> {
    setAuthPage('login');
  })

  return (
    <>
        <div className='md:p-10 p-5 h-full'>
            {/* Login Form  */}
            <LoginForm />
            <p className='text-bluebtn pl-4'>
              <Link to="/register" onClick={()=>setAuthPage('signup')}> Create an account</Link>
            </p>
        </div>
    </>
  )
}

export default LoginPage;
