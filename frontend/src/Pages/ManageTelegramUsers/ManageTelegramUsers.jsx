import React, { useEffect } from 'react';
import { useFirebase } from '../../Context/Firebase';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const ManageTelegramUsers = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { telegramUsers, fetchTelegramUsers, setLoading } = useFirebase();

  const fetchData = async () => {
    try {
      const response = await fetchTelegramUsers();
      console.log("Response: ", response);
    } catch (error) {
      console.log('Error', error);
    }
  }

  const handleDownloadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/downloadTelegramUsersData`, {
        responseType: 'blob',
      });

      // Extract the filename from the headers if needed
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'TelegramUserdata.xlsx';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      // Use FileSaver to save the file
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      saveAs(blob, filename);
      toast.success("Data Downloaded Successfuly!")
    } catch (error) {
      toast.error("Error Downloading Data!")
      console.error('Error downloading the file:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])


  return (
    <>
      {telegramUsers && (
        <>
          <div>
            <div className='flex flex-row justify-between'>
              <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
                Manage Telegram User's
              </h1>
              <div className='w-2/4 max-10 flex flex-row justify-end'>
                <button
                  className='mx-2 py-1 px-4 rounded-md bg-blue-800 text-white hover:bg-transparent hover:border-2 hover:border-blue-800 hover:text-blue-800'
                  onClick={handleDownloadData}
                >
                  Download User Data
                </button>
              </div>
            </div>
            <hr className='my-5 border-1 border-[white] mx-2' />
          </div>
          <div className='mx-2 my-10'>
            <table className="min-w-full bg-transparent border-collapse border border-gray-200">
              <thead className="thead-dark">
                <tr>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Telegram Id</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Username</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">First Name</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Last Name</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Wallet Address</th>
                  <th className='px-6 py-3 border-b-2 border-gray-300 text-sm text-center' scope="col">Twitter Username</th>
                </tr>
              </thead>
              <tbody>
                {
                  telegramUsers.map((cls, key) => (
                    <tr key={key}>
                      <th scope="row" className='border-b border-gray-200'>
                        <span style={{ fontWeight: "bold" }}>
                          {cls.telegramId || "undefined"}
                        </span>
                      </th>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                        {cls.username || "undefined"}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                        {cls.firstName || "undefined"}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                        {cls.lastName || "undefined"}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                        {cls.tonWalletAddress  || "undefined"}
                      </td>
                      <td className='px-6 py-4 border-b border-gray-200 text-sm text-center'>
                        {cls.twitterUserName || "undefined"}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default ManageTelegramUsers
