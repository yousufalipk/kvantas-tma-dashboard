import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useFirebase } from '../../Context/Firebase';

//Importing LogIn & SignUp Page
import LoginPage from '../../Pages/LoginPage/LoginPage';
import SignUpPage from '../../Pages/SignupPage/SignupPage';

//NavBar
import NavBar from '../../Components/NavBar/NavBar';

//Vector Image 
import AuthImage from '../../Assets/auth-img.png';

const AuthLayout = () => {
  const { authPage } = useFirebase();

  useEffect(()=> {
    console.log("Auth Page", authPage);
  },[authPage])
  return (
    <>  
    <div className={`w-screen h-screen md:flex md:flex-row flex flex-col-reverse bg-custom-image bg-cover bg-center items-center overflow-hidden ${authPage === 'signup' && `overflow-scroll`}`}>
      {/* Left Auth */}
      <div className={`md:w-1/2 md:p-20 md:h-screen w-screen h-[60%] ${authPage === 'signup' && `h-[200%]`}`}>
        {/* Nav Bar */} 
        <div className='hidden md:flex'>
          <NavBar />
        </div>
        <div className={`py-4 ${authPage === 'signup' && `py-10`}`}>
          <Routes>
            <Route path="*" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage toggle={false} tick={false} />} />
          </Routes>
        </div>
      </div>
      {/* Right Image */}
      <div className={`md:flex justify-center items-center md:w-2/2 h-[40%] pt-5 px-5 ${authPage === 'signup' && `hidden`}`}>
        <img className='md:h-screen md:px-5 md:ml-3 h-full' src={AuthImage} alt="Vector" />
      </div>
      <div className='md:hidden'>
        <NavBar />
      </div>
    </div>
    </>
  )
}

export default AuthLayout
