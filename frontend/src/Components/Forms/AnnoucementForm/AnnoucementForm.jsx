import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../Context/Firebase';

const AnnouncementForm = () => {
    const { createAnnoucement, updateAnnoucement, sendData } = useFirebase();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);

    // State for initial values
    const [initialValues, setInitialValues] = useState({
        type: 'desc',
        title: '',
        subtitle: '',
        description: '',
        link: '',
        linkType: '',
        reward: '',
        image: null,
        icon: null,
        inputText: null
    });

    useEffect(() => {
        if (sendData.tick === true) {
            setInitialValues({
                title: '',
                subtitle: '',
                type: 'desc',
                description: '',
                link: '',
                linkType: '',
                inputText: '',
                reward: '',
                image: null,
                icon: null,
            });
        } else {
            if (sendData.type === 'desc') {
                setInitialValues({
                    type: sendData.type || '',
                    title: sendData.title || '',
                    subtitle: sendData.subtitle || '',
                    description: sendData.description || '',
                    link: '',
                    linkType: '',
                    inputText: '',
                    reward: sendData.reward || '',
                    image: '',
                    icon: '',
                });
            } else {
                if (sendData.linkType === 'input') {
                    setInitialValues({
                        type: sendData.type || '',
                        title: sendData.title || '',
                        subtitle: sendData.subtitle || '',
                        description: '',
                        link: sendData.link || '',
                        linkType: sendData.linkType,
                        inputText: sendData.inputText,
                        reward: sendData.reward || '',
                        image: '',
                        icon: '',
                    });
                } else {
                    setInitialValues({
                        type: sendData.type || '',
                        title: sendData.title || '',
                        subtitle: sendData.subtitle || '',
                        description: '',
                        link: sendData.link || '',
                        linkType: sendData.linkType,
                        reward: sendData.reward || '',
                        image: '',
                        icon: '',
                    });
                }
            }
            if (sendData.icon) {
                setSelectedIcon(sendData.iconName);
            }
            if (sendData.imageName) {
                setSelectedImage(sendData.imageName);
            }
        }
    }, [sendData]);

    const validationSchema = Yup.object({
        type: Yup.string().required('Type is required!'),
        title: Yup.string().required('Title is required'),
        subtitle: Yup.string().required('Subtitle is required').max(60),
        description: Yup.string(),
        link: Yup.string().url('Invalid URL format'),
        reward: Yup.number().required('Reward is required'),
        inputText: Yup.string()
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                let data;
                if (sendData.tick === true) {
                    // Create Announcement
                    if (values.type === 'desc') {
                        data = {
                            title: values.title,
                            subtitle: values.subtitle,
                            type: values.type,
                            description: values.description,
                            reward: values.reward,
                            status: false,
                            icon: values.icon || null,
                            iconName: values.icon?.name || null,
                            image: values.image || null,
                            imageName: values.image?.name || null,
                        }
                    } else {
                        // Annoucment type link
                        if (values.linkType === 'input') {
                            data = {
                                title: values.title,
                                subtitle: values.subtitle,
                                type: values.type,
                                link: values.link,
                                linkType: values.linkType,
                                inputText: values.inputText,
                                reward: values.reward,
                                status: false,
                                icon: values.icon || null,
                                iconName: values.icon?.name || null,
                                image: values.image || null,
                                imageName: values.image?.name || null,
                            }
                        } else {
                            data = {
                                title: values.title,
                                subtitle: values.subtitle,
                                type: values.type,
                                link: values.link,
                                linkType: values.linkType,
                                reward: values.reward,
                                status: false,
                                icon: values.icon || null,
                                iconName: values.icon?.name || null,
                                image: values.image || null,
                                imageName: values.image?.name || null,
                            }
                        }
                    }
                    const response = await createAnnoucement(data);
                    if (response.success) {
                        navigate('/annoucements');
                        setTimeout(() => {
                            toast.success("Announcement Created Successfully!");
                        }, 2000);
                    } else {
                        toast.error("Error Creating Announcement!");
                    }
                } else {
                    console.log("Send data for updating", sendData);
                    // Update Announcement
                    if (values.type === 'desc') {
                        data = {
                            uid: sendData.uid,
                            title: values.title,
                            subtitle: values.subtitle,
                            type: values.type,
                            description: values.description,
                            reward: values.reward,
                            status: false,
                            icon: values.icon || null,
                            iconName: values.icon?.name || null,
                            image: values.image || null,
                            imageName: values.image?.name || null,
                            selectedImage: selectedImage || null,
                            selectedIcon: selectedIcon || null
                        }
                    } else {
                        // Annoucment type link
                        if (values.linkType === 'input') {
                            data = {
                                uid: sendData.uid,
                                title: values.title,
                                subtitle: values.subtitle,
                                type: values.type,
                                link: values.link,
                                linkType: values.linkType,
                                inputText: values.inputText,
                                reward: values.reward,
                                status: false,
                                icon: values.icon || null,
                                iconName: values.icon?.name || null,
                                image: values.image || null,
                                imageName: values.image?.name || null,
                                selectedImage: selectedImage || null,
                                selectedIcon: selectedIcon || null
                            }
                        } else {
                            data = {
                                uid: sendData.uid,
                                title: values.title,
                                subtitle: values.subtitle,
                                type: values.type,
                                link: values.link,
                                linkType: values.linkType,
                                reward: values.reward,
                                status: false,
                                icon: values.icon || null,
                                iconName: values.icon?.name || null,
                                image: values.image || null,
                                imageName: values.image?.name || null,
                                selectedImage: selectedImage || null,
                                selectedIcon: selectedIcon || null
                            }
                        }
                    }
                    console.log("Before updating!");
                    const response = await updateAnnoucement(data);
                    console.log("After updating!");
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
        setSelectedImage(file ? file.name : null);
        formik.setFieldValue('image', file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        formik.setFieldValue('image', null);
    };

    const handleRemoveIcon = () => {
        setSelectedIcon(null);
        formik.setFieldValue('icon', null);
    };

    const handleIconChange = (event) => {
        const file = event.currentTarget.files[0];
        setSelectedIcon(file ? file.name : null);
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

                {/* If Type is description or else link */}
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
                        <div className='flex justify-between px-5'>
                            <label
                                className='text-sm text-gray-400 italic'
                                htmlFor="image"
                            >
                                {`Link Format: (https://www.google.com)`}
                            </label>
                        </div>
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

                {formik.values.type === 'link' && (
                    <>

                        <div className='flex justify-between px-5'>
                            <label
                                className='w-1/2 text-sm text-gray-400 italic'
                                htmlFor="type"
                            >
                                {`Link with user input / without`}
                            </label>
                        </div>
                        <select
                            className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                            id='linkType'
                            name='linkType'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.linkType}
                        >
                            <option value='' disabled>Select Link Type</option>
                            <option value='input'>Link with input</option>
                            <option value='noInput'>Link without input</option>
                        </select>
                        {formik.touched.linkType && formik.errors.linkType ? (
                            <div className='text-red-600 text-center'>{formik.errors.linkType}</div>
                        ) : null}
                    </>
                )}


                {formik.values.linkType === 'input' && (
                    <>
                        {/* Input text */}
                        <input
                            className='p-3 mx-2 my-3 border-2 rounded-xl placeholder:text-gray-700 text-gray-700'
                            type='text'
                            id='inputText'
                            name='inputText'
                            placeholder='Input Text'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.inputText}
                        />
                        {formik.touched.inputText && formik.errors.inputText ? (
                            <div className='text-red-600 text-center'>{formik.errors.inputText}</div>
                        ) : null}
                    </>
                )}

                {/* Reward */}
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

                <div>
                    <input
                        className='hidden'
                        type='file'
                        id='image'
                        name='image'
                        onChange={handleImageChange}
                    />
                    <div className='w-full flex'>
                        <label
                            htmlFor='image'
                            className='bg-white text-gray-700 p-3 mx-2 my-2 rounded-xl w-1/2 text-center hover:italic'
                        >
                            Upload Image
                        </label>
                        <p
                            onClick={() => handleRemoveImage()}
                            className={`text-white flex justify-center items-center italic w-1/2 ${selectedImage && (`hover:border-2 hover:border-red-600 rounded-xl hover:text-red-600`)}`}
                        >
                            {selectedImage ? selectedImage : 'No file chosen'}
                        </p>
                    </div>
                </div>
                {
                    formik.touched.image && formik.errors.image ? (
                        <div className='text-red-600 text-center'>{formik.errors.image}</div>
                    ) : null
                }

                {/* Input Icon */}
                <div className='flex justify-between px-5'>
                    <label
                        className='w-1/2 text-sm text-gray-400 italic'
                        htmlFor="image"
                    >
                        {`Announcement Icon`}
                    </label>
                    <p className='text-xs font-semibold text-gray-400'>{`---( Optional )---`}</p>
                </div>

                <div>
                    <input
                        className='hidden'
                        type='file'
                        id='icon'
                        name='icon'
                        onChange={handleIconChange}
                    />
                    <div className='w-full flex'>
                        <label
                            htmlFor='icon'
                            className='bg-white text-gray-700 p-3 mx-2 my-2 rounded-xl w-1/2 text-center hover:italic'
                        >
                            Upload Icon
                        </label>
                        <p
                            onClick={() => handleRemoveIcon()}
                            className={`text-white flex justify-center items-center italic w-1/2 ${selectedIcon && (`hover:border-2 hover:border-red-600 rounded-xl hover:text-red-600`)}`}
                        >
                            {selectedIcon ? selectedIcon : 'No file chosen'}
                        </p>
                    </div>
                </div>
                {
                    formik.touched.icon && formik.errors.icon ? (
                        <div className='text-red-600 text-center'>{formik.errors.icon}</div>
                    ) : null
                }

            </form >
        </div >
    );
};

export default AnnouncementForm;
