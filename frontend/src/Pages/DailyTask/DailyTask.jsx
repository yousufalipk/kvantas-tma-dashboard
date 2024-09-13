import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../Context/Firebase';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import ViewMore from '../../Components/ViewMoreModal/ViewMore';

import { RiDeleteBin5Line } from "react-icons/ri";

const DailyTask = () => {
    const navigate = useNavigate();
    const { dailyTasks, fetchDailyTask, deleteDailyTask, setSendData, isModalOpen, setModalOpen } = useFirebase();

    const [viewText, setViewText] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            await fetchDailyTask();
            console.log("Tasks", dailyTasks);
        } catch (error) {
            console.log('Error', error);
        }
    }


    useEffect(() => {
        fetchData();
    }, [])


    const handleCreateTask = async () => {
        try {
            const dailyTaskData = {
                tick: true
            }
            setSendData(dailyTaskData);
            //Navigate to Create form
            navigate(`/daily-tasks-form`)

        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error")
        }
    }

    const handleUpdateTask = async (uid, type, priority, title, link, reward) => {
        try {
            const dailyTaskData = {
                tick: false,
                uid: uid,
                type: type,
                priority: priority,
                title: title,
                link: link,
                reward: reward
            }
            setSendData(dailyTaskData);
            //navigate to update user
            navigate(`/daily-tasks-form-update`);
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error")
        }
    }

    const handleDeleteTask = async (uid, title) => {
        try {
            const shouldDelete = window.confirm(`Are you sure you want remove ${title}?`);
            if (!shouldDelete) {
                return
            }
            else {
                try {
                    const response = deleteDailyTask(uid);
                    if (response.data.success) {
                        setTimeout(() => {
                            toast.success("Task Deleted Succesfuly!")
                        }, 1000)
                    }
                    else {
                        setTimeout(() => {
                            toast.error("Error Deleting Task!")
                        }, 1000)
                    }
                } catch (error) {
                    toast.error("Internal Server Error!")
                }
            }

        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error")
        }
    }

    // Pagination Logic
    const totalPages = Math.ceil(dailyTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = dailyTasks.slice(startIndex, endIndex);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleModalOpen = (text) => {
        setViewText(text);
        setModalOpen(true);
        console.log("Openning model", isModalOpen);
    }

    return (
        <>
            {isModalOpen && (
                <ViewMore text={viewText} />
            )}
            <div>
                <div className='flex flex-row justify-between'>
                    <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
                        Daily Task
                    </h1>
                    <div className='w-2/4 max-10 flex flex-row justify-end'>
                        <button
                            className='mx-2 py-1 px-4 rounded-md bg-bluebtn text-gray-700 hover:bg-transparent hover:border-2 hover:border-bluebtn hover:text-bluebtn'
                            onClick={handleCreateTask}
                        >
                            Add Task
                        </button>
                    </div>
                </div>
                <hr className='my-5 border-1 border-[white] mx-2' />
            </div>
            <div className='mx-2 my-10'>
                <table className="bg-transparent border-collapse border border-gray-200 w-full table-fixed">
                    <thead className="thead-dark">
                        <tr>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Priority</th>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Type</th>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Title</th>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Link</th>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Reward</th>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Update</th>
                            <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentTasks
                                .sort((a, b) => a.priority - b.priority)
                                .map((cls, key) => (
                                    <tr key={key}>
                                        <th scope="row" className='border-b border-gray-200'>
                                            <span style={{ fontWeight: "bold" }}>
                                                {cls.priority}
                                            </span>
                                        </th>
                                        <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            {cls.image}
                                        </td>
                                        <td 
                                            className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:cursor-pointer hover:text-bluebtn' 
                                            onClick={()=>handleModalOpen(cls.title)} 
                                            style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                        >
                                            {cls.title}
                                        </td>
                                        <td
                                            className='px-6 py-4 border-b border-gray-200 text-sm text-center cursor-pointer hover:text-bluebtn'
                                            onClick={()=>handleModalOpen(cls.link)} 
                                            style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                        >
                                            {cls.link}
                                        </td>
                                        <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            {cls.reward}
                                        </td>
                                        <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            <button
                                                className="p-2 rounded-md bg-bluebtn text-gray-700 hover:bg-transparent hover:border-2 hover:border-bluebtn hover:text-bluebtn"
                                                onClick={() => handleUpdateTask(cls.id, cls.image, cls.priority, cls.title, cls.link, cls.reward)}
                                                style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                                            <button
                                                className="p-2"
                                                onClick={() => handleDeleteTask(cls.id, cls.title)}
                                                style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                            >
                                                <RiDeleteBin5Line className="text-bluebtn w-5 h-5 hover:text-gray-700" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
                <div className='flex mt-5'>
                    <div className='my-5 w-1/2'>
                        {/* Buttons */}
                        <Stack spacing={2} className='text-white'>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                shape="rounded"
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'white',
                                    },
                                    '& .MuiPaginationItem-root.Mui-selected': {
                                        backgroundColor: '#1E40AF',
                                        color: 'white',
                                    },
                                    '& .MuiPaginationItem-root:hover': {
                                        backgroundColor: '#fff !important',
                                        color: '#000 !important',
                                    },
                                }}
                            />
                        </Stack>
                    </div>
                    <div className='my-5 w-1/2 text-white text-end'>
                        {/* Page of Pages  */}
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DailyTask;