import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirebase } from '../../../Context/Firebase';

const SocialTaskForm = () => {
    const { tick, uid, type, title, link, reward } = useParams();
    const { createTask, updateTask } = useFirebase();
    const navigate = useNavigate();

    const initialValues = {
        type: type || '',
        title: title || '',
        link: link || '',
        reward: reward || null
    };
    
    const validationSchema = Yup.object({
        type: Yup.string().required('Type is required'),
        title: Yup.string().required('Title is required'),
        link: Yup.string().required('Link is required'),
        reward: Yup.number().required('Reward is required')
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (tick === 'true') {
                    // Create task
                    const response = await createTask(values);
                    console.log("Response", response)
                    if (response.success) {
                        navigate('/social-tasks');
                        setTimeout(() => {
                            toast.success("Task Added Successfully!");
                        }, 2000);
                    } else {
                        console.log("dcdscds", response.data.error);
                        toast.error("Error Creating Task!");
                    }
                } 
                else {
                    console.log("Tick False : ", tick);
                    // Update task
                    const response = await updateTask({ uid, ...values });
                    if (response.success) {
                        navigate('/social-tasks');
                        setTimeout(() => {
                            toast.success("Task Updated Successfully!");
                        }, 2000);
                    } else {
                        toast.error("Error Updating Task!");
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Internal Server Error");
            } finally {
                resetForm(); // Clear form data
            }
        }
    });

    const handleBack = () => {
        navigate('/social-tasks');
    };

    return (
        <div className='p-4'>
            <div className='flex flex-row justify-between items-center mb-5'>
                <h1 className='font-bold text-left text-xl'>
                    {tick === 'true' ? 'Add Task' : 'Edit Task'}
                </h1>
                <div className='flex'>
                    <button
                        className='mx-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600'
                        onClick={handleBack}
                    >
                        Back
                    </button>
                    <button
                        className='mx-2 py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600'
                        type='submit'
                        onClick={formik.handleSubmit}
                    >
                        {tick === 'true' ? 'Create' : 'Update'}
                    </button>
                </div>
            </div>
            <hr className='my-5 border-gray-300' />
            <form onSubmit={formik.handleSubmit} className='flex flex-col w-3/4 max-w-md mx-auto'>
                <select
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    id='type'
                    name='type'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.type}
                >
                    <option value='' disabled>Select Type</option>
                    <option value='Telegram'>Telegram</option>
                    <option value='Twitter'>Twitter</option>
                    <option value='Instagram'>Instagram</option>
                    <option value='Youtube'>Youtube</option>
                    <option value='Website'>Website</option>
                </select>
                {formik.touched.type && formik.errors.type ? (
                    <div className='text-red-600 mb-3'>{formik.errors.type}</div>
                ) : null}

                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    type='text'
                    id='title'
                    name='title'
                    placeholder='Title'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title ? (
                    <div className='text-red-600 mb-3'>{formik.errors.title}</div>
                ) : null}

                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    type='text'
                    id='link'
                    name='link'
                    placeholder='Link'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.link}
                />
                {formik.touched.link && formik.errors.link ? (
                    <div className='text-red-600 mb-3'>{formik.errors.link}</div>
                ) : null}

                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    type='number'
                    id='reward'
                    name='reward'
                    placeholder='Reward'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.reward}
                />
                {formik.touched.reward && formik.errors.reward ? (
                    <div className='text-red-600 mb-3'>{formik.errors.reward}</div>
                ) : null}
            </form>
        </div>
    );
};

export default SocialTaskForm;
