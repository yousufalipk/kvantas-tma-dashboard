import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFirebase } from '../../Context/Firebase';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { RiDeleteBin5Line } from "react-icons/ri";

import ViewMore from '../../Components/ViewMoreModal/ViewMore';

const Annoucement = () => {
  const navigate = useNavigate();
  const { annoucement, fetchAnnoucement, deleteAnnoucement, toggleAnnoucementStatus, setSendData, isModalOpen, setModalOpen } = useFirebase();

  const [viewText, setViewText] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      await fetchAnnoucement();
    } catch (error) {
      console.log('Error', error);
    }
  }


  useEffect(() => {
    fetchData();
  }, [])

  const handleCreateAnnoucment = async () => {
    try {
      const annoucementData = {
        tick: true
      }
      setSendData(annoucementData);
      //Navigate to Create Annoucement
      navigate(`/annoucement-form`)

    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error")
    }
  }

  const handleUpdateAnnoucment = async (data) => {
    let annoucementData;
    if (data.type === 'desc') {
      annoucementData = {
        tick: false,
        uid: data.id,
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        description: data.description,
        reward: data.reward,
        image: data.image,
        imageName: data.imageName,
        icon: data.icon,
        iconName: data.iconName
      }
    } else {
      if (data.linkType === 'input') {
        annoucementData = {
          tick: false,
          uid: data.id,
          title: data.title,
          subtitle: data.subtitle,
          type: data.type,
          link: data.link,
          linkType: data.linkType,
          inputText: data.inputText,
          reward: data.reward,
          image: data.image,
          imageName: data.imageName,
          icon: data.icon,
          iconName: data.iconName
        }
      } else {
        annoucementData = {
          tick: false,
          uid: data.id,
          title: data.title,
          subtitle: data.subtitle,
          type: data.type,
          link: data.link,
          linkType: data.linkType,
          reward: data.reward,
          image: data.image,
          imageName: data.imageName,
          icon: data.icon,
          iconName: data.iconName
        }
      }
    }
    try {
      navigate(`/annoucement-form-update`);
      setSendData(annoucementData);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error")
    }
  }


  const handleDeleteAnnoucement = async (uid, title) => {
    try {
      const shouldDelete = window.confirm(`Are you sure you want remove ${title}?`);
      if (!shouldDelete) {
        return
      }
      else {
        try {
          const response = deleteAnnoucement(uid);
          if (response.data.success) {
            toast.success("Annoucement Deleted Succesfuly!")
          }
          else {
            toast.error("Error Deleting Annoucement!")
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

  const handleStatusToggle = async (uid, title, status) => {
    try {
      const shouldToggle = window.confirm(`Are you sure you want toggle status of ${title}.`);
      if (!shouldToggle) {
        return
      }
      else {
        try {
          const response = await toggleAnnoucementStatus(uid, status);
          if (response.success) {
            setTimeout(() => {
              toast.success("Status Updated Successfuly!");
            }, 1000);
          }
          else {
            setTimeout(() => {
              toast.error(response.message);
            }, 1000);
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
  const totalPages = Math.ceil(annoucement.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnoucement = annoucement.slice(startIndex, endIndex);

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
      {annoucement && (
        <>
          <div>
            <div className='flex flex-row justify-between'>
              <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
                Manage Annoucements
              </h1>
              <div className='w-2/4 max-10 flex flex-row justify-end'>
                <button
                  className='mx-2 py-1 px-4 rounded-md bg-bluebtn text-gray-700 hover:bg-transparent hover:border-2 hover:border-bluebtn hover:text-bluebtn'
                  onClick={handleCreateAnnoucment}
                >
                  Add Annoucement
                </button>
              </div>
            </div>
            <hr className='my-5 border-1 border-[white] mx-2' />
          </div>
          <div className='mx-2 md:my-10 my-2 overflow-scroll md:overflow-hidden'>
            <table className="bg-transparent border-collapse border border-gray-200 md:w-full table-fixed">
              <thead className="thead-dark">
                <tr>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Sr.No</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Title</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Subtitle</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Type</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Desc/Link</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Reward</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Participants</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Toggle Status</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Image Name</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Image Thumb</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Icon Name</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Icon Thumb</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Update</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  currentAnnoucement.map((cls, key) => (
                    <tr key={key}>
                      <th scope="row" className='border-b border-gray-200'>
                        <span style={{ fontWeight: "bold" }}>
                          {key + 1}
                        </span>
                      </th>
                      <td
                        onClick={() => handleModalOpen(cls.title)}
                        className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:text-bluebtn hover:cursor-pointer'
                        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                      >
                        {cls.title}
                      </td>
                      <td
                        onClick={() => handleModalOpen(cls.subtitle)}
                        className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:text-bluebtn hover:cursor-pointer'
                        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {cls.subtitle}
                      </td>
                      <td
                        onClick={() => handleModalOpen(cls.type)}
                        className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:text-bluebtn hover:cursor-pointer'
                        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {cls.type}
                      </td>
                      <td
                        onClick={() => handleModalOpen(cls.description || cls.link)}
                        className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:text-bluebtn hover:cursor-pointer'
                        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {cls.description || cls.link}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {cls.reward}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {cls.numberOfParticipants}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'
                      >
                        <button
                          className="p-2 hover:bg-bluebtn rounded-lg"
                          onClick={() => handleStatusToggle(cls.id, cls.title, cls.status)}
                        >
                          {cls.status ? (<p className='text-green-500 hover:text-black'>Active</p>) : (<p className='text-red-500 hover:text-black'>In Active</p>)}
                        </button>
                      </td>
                      {cls.imageName ? (
                        <td
                          className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:text-bluebtn hover:cursor-pointer'
                          onClick={() => handleModalOpen(cls.imageName)}
                          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                        >
                          {cls.imageName}
                        </td>
                      ) : (
                        <td
                          className='px-6 py-4 border-b border-gray-200 text-sm text-center italic'
                        >
                          default
                        </td>
                      )}
                      {cls.image ? (
                        <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          <a href={cls.image} target="_blank" rel="noopener noreferrer">
                            <img src={cls.image} alt={"Thumb"} className='w-10 h-10 m-auto' />
                          </a>
                        </td>
                      ) : (
                        <td
                          className='px-6 py-4 border-b border-gray-200 text-sm text-center italic'
                        >
                          default
                        </td>
                      )}
                      {cls.iconName ? (
                        <td
                          className='px-6 py-4 border-b border-gray-200 text-sm text-center hover:text-bluebtn hover:cursor-pointer'
                          onClick={() => handleModalOpen(cls.iconName)}
                          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                        >
                          {cls.iconName}
                        </td>
                      ) : (
                        <td
                          className='px-6 py-4 border-b border-gray-200 text-sm text-center italic'
                        >
                          default
                        </td>
                      )}
                      {cls.icon ? (
                        <td className='px-6 py-4 border-b border-gray-200 text-sm text-center' style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          <a href={cls.icon} target="_blank" rel="noopener noreferrer">
                            <img src={cls.icon} alt={"Thumb"} className='w-10 h-10 m-auto' />
                          </a>
                        </td>
                      ) : (
                        <td
                          className='px-6 py-4 border-b border-gray-200 text-sm text-center italic'
                        >
                          default
                        </td>
                      )}
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                        <button
                          className="p-2 rounded-md bg-bluebtn text-gray-700 hover:bg-transparent hover:border-2 hover:border-bluebtn hover:text-bluebtn"
                          onClick={() => handleUpdateAnnoucment(cls)}
                          style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                        >
                          Edit
                        </button>
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center '>
                        <button
                          className="p-2"
                          onClick={() => handleDeleteAnnoucement(cls.id, cls.title)}
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
      )}
    </>
  )
}

export default Annoucement;
