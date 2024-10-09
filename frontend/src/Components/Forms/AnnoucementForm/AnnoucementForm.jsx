import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../Context/Firebase';

const AnnouncementForm = () => {
    const { createAnnoucement, updateAnnoucement, sendData } = useFirebase();
    const navigate = useNavigate();

    // State for initial values
    const [initialValues, setInitialValues] = useState({
        type: 'desc',
        title: '',
        subtitle: '',
        description: '',
        link: '',
        reward: '',
        image: null,
        icon: null,
    });

    useEffect(() => {
        if (sendData.tick === true) {
            setInitialValues({
                type: 'desc',
                title: '',
                subtitle: '',
                description: '',
                link: '',
                reward: '',
                image: null,
                icon: null,
            });
        } else {
            setInitialValues({
                type: sendData.type || 'desc',
                title: sendData.title || '',
                subtitle: sendData.subtitle || '',
                description: sendData.description || '',
                link: sendData.link || '',
                reward: sendData.reward || '',
                image: sendData.image || null,
                icon: sendData.icon || null,
            });
        }
    }, [sendData]);

    const validationSchema = Yup.object({
        type: Yup.string().required('Type is required!'),
        title: Yup.string().required('Title is required'),
        subtitle: Yup.string().required('Subtitle is required'),
        description: Yup.string(),
        link: Yup.string(),
        reward: Yup.number().required('Reward is required'),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true, // Allow initialValues to be updated
        onSubmit: async (values, { resetForm }) => {
            try {
                if (sendData.tick === true) {
                    // Create Announcement
                    const response = await createAnnoucement(values);
                    if (response.success) {
                        navigate('/annoucements');
                        setTimeout(() => {
                            toast.success("Announcement Created Successfully!");
                        }, 2000);
                    } else {
                        toast.error("Error Creating Announcement!");
                    }
                } else {
                    // Update Announcement
                    const data = {
                        type: values.type,
                        uid: sendData.uid,
                        title: values.title,
                        subtitle: values.subtitle,
                        description: values.description,
                        link: values.link,
                        reward: values.reward,
                        image: values.image,
                        icon: values.icon,
                        prevData: {
                            prevImage: sendData.image,
                            prevIcon: sendData.icon,
                        },
                    };
                    const response = await updateAnnoucement(data);
                    if (response.success) {
                        navigate('/annoucements');
                        toast.success("Announcement Updated Successfully!");
                    } else {
                        toast.error("Error Updating Announcement!");
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Internal Server Error");
            } finally {
                resetForm(); // Clear form data
            }
        },
    });

    const handleBack = () => {
        navigate('/annoucements');
    };

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue('image', file);
    };

    const handleIconChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue('icon', file);
    };

    return (
        <div className='p-4'>
            <div className='flex flex-row justify-between items-center mb-5'>
                <h1 className='font-bold text-left text-xl'>
                    {sendData.tick === true ? 'Add Announcement' : 'Edit Announcement'}
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
                        {sendData.tick === true ? 'Create Announcement' : 'Confirm Changes'}
                    </button>
                </div>
            </div>
            <hr className='my-5 border-gray-300' />
            <form onSubmit={formik.handleSubmit} className='flex flex-col w-3/4 max-w-md mx-auto overflow-scroll overflow-x-hidden h-[70vh]'>
                {/* Title */}
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

                {/* Sub Title */}
                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    type='text'
                    id='subtitle'
                    name='subtitle'
                    placeholder='Sub Title'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subtitle}
                />
                {formik.touched.subtitle && formik.errors.subtitle ? (
                    <div className='text-red-600 text-center'>{formik.errors.subtitle}</div>
                ) : null}

                {/* Type desc or link */}
                <div className='flex justify-between px-5'>
                    <label
                        className='w-1/2 text-sm text-gray-400 italic'
                        htmlFor="type"
                    >
                        {`Select Announcement Type`}
                    </label>
                </div>
                <select
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                    id='type'
                    name='type'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.type}
                >
                    <option value='' disabled>Select Announcement Type</option>
                    <option value='desc'>Announcement with description</option>
                    <option value='link'>Announcement with Link</option>
                </select>
                {formik.touched.type && formik.errors.type ? (
                    <div className='text-red-600 text-center'>{formik.errors.type}</div>
                ) : null}

                {formik.values.type === 'desc' ? (
                    <>
                        <input
                            className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                            type='text'
                            id='description'
                            name='description'
                            placeholder='Description'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className='text-red-600 text-center'>{formik.errors.description}</div>
                        ) : null}
                    </>
                ) : (
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

                {/* Input Image */}
                <div className='flex justify-between px-5'>
                    <label
                        className='w-1/2 text-sm text-gray-400 italic'
                        htmlFor="image"
                    >
                        {`Announcement Image`}
                    </label>
                    <p className='text-xs font-semibold text-gray-400'>{`---( Optional )---`}</p>
                </div>
                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700 bg-white'
                    type='file'
                    id='image'
                    name='image'
                    onChange={handleImageChange}
                />
                {formik.touched.image && formik.errors.image ? (
                    <div className='text-red-600 text-center'>{formik.errors.image}</div>
                ) : null}

                {/* Input Icon */}
                <div className='flex justify-between px-5'>
                    <label
                        className='w-1/2 text-sm text-gray-400 italic'
                        htmlFor="icon"
                    >
                        {`Announcement Icon`}
                    </label>
                    <p className='text-xs font-semibold text-gray-400'>{`---( Optional )---`}</p>
                </div>
                <input
                    className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700 bg-white'
                    type='file'
                    id='icon'
                    name='icon'
                    onChange={handleIconChange}
                />
                {formik.touched.icon && formik.errors.icon ? (
                    <div className='text-red-600 text-center'>{formik.errors.icon}</div>
                ) : null}
            </form>
        </div>
    );
};

export default AnnouncementForm;
