import React from 'react';
import {Routes, Route} from 'react-router-dom';

import SideBar from '../../Components/SideBar/SideBar';

import HomePage from '../../Pages/HomePage/HomePage';
import ManageUsersPage from '../../Pages/ManageUsers/ManageUser';
import UpdateUserForm from '../../Components/Forms/UpdateUserFrom/UpdateUserForm';
import RegisterForm from '../../Components/Forms/SignUpForm/SignUpForm';

import UserProtected from '../../Components/Protected/UserProtected';

const AdminLayout = (props) => {
  return (
    <>  
        {/* Side Bar */}
        <div className='flex flex-row'>
          <div className='w-1/5'>
            <SideBar />
          </div> 
          {/* Content */}
          <div className='p-10 w-full'> 
          <Routes> 
            <Route path='*' element={<HomePage />}/> 

            {/* Admin Routes */}
            <Route path='/manage-users' element={<UserProtected ><ManageUsersPage /></UserProtected>}/>
            <Route path='/update-user/:userId/:fname/:lname/:email' element={<UserProtected ><UpdateUserForm /></UserProtected>}/> 
            <Route path='/add-user' element={<UserProtected ><RegisterForm toggle={true} tick={true}/></UserProtected>}/> 
          </Routes>
          </div>
        </div>
    </>
  )
}

export default AdminLayout
