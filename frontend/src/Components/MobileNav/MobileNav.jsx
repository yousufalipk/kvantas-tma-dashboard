import React from 'react';
import { useFirebase } from '../../Context/Firebase';
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogOut } from "react-icons/fi";

const MobileNav = () => {
    const { toggleSidebar, isOpen, username, userType, logoutUser } = useFirebase();

    const navigate = useNavigate();

    const handleLogOut = async () => {
        // LogOut Logic 
        try {
            await logoutUser();
            toast.success("Logged Out Succesfully!");
            navigate('/')
        } catch (error) {
            console.log(error);
            toast.error('Logging Out Failed!');
        }
    }

    return (
        <header className={`bg-custom-image md:hidden fixed top-0 ${isOpen ? 'right-0' : '-right-[100vh]'} z-10 flex flex-col items-center transition-all ease-in-out duration-1000`}>
            <div className='flex justify-end w-full'>
                <RxCross1 className='text-3xl m-3' onClick={toggleSidebar} />
            </div>
            <div className='flex flex-col justify-between h-[93vh]'>
                {/* Logo */}
                <div className='flex flex-col items-center'>
                    <Link to='/'
                        onClick={toggleSidebar} 
                    >
                        <p className='text-5xl text-white'> Kvantas</p>
                    </Link>

                    {/* Menu*/}
                    <div className='flex flex-col mt-2 w-screen'>
                        <div className='w-1/2 mx-auto text-center'>
                            Welcome Back!
                            <p className='text-bluebtn mb-8'>{username}</p>
                        </div>
                        <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/' onClick={toggleSidebar}>Dashboard</Link>
                        <hr className='border-1 border-[gray] w-4/5 mx-auto' />

                        {userType === 'admin' ? (
                            <>
                                <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/manage-users' onClick={toggleSidebar}  >Manage Users</Link>
                                <hr className='border-1 border-[gray] w-4/5 mx-auto' />
                                <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/manage-telegram-users' onClick={toggleSidebar}  >Telegram Users</Link>
                                <hr className='border-1 border-[gray] w-4/5 mx-auto' />
                                <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/social-tasks' onClick={toggleSidebar}  >Social Tasks</Link>
                                <hr className='border-1 border-[gray] w-4/5 mx-auto' />
                                <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/daily-tasks' onClick={toggleSidebar}  >Daily Tasks</Link>
                                <hr className='border-1 border-[gray] w-4/5 mx-auto' />
                                <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/annoucements' onClick={toggleSidebar}  >Annoucements</Link>
                                <hr className='border-1 border-[gray] w-4/5 mx-auto' />
                                <Link className='w-full py-5 px-10 hover:text-bluebtn' to='/history' onClick={toggleSidebar}  >History</Link>
                            </>
                        ) : (
                            <>

                            </>
                        )}
                        <hr className='border-1 border-[gray] w-4/5 mx-auto' />
                    </div>
                </div>

                {/* Logout button*/}
                <div className='w-full'>
                    <button className='flex flex-row px-10 py-8 w-full hover:text-bluebtn' onClick={handleLogOut}>
                        Log Out <FiLogOut className='mx-3 mt-1' />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default MobileNav;
