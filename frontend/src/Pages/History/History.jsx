import React, { useState } from 'react'

const History = () => {
    const [filter, setFilter] = useState('annoucement');
    return (
        <>
            <div>
                <div className='flex flex-row justify-between'>
                    <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
                        History
                    </h1>
                    <div className='w-2/4 max-10 flex flex-row justify-end'>
                        {/* <button
                            className='mx-2 py-1 px-4 rounded-md bg-bluebtn text-gray-700 hover:bg-transparent hover:border-2 hover:border-bluebtn hover:text-bluebtn'
                        >
                            History
                        </button> */}
                    </div>
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
            <div className='h-[75vh] w-full overflow-scroll border-2 flex my-5'>
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
                    <hr className='m-2'/>
                    <p>A1</p>
                    <p>A2</p>
                    <p>A3</p>
                    <p>A4</p>
                </div>
                <div className='details border-2 w-3/4 p-5'>
                    <h1 className='text-center'>
                        A1
                    </h1>
                    <hr className='m-2'/>
                    <p>Title</p>
                    <p>Description</p>
                    <p>Reward</p>
                    <p>Number of Participants</p>
                </div>
            </div>
        </>
    )
}

export default History;
