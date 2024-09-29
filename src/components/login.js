import { useNavigate } from 'react-router-dom';
import './css/login.css'
import { useState, useEffect } from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {


    //for routeing 
    const [show, setshow] = useState(false);
    const [loader, setloader] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);



    const navigation = useNavigate()
    useEffect(() => {
        const loginStatus = localStorage.getItem("login")
        if (loginStatus == "true") {
            navigation('/profile')
        }
        else {
            setshow(true)
        }
    }, [navigation]);


    function registernav() {

        navigation('/register')
    }

    //for form validation
    const [formErrors, setFormErrors] = useState({});
    // const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputs, setInputs] = useState({})

    const validate = () => {
        let errors = {};

        if (!inputs.email_or_mobilenumber) {
            errors.email = 'Email or mobile is required';
        }

        if (!inputs.Password) {
            errors.password = 'Password is required';
        }
        return errors;
    };

    //for store the form data and submit

    function change(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((pre) => { return { ...pre, [name]: value } })

    }
    //for submit 
    // const [reserror, setreserror] = useState({})
    // const [errshow, seterrshow] = useState(false)

    function notifiyErr(err) {
        toast.error(err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Flip,
        });
    }
    function notifiysuccess(data) {
        toast.success(data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
            transition: Flip,
        });
    }

    async function login(e) {

        e.preventDefault()
        // console.log(inputs)
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setloader(true)
            // setIsSubmitted(true);
            // console.log('Form data:', inputs);
            try {
                const response = await fetch('https://employee-management-backend-1w27.onrender.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputs),
                });

                const data = await response.json();
                if (response.ok) {
                    // console.log('Success:', data);   
                    if (data.message == 'Login failed. Check your email and password.') {
                        // console.log(data.message);
                        notifiyErr(data.message)
                        // setreserror({ "message": data.message })
                        // seterrshow(true)
                    }
                    else {
                        notifiysuccess("! Welcome")
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('email', data.email_or_mobilenumber)
                        localStorage.setItem('login', true);
                        navigation('/profile');

                    }
                }
            } catch (error) {
                console.log('Error');
                notifiyErr(error)
                // setreserror({ "message": error })
                // seterrshow(true)

            } finally {
                setloader(false)

            }

        } else {
            // setIsSubmitted(false);
        }

    }
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    return (show ?
        <div className="container login-form ">
            <form className="form" onSubmit={login}>
                {loader ? <div className='loaderHead'>
                    <div className="loader"></div>
                </div> : null}
                <div className="note">
                    <h1>Login</h1>
                </div>

                <div className="form-content">
                    <div className="row row1">
                        <div className="col-md-12">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="E-mail or mobile *" name='email_or_mobilenumber' onChange={change} />
                            </div>
                            {formErrors.email && <span>{formErrors.email}</span>}

                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="input-group">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        className="form-control"
                                        placeholder="Your Password *"
                                        name='Password'
                                        onChange={change}
                                    />  
                                    <div className="input-group-append">
                                        <span
                                            className="input-group-text"
                                            onClick={togglePasswordVisibility}
                                            style={{ cursor: 'pointer' ,color:'black' }}
                                        >
                                            {passwordVisible ? <i class="bi bi-eye-slash-fill"></i> :<i class="bi bi-eye-fill"></i>}
                                        </span>
                                    </div>
                                </div>
                                {formErrors.password && <span>{formErrors.password}</span>}
                            </div>


                        </div>
                    </div>
                    <button type="submit" className="btnSubmit my-3" >Login</button>
                    <div className='login-box'>
                        <p className=' login' onClick={registernav}>I Don't Have a Account</p>
                    </div>
                    <ToastContainer />

                    {/* {errshow ? <div className='text-danger my-2 mess'>{reserror.message} </div> : null} */}
                </div>
            </form>
        </div> : null
    )

}
export default Login;