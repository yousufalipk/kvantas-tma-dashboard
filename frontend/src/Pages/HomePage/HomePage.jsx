import React from 'react';
import { useFirebase } from '../../Context/Firebase';

const HomePage = () => {
  const { userType } = useFirebase();
  return (
    <> 
        <div> 
            <h1 className='font-bold mx-10'>
              {userType === 'admin' ? (
                <>
                  Admin Dashbaord 
                </>
              ):(
                <>
                  User Dashbaord
                </>
              )}

            </h1>
            <hr className='my-5 border-1 border-[black] mx-2'/> 
        </div>
    </>
  )
}

export default HomePage;
