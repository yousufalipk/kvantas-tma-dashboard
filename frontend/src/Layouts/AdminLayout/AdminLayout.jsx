import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";

import SideBar from '../../Components/SideBar/SideBar';
import NavBar from '../../Components/NavBar/NavBar';
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

import UserProtected from '../../Components/Protected/UserProtected';

import { useFirebase } from '../../Context/Firebase';

const AdminLayout = () => {
  const { toggleSidebar } = useFirebase();

  return (
    <>
      <div className='w-screen h-screen md:flex md:flex-row bg-custom-image bg-cover bg-center items-center'>
        {/* Open Side bar */}
        <div className='md:hidden w-screen p-2 flex justify-end'>
          <IoMenu className='text-4xl md:hidden mr-2' onClick={toggleSidebar} />
        </div>

        <div className='flex flex-row'>
          
          <div className='w-1/5 md:flex hidden'>
            <SideBar />
          </div>

          <div className='md:hidden'>
            <MobileNav />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLayout;
