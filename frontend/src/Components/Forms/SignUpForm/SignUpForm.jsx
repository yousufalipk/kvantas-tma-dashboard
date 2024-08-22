import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../Context/Firebase';

const SignUpForm = (props) => {
  const { registerUser } = useFirebase();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      fname: Yup.string().required('First Name is required'),
      lname: Yup.string().required('Last Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a @gmail.com')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if(values.password !== values.confirmPassword){
          toast.error("Password did't Match!");
        }
        else{
          if(props.tick){
            const response = await registerUser(values.fname, values.lname, values.email, values.password, true);
            if(response.success){
              toast.success("User Added Successfuly!");
              navigate('/manage-users');
            }
            else{
              toast.error("Registration Failed");
            }
          }
          else{
            const response = await registerUser(values.fname, values.lname, values.email, values.password, false);
            if(response.success){
              toast.success("Account Created Successfully!");
              navigate('/admin');
            }
            else{
              toast.error("Registration Failed");
            }
          }
        }
      } catch (error) {
        console.log(error);
        toast.error('Registration Failed!');
      } finally {
        resetForm(); // Clear form data
      }
    }
  });

  const handleBack = () => {
    navigate('/manage-users');
  };

  return (
    <div>
      {!props.toggle ? (
        <>
          <h3 className='text-2xl font-bold mx-2 text-white'>Welcome!</h3>
          <h2 className='text-2xl mx-2 text-white'>Create Your New Account</h2>
        </>
      ) : (
        <>
          <div className='flex flex-row justify-between'>
            <h1 className='font-bold text-left mx-10 w-full max-w-2xl'>
              Add User
            </h1>
            <div className='w-2/4 max-10 flex flex-row justify-end'>
              <button
                className='mx-2 bg-red-500 py-1 px-4 rounded-md text-white hover:text-black'
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className='mx-2 bg-bluebtn py-1 px-4 rounded-md text-white hover:text-gray-600'
                onClick={formik.handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
          <hr className='my-5 border-1 border-[black] mx-2' />
        </>
      )}
      <form onSubmit={formik.handleSubmit} className='flex flex-col'>
        <input className='p-3 mx-2 my-3 border-2 rounded-xl'
          type='text'
          id='fname'
          name='fname'
          autoComplete="given-name"
          placeholder='First Name'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.fname}
        />
        {formik.touched.fname && formik.errors.fname ? (
          <div className='text-red-600 text-center'>{formik.errors.fname}</div>
        ) : null}

        <input className='p-3 mx-2 my-3 border-2 rounded-xl'
          type='text'
          id='lname'
          name='lname'
          autoComplete="family-name"
          placeholder='Last Name'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lname}
        />
        {formik.touched.lname && formik.errors.lname ? (
          <div className='text-red-600 text-center'>{formik.errors.lname}</div>
        ) : null}

        <input className='p-3 mx-2 my-3 border-2 rounded-xl'
          type='text'
          id='email'
          name='email'
          autoComplete="email"
          placeholder='Email'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className='text-red-600 text-center'>{formik.errors.email}</div>
        ) : null}

        <input className='p-3 mx-2 my-3 border-2 rounded-xl'
          type='password'
          id='password'
          name='password'
          autoComplete="new-password"
          placeholder='Password'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className='text-red-600 text-center'>{formik.errors.password}</div>
        ) : null}

        <input className='p-3 mx-2 my-2 border-2 rounded-xl'
          type='password'
          id='confirmPassword'
          name='confirmPassword'
          placeholder='Confirm Password'
          autoComplete="new-password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className='text-red-600 text-center'>{formik.errors.confirmPassword}</div>
        ) : null}
        {!props.toggle &&(
          <button type='submit' className='bg-bluebtn w-36 p-3 mx-2 my-1 rounded-md text-white'>
            Create Account
          </button>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
