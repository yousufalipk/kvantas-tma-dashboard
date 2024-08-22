import React from 'react';
import { Link } from 'react-router-dom';

// Sign Up Form Import 
import SignUpForm from '../../Components/Forms/SignUpForm/SignUpForm';

const SignupPage = (props) => {
  return (
    <>
        <div className='p-10'>
            {/* SignUp Form */}
            <SignUpForm setAuth={props.setAuth} toggle={props.toggle} />
            <p className='pl-4'>
              Already have an account? <span className='text-bluebtn'><Link to="/"> Log In</Link></span>
            </p>
        </div>
    </>
  )
}

export default SignupPage;
