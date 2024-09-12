import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../Context/Firebase';

const AdminHome = () => {
    const { metrics } = useFirebase();

    return (
        <>
            {metrics ? (
                <>
                    <div>
                        Admin Dashboard
                        <hr className='my-5 border-1 border-white md:mx-2' />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:gap-2 gap-2">
                        {/* Total Users */}
                        <div className='flex gap-2 md:gap-2 md:justify-evenly'>
                            <div
                                className="flex flex-col gap-2 md:h-40 h-30 text-white rounded-xl shadow-md md:p-6 p-3 md:max-w-[240px] w-1/2 bg-blue-900 bg-opacity-30 backdrop-filter backdrop-blur-lg">
                                <div className="font-semibold md:text-lg text-sm">Total Users</div>
                                <div className="font-thin text-md tracking-tight">{metrics.totalUsers}</div>
                            </div>
                            {/* User Type */}
                            <div
                                className="flex flex-col gap-2 md:h-40 h-30 text-white rounded-xl shadow-md md:p-6 p-3 md:max-w-[240px] w-1/2 bg-blue-900 bg-opacity-30 backdrop-filter backdrop-blur-lg">
                                <div className="font-semibold md:text-lg text-sm">User Type</div>
                                <div className="font-thin text-md tracking-tight">Users {metrics.userTypes.user}</div>
                                <div className="font-thin text-md tracking-tight">Admins {metrics.userTypes.admin}</div>
                            </div>
                        </div>
                        {/* Telegram Users */}
                        <div className='flex gap-2 md:gap-2 md:justify-evenly'>
                            <div
                                className="flex flex-col gap-2 md:h-40 h-30 text-white rounded-xl shadow-md md:p-6 p-3 md:max-w-[240px] w-1/2 bg-blue-900 bg-opacity-30 backdrop-filter backdrop-blur-lg">
                                <div className="font-semibold md:text-lg text-sm">Telegram Users</div>
                                <div className="font-thin text-md tracking-tight">{metrics.totalTelegramUsers}</div>
                            </div>
                            {/* Active Announcements */}
                            <div
                                className="flex flex-col gap-2 md:h-40 h-30 text-white rounded-xl shadow-md md:p-6 p-3 md:max-w-[240px] w-1/2 bg-blue-900 bg-opacity-30 backdrop-filter backdrop-blur-lg">
                                <div className="font-semibold md:text-lg text-sm">Active Announcements</div>
                                <div className="font-thin text-md tracking-tight">{metrics.activeAnnouncements}</div>
                            </div>
                        </div>
                    </div>

                    {/* Task By Type Card */}
                    <div className="md:mt-7 mt-2 flex flex-col gap-4 text-white rounded-xl shadow-md p-6 bg-blue-900 bg-opacity-30 backdrop-filter backdrop-blur-lg md:mx-6">
                        <div className="font-semibold md:text-lg text-sm">Task By Type</div>
                        <div className="flex flex-row justify-between">
                            {/* Tasks C1 */}
                            <div className="flex-1 text-center">
                                <div className="font-thin text-md tracking-tight m-2">Instagram <p>{metrics.tasksByType.instagram || 0}</p></div>
                                <div className="font-thin text-md tracking-tight m-2">Youtube <p>{metrics.tasksByType.youtube || 0}</p></div>
                            </div>
                            {/* Tasks C2 */}
                            <div className="flex-1 text-center">
                                <div className="font-thin text-md tracking-tight m-2">Website <p>{metrics.tasksByType.moreLink || 0}</p></div>
                                <div className="font-thin text-md tracking-tight m-2">Twitter <p>{metrics.tasksByType.twitter || 0}</p></div>
                            </div>
                            {/* Tasks C3 */}
                            <div className="flex-1 text-center">
                                <div className="font-thin text-md tracking-tight m-2">Telegram {metrics.tasksByType.telegram || 0}</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex justify-center items-center py-64 font-semibold italic text-2xl'> Loading...</div>
                </>
            )}
        </>
    );
};

export default AdminHome;
