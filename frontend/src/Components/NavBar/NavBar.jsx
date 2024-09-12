import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <>
        <div>
          <Link to='/'>
            <p className='md:mt-8 md:mx-5 md:px-7 md:text-5xl text-white flex justify-start text-2xl p-6 italic w-screen'>Kvants AI</p>
          </Link>
        </div>
    </>
  )
}

export default NavBar;
