import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../Context/Firebase';

const SocialTaskForm = () => {
    const { createTask, updateTask, sendData } = useFirebase();

    const navigate = useNavigate();

    const initialValues = {
        priority: sendData.priority || '',
        type: sendData.type || '',
        title: sendData.title || '',
        link: sendData.link || '',
        reward: sendData.reward || null
    };

    const validationSchema = Yup.object({
        priority: Yup.number().required('Priority is required'),
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
                if (sendData.tick === true) {
                    // Create task
                    const response = await createTask(values);
                    if (response.success) {
                        navigate('/social-tasks');
                        setTimeout(() => {
                            toast.success("Task Added Successfully!");
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            toast.error(response.message);
                        }, 1000);
                    }
                }
                else {
                    // Update task
                    const response = await updateTask({
                        uid: sendData.uid,
                        priority: values.priority,
                        type: values.type,
                        title: values.title,
                        link: values.link || "",
                        reward: values.reward,
                    });
                    if (response.success) {
                        navigate('/social-tasks');
                        setTimeout(() => {
                            toast.success("Task Updated Successfully!");
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            toast.error(response.message);
                        }, 1000);
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
                    {sendData.tick === true ? 'Add Social Task' : 'Edit Social Task'}
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
                        {sendData.tick === 'true' ? 'Create Task' : 'Confirm Changes'}
                    </button>
                </div>
            </div>
            <hr className='my-5 border-gray-300' />
            <form onSubmit={formik.handleSubmit} className='flex flex-col w-3/4 max-w-md mx-auto'>
                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    type='number'
                    id='priority'
                    name='priority'
                    placeholder='Priority'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.priority}
                />
                {formik.touched.priority && formik.errors.priority ? (
                    <div className='text-red-600 text-center'>{formik.errors.priority}</div>
                ) : null}

                <select
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    id='type'
                    name='type'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.type}
                >
                    <option value='' disabled>Select Type</option>
                    <option value='telegram'>Telegram</option>
                    <option value='twitter'>Twitter</option>
                    <option value='instagram'>Instagram</option>
                    <option value='youtube'>Youtube</option>
                    <option value='moreLink'>Website</option>
                    <option value='email'>Email</option>
                    <option value='phone'>Phone</option>
                </select>
                {formik.touched.type && formik.errors.type ? (
                    <div className='text-red-600 text-center'>{formik.errors.type}</div>
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
                    <div className='text-red-600 text-center'>{formik.errors.title}</div>
                ) : null}


                {formik.values.title === 'phone' || 'email' && (
                    <>
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
                            <div className='text-red-600 text-center'>{formik.errors.link}</div>
                        ) : null}
                    </>
                )}

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
                    <div className='text-red-600 text-center'>{formik.errors.reward}</div>
                ) : null}
            </form>
        </div>
    );
};

export default SocialTaskForm;
