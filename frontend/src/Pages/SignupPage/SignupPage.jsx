import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../Context/Firebase';
// Sign Up Form Import 
import SignUpForm from '../../Components/Forms/SignUpForm/SignUpForm';

const SignupPage = (props) => {
  const { setAuthPage } = useFirebase();

  useEffect(()=> {
    setAuthPage('signup');
  })
  
  return (
    <>
        <div className='md:p-10 p-4'>
            {/* SignUp Form */}
            <SignUpForm setAuth={props.setAuth} toggle={props.toggle} tick={props.false}/>
            <p className='pl-4 text-white'>
              Already have an account? <span className='text-bluebtn'><Link to="/" onClick={()=>setAuthPage('login')}> Log In</Link></span>
            </p>
        </div>
    </>
  )
}

export default SignupPage;
