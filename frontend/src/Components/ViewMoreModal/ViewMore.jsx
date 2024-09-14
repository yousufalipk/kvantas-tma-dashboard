import React from 'react';
import { IoMdClose } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import { useFirebase } from '../../Context/Firebase';
import { toast } from 'react-toastify';

const ViewMore = ({ text }) => {

    const { setModalOpen, isModalOpen } = useFirebase();

    const handleClose = () => {
        setModalOpen(false);
        console.log("Closing modal", isModalOpen);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(
            () => {
                toast.success(`Copied!`); 
            },
            (err) => {
                toast.error("Failed to copy"); 
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 overflow-hidden">
            <div className="bg-custom-image bg-cover w-3/4 md:w-1/2 md:h-3/4 h-1/2 rounded-xl relative p-5">
                <div className="flex justify-end">

                </div>
                <div className="overflow-hidden h-full md:p-5 p-2">
                    <div className='flex justify-between'>
                        <h1 className="md:text-lg text-sm text-center font-bold ml-2">View More</h1>
                        <div className='flex gap-2'>
                            <button onClick={handleCopy} className="text-black font-bold hover:cursor-pointer"><FaCopy className='md:text-4xl text-xl text-white' /></button>
                            <button onClick={handleClose} className="text-black font-bold hover:cursor-pointer"><IoMdClose className='md:text-4xl text-xl text-white' /></button>
                        </div>
                    </div>
                    <hr className="border-1 m-5" />
                    <p className="text-justify md:text-md text-sm md:p-5 p-2">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewMore;
