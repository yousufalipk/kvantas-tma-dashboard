import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../Context/Firebase';

import { RiDeleteBin5Line } from "react-icons/ri";

const SocialTask = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, deleteTask} = useFirebase();

  const fetchData = async () => {
    try {
      await fetchTasks();
    } catch (error) {
      console.log('Error', error);
    } 
  }


  useEffect(() => {
    fetchData();
  }, [])


  const handleCreateTask = async () => {
    try {
      //Navigate to Create form
      navigate(`/social-tasks-form/${true}`)
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error")
    }
  }

  const handleUpdateTask = async (uid, type, title, link, reward) => {
    try {
      //navigate to update user
      navigate(`/social-tasks-form-update/${false}/${uid}/${type}/${title}/${link}/${reward}`);
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
      else{
        try {
          const response = deleteTask(uid);
          if(response.data.success){
            toast.success("Task Deleted Succesfuly!")
          }
          else{
            toast.error("Error Deleting Succesfuly!")
          }
        } catch(error) {
          toast.error("Internal Server Error!")
        }
      }

    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error")
    }
  }

  return (
    <>
      <div>
        <div className='flex flex-row justify-between'>
          <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
            Social Task
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
        <table className="min-w-full bg-transparent border-collapse border border-gray-200">
          <thead className="thead-dark">
            <tr>
              <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Sr.No</th>
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
              tasks.map((cls, key) => (
                <tr key={key}>
                  <th scope="row" className='border-b border-gray-200'>
                    <span style={{ fontWeight: "bold" }}>
                      {key + 1}
                    </span>
                  </th>
                  <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                    {cls.type}
                  </td>
                  <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                    {cls.title}
                  </td>
                  <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                    {cls.link}
                  </td>
                  <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                    {cls.reward}
                  </td>
                  <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                    <button
                      className="p-2 rounded-md bg-bluebtn text-gray-700 hover:bg-transparent hover:border-2 hover:border-bluebtn hover:text-bluebtn"
                      onClick={() => handleUpdateTask(cls.id, cls.type, cls.title, cls.link, cls.reward)}
                    >
                      Update
                    </button>
                  </td>
                  <td className='px-6 py-4 border-b border-gray-200 text-sm text-center '>
                    <button
                      className="p-2"
                      onClick={() => handleDeleteTask(cls.id, cls.title)}
                    >
                      <RiDeleteBin5Line className="text-bluebtn w-5 h-5 hover:text-gray-700" />
                    </button>

                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SocialTask;
