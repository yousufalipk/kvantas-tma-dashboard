import React, { useEffect, useState } from 'react';
import { useFirebase } from '../../Context/Firebase';

const History = () => {
    const [data, setData] = useState();

    const [filter, setFilter] = useState('annoucement');

    const [activeId, setActiveId] = useState(null);

    const [active, setActive] = useState(null);

    const { fetchAnnoucementHistory, annoucementHistory, fetchSocialTaskHistory, socialTaskHistory, fetchDailyTaskHistory, dailyTaskHistory } = useFirebase();

    useEffect(() => {
        if (filter === 'annoucement') {
            fetchAnnoucementHistory();
        } else if (filter === 'social') {
            fetchSocialTaskHistory();
        } else if (filter === 'daily') {
            fetchDailyTaskHistory();
        }
    }, [filter]);

    // Update data when the history data changes
    useEffect(() => {
        if (filter === 'annoucement') {
            setData(annoucementHistory);
            if (annoucementHistory) {
                setActiveId(annoucementHistory[0].id);
                setActive(annoucementHistory[0]);
            }
        } else if (filter === 'social') {
            setData(socialTaskHistory);
            if (socialTaskHistory) {
                setActiveId(socialTaskHistory[0].id);
                setActive(socialTaskHistory[0]);
            }
        } else if (filter === 'daily') {
            setData(dailyTaskHistory);

            if (dailyTaskHistory?.length > 0) {
                setActiveId(dailyTaskHistory[0].id);
                setActive(dailyTaskHistory[0]);
            }
        } else {
            setActive(null);
            setActiveId(null);
        }
    }, [filter, annoucementHistory, socialTaskHistory, dailyTaskHistory]);

    const handleClick = (data) => {
        setActiveId(data.id);
        setActive(data);
    }

    return (
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
                    onClick={() => {
                        setFilter('annoucement');
                        setActive(null);
                    }}
                >
                    Annoucements
                </button>
                <button
                    className={`p-2 border-2 rounded-xl hover:text-sm ${filter === 'social' && `bg-bluebtn text-gray-900 border-none`}`}
                    onClick={() => {
                        setFilter('social');
                        setActive(null);
                    }}
                >
                    Social Tasks
                </button>
                <button
                    className={`p-2 border-2 rounded-xl hover:text-sm ${filter === 'daily' && `bg-bluebtn text-gray-900 border-none`}`}
                    onClick={() => {
                        setFilter('daily');
                        setActive(null);
                    }}
                >
                    Daily Tasks
                </button>
            </div>
            {/* Box */}
            <div className='md:h-[75vh] md:w-[170vh] md:overflow-hidden border-2 flex my-5 overflow-scroll'>
                {/* Sidebar list */}
                <div className='list md:w-[42.5vh] p-5 border-r-2'>
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
                    {data?.map((data, index) => {
                        return (
                            <div
                                key={data.id}
                                onClick={() => { handleClick(data) }}
                                className={`hover:italic hover:text-md hover:text-bluebtn hover:cursor-pointer flex border-2 my-2 rounded-lg ${data.id === activeId ? 'text-bluebtn' : ''}`}
                            >
                                <h1 className='text-center w-1/5'>{index + 1}</h1>
                                <p className='text-center w-4/5'>{data.title}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Details section */}
                <div className='details w-full md:w-3/4 p-5'>
                    {active && (
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-center font-bold text-xl'>
                                {active.title}
                            </h1>
                            <hr className='m-2' />
                            <p><span className='font-bold underline mr-2'>{filter !== 'annoucement' ? (<>Link: </>) : (<>Description:</>)}</span>{filter !== 'annoucement' ? (<>{active.link}</>) : (<>{active.description}</>)}</p>
                            <p><span className='font-bold underline mr-2'>Reward: </span>{active.reward}</p>

                            {active.users?.length > 0 ? (
                                <>
                                    <h1 className='text-xl font-semibold text-center'>List of Participants <span>({active.users.length})</span></h1>
                                    <table className="min-w-full table-auto border-collapse m-2">
                                        <thead>
                                            <tr className="text-white border-b">
                                                <th className="px-6 py-3 text-left text-sm font-medium">Sr.NO</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium">Username</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium">First Name</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium">Last Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {active.users?.map((user, index) => (
                                                <tr key={user.id} className="border-b last:border-none">
                                                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm">{user.id}</td>
                                                    <td className="px-6 py-4 text-sm">{user.username || "not available"}</td>
                                                    <td className="px-6 py-4 text-sm">{user.first_name || "not available"}</td>
                                                    <td className="px-6 py-4 text-sm">{user.last_name || "not available"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <div className='mt-40 italic text-xl flex justify-center items-center'>
                                    <h1>No users found...</h1>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default History;
