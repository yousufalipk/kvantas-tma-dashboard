import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../Context/Firebase';

const AnnoucementForm = () => {
    const { createAnnoucement, updateAnnoucement, sendData } = useFirebase();

    const navigate = useNavigate();
    let initialValues;
    if (sendData.description) {
        initialValues = {
            type: sendData.type || 'desc',
            title: sendData.title || '',
            subtitle: sendData.subtitle || '',
            description: sendData.description || '',
            reward: sendData.reward || '',
            image: sendData.imageName || '',
            icon: sendData.iconName || ''
        };
    } else {
        initialValues = {
            type: sendData.type || 'desc',
            title: sendData.title || '',
            subtitle: sendData.subtitle || '',
            link: sendData.link || '',
            reward: sendData.reward || '',
            image: sendData.imageName || '',
            icon: sendData.iconName || ''
        };
    }

    const validationSchema = Yup.object({
        type: Yup.string().required('Type is required!'),
        title: Yup.string().required('Title is required'),
        subtitle: Yup.string().required('Subtitle is required'),
        description: Yup.string(),
        link: Yup.string(),
        reward: Yup.number().required('Reward is required'),
        image: Yup.mixed()
            .test('fileSize', 'File size too large', value => !value || (value && value.size <= 2 * 1024 * 1024))
            .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png'].includes(value.type)),
        icon: Yup.mixed()
            .test('fileSize', 'File size too large', value => !value || (value && value.size <= 2 * 1024 * 1024))
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Tick", sendData.tick);
            try {
                if (sendData.tick === true) {
                    console.log("creating...");
                    // Create Announcement
                    const response = await createAnnoucement(values);
                    if (response.success) {
                        navigate('/annoucements');
                        setTimeout(() => {
                            toast.success("Annoucement Created Successfuly!");
                        }, 2000);
                    } else {
                        toast.error("Error Creating Announcement!");
                    }
                } else {
                    console.log("updating...");
                    // Update Announcement
                    const response = await updateAnnoucement({
                        type: sendData.type,
                        uid: sendData.uid,
                        title: values.title,
                        subtitle: values.subtitle,
                        description: values.description,
                        link: values.link,
                        reward: values.reward,
                        image: values.image,
                        icon: values.icon
                    });
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
        }
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
                        {sendData.tick === 'true' ? 'Create Announcement' : 'Confirm Changes'}
                    </button>
                </div>
            </div>
            <hr className='my-5 border-gray-300' />
            <form onSubmit={formik.handleSubmit} className='flex flex-col w-3/4 max-w-md mx-auto'>
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
                {
                    formik.touched.subtitle && formik.errors.subtitle ? (
                        <div className='text-red-600 text-center'>{formik.errors.subtitle}</div>
                    ) : null
                }

                {/* Type desc or link */}
                <div className='flex justify-between px-5'>
                    <label
                        className='w-1/2 text-sm text-gray-400 italic'
                        htmlFor="image"
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
                    <option value='' disabled>Select Annoucement Type</option>
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
                        {
                            formik.touched.description && formik.errors.description ? (
                                <div className='text-red-600 text-center'>{formik.errors.description}</div>
                            ) : null
                        }
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
                        {
                            formik.touched.link && formik.errors.link ? (
                                <div className='text-red-600 text-center'>{formik.errors.link}</div>
                            ) : null
                        }
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
                {
                    formik.touched.reward && formik.errors.reward ? (
                        <div className='text-red-600 text-center'>{formik.errors.reward}</div>
                    ) : null
                }
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
                {
                    formik.touched.image && formik.errors.image ? (
                        <div className='text-red-600 text-center'>{formik.errors.image}</div>
                    ) : null
                }

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
                {
                    formik.touched.icon && formik.errors.icon ? (
                        <div className='text-red-600 text-center'>{formik.errors.icon}</div>
                    ) : null
                }

            </form >
        </div >
    );
};

export default AnnoucementForm;
