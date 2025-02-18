import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { Link } from 'react-router-dom';

import SideBar from '../../Components/SideBar/SideBar';
import MobileNav from '../../Components/MobileNav/MobileNav';

import HomePage from '../../Pages/HomePage/HomePage';


//Manage Users
import ManageUsersPage from '../../Pages/ManageUsers/ManageUser';
import UpdateUserForm from '../../Components/Forms/UpdateUserFrom/UpdateUserForm';
import RegisterForm from '../../Components/Forms/SignUpForm/SignUpForm';

//Manage Social Tasks
import SocialTaskPage from '../../Pages/SocialTask/SocialTask';
import SocialTaskFrom from '../../Components/Forms/SocialTaskForm/SocialTaskForm';

//Manage Social Tasks
import DailyTaskPage from '../../Pages/DailyTask/DailyTask';
import DailyTaskFrom from '../../Components/Forms/DailyTaskForm/DailyTaskFrom';

//Telegram Users
import ManageTelegramUsers from '../../Pages/ManageTelegramUsers/ManageTelegramUsers';

//Anoucements
import Annoucement from '../../Pages/Annoucements/Annoucement';
import AnnoucementForm from '../../Components/Forms/AnnoucementForm/AnnoucementForm';

//History
import History from '../../Pages/History/History';

import UserProtected from '../../Components/Protected/UserProtected';

import { useFirebase } from '../../Context/Firebase';

const AdminLayout = () => {
  const { toggleSidebar } = useFirebase();

  return (
    <>
      <div className='w-screen h-screen md:flex md:flex-row bg-custom-image bg-cover bg-center items-center overflow-hidden'>
        {/* Open Side bar */}
        <div className='md:hidden w-screen p-2 flex justify-between mb-3'>
          <h1 className='italic text-2xl mx-5'><Link to='/'>Kvantas</Link></h1>
          <IoMenu className='text-4xl md:hidden mr-2' onClick={toggleSidebar} />
        </div>

        <div className='flex flex-row w-screen'>

          <div className='w-1/5 md:flex hidden'>
            <SideBar />
          </div>
          <div className='md:hidden'>
            <MobileNav />
          </div>

          <div className='md:p-10 p-2 w-screen h-[100vh] overflow-y-scroll scrollbar-hide'>
            <Routes>
              <Route path='*' element={<HomePage />} />
              {/* Admin Routes */}

              {/* Manage User Routes  */}
              <Route path='/manage-users' element={<UserProtected ><ManageUsersPage /></UserProtected>} />
              <Route path='/update-user/:userId/:fname/:lname/:email' element={<UserProtected ><UpdateUserForm /></UserProtected>} />
              <Route path='/add-user' element={<UserProtected ><RegisterForm toggle={true} tick={true} /></UserProtected>} />

              {/* Manage Social Tasks */}
              <Route path='/social-tasks' element={<UserProtected ><SocialTaskPage /></UserProtected>} />
              <Route path='/social-tasks-form' element={<UserProtected ><SocialTaskFrom /></UserProtected>} />
              <Route path='/social-tasks-form-update' element={<UserProtected ><SocialTaskFrom /></UserProtected>} />

              {/* Manage Daily Tasks */}
              <Route path='/daily-tasks' element={<UserProtected ><DailyTaskPage /></UserProtected>} />
              <Route path='/daily-tasks-form' element={<UserProtected ><DailyTaskFrom /></UserProtected>} />
              <Route path='/daily-tasks-form-update' element={<UserProtected ><DailyTaskFrom /></UserProtected>} />

              {/* Manage User Routes  */}
              <Route path='/manage-telegram-users' element={<UserProtected ><ManageTelegramUsers /></UserProtected>} />

              {/* Annoucements */}
              <Route path='/annoucements' element={<UserProtected ><Annoucement /></UserProtected>} />
              <Route path='/annoucement-form' element={<UserProtected ><AnnoucementForm /></UserProtected>} />
              <Route path='/annoucement-form-update' element={<UserProtected ><AnnoucementForm /></UserProtected>} />

              {/* History */}
              <Route path='/history' element={<UserProtected ><History /></UserProtected>} />

            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLayout;
