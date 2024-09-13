import React, { useEffect, useState } from 'react';
import { useFirebase } from '../../Context/Firebase';

const History = () => {
    const [data, setData] = useState();

    const [filter, setFilter] = useState('annoucement');

    const [activeId, setActiveId] = useState(null);

    const [activeAnnoucement, setActiveAnnoucement] = useState(null);

    const { fetchAnnoucementHistory, annoucementHistory, fetchSocialTaskHistory, socialTaskHistory, fetchDailyTaskHistory, dailyTaskHistory } = useFirebase();

    useEffect(() => {
        if (filter === 'annoucement') {
            fetchAnnoucementHistory();
            setData(annoucementHistory);
        }
        else if (filter === 'social') {
            fetchSocialTaskHistory();
            setData(socialTaskHistory);
        }
        else if (filter === 'daily') {
            fetchDailyTaskHistory();
            setData(dailyTaskHistory);
        }
    }, [filter])

    const handleClick = (data) => {
        setActiveId(data.id);
        setActiveAnnoucement(data);
    }

    return (
        <>
            {data && (
                <>
                    <div>
                        <div className='flex flex-row justify-between'>
                            <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
                                History
                            </h1>
                        </div>
                        <hr className='my-5 border-1 border-[white] mx-2' />
                    </div>
                    <div className='flex gap-3'>
                        <button
                            className={`p-2 border-2 rounded-xl hover:text-sm ${filter === 'annoucement' && `bg-bluebtn text-gray-900 border-none`}`}
                            onClick={() => setFilter('annoucement')}
                        >
                            Annoucements
                        </button>
                        <button
                            className={`p-2 border-2 rounded-xl hover:text-sm ${filter === 'social' && `bg-bluebtn text-gray-900 border-none`}`}
                            onClick={() => setFilter('social')}
                        >
                            Social Tasks
                        </button>
                        <button
                            className={`p-2 border-2 rounded-xl hover:text-sm ${filter === 'daily' && `bg-bluebtn text-gray-900 border-none`}`}
                            onClick={() => setFilter('daily')}
                        >
                            Daily Tasks
                        </button>
                    </div>
                    <div className='h-[75vh] w-full overflow-hidden border-2 flex my-5'>
                        <div className='list border-2 w-1/4 p-5'>
                            <h1 className='text-center'>
                                List of{' '}
                                <span>
                                    {filter === 'annoucement'
                                        ? 'Announcements'
                                        : filter === 'social'
                                            ? 'Social Tasks'
                                            : 'Daily Tasks'}
                                </span>
                            </h1>
                            <hr className='m-2' />
                            {annoucementHistory?.map((data, index) => {
                                return (
                                    <>
                                        <div
                                            onClick={() => { handleClick(data) }}
                                            className={`hover:italic hover:text-md hover:text-bluebtn hover:cursor-pointer flex border-2 my-2 rounded-lg ${data.id === activeId ? 'text-bluebtn' : ''}`}
                                        >
                                            <h1 className='text-center w-1/5'>{index + 1}</h1>
                                            <p className='text-center w-4/5'>{data.title}</p>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                        <div className='details border-2 w-3/4 p-5'>
                            {activeAnnoucement && (
                                <>
                                    <div className='flex flex-col gap-2'>
                                        <h1 className='text-center font-bold text-xl'>
                                            {activeAnnoucement.title}
                                        </h1>
                                        <hr className='m-2' />
                                        <p><span className='font-bold underline mr-2'>Description: </span>{activeAnnoucement.description}</p>
                                        <p><span className='font-bold underline mr-2'>Reward: </span>{activeAnnoucement.reward}</p>
                                    </div>
                                    <div>
                                        {activeAnnoucement.users?.length > 0 ? (
                                            <>
                                                <h1 className='text-xl font-semibold text-center'>List of Users <span>({activeAnnoucement.users.length})</span></h1>
                                                <table class="min-w-full table-auto border-collapse overflow-y-scroll m-2">
                                                    <thead>
                                                        <tr class="text-white border-b">
                                                            <th class="px-6 py-3 text-left text-sm font-medium">Sr.NO</th>
                                                            <th class="px-6 py-3 text-left text-sm font-medium">ID</th>
                                                            <th class="px-6 py-3 text-left text-sm font-medium">Username</th>
                                                            <th class="px-6 py-3 text-left text-sm font-medium">First Name</th>
                                                            <th class="px-6 py-3 text-left text-sm font-medium">Last Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activeAnnoucement.users?.map((user, index) => (
                                                            <tr class="border-b last:border-none">
                                                                <td class="px-6 py-4 text-sm">{index + 1}</td>
                                                                <td class="px-6 py-4 text-sm">{user.id}</td>
                                                                <td class="px-6 py-4 text-sm">{user.username || "not avaliable"}</td>
                                                                <td class="px-6 py-4 text-sm">{user.first_name || "not avaliable"}</td>
                                                                <td class="px-6 py-4 text-sm">{user.last_name || "not avaliable"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : (
                                            <>
                                                <div className='mt-40 italic text-xl flex justify-center items-center'>
                                                    <h1>No users found...</h1>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default History;
