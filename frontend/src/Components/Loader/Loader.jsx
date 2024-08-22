import React from 'react';
import { Circles } from 'react-loader-spinner';

const Loader = () => {
    return (
        <>
        <div className='flex justify-center items-center h-screen'> 
            <Circles
                height="200"
                width="200"
                color="#2596be"
                ariaLabel="loading"
            />
        </div>
        </>
    )
}

export default Loader;
