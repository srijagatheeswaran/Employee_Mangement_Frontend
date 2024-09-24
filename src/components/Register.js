import { useNavigate } from 'react-router-dom';
import './css/register.css'
import { useState, useEffect } from 'react';
function Register() {



    // return the content
    const [show, setshow] = useState(false);

    //for routing
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

    function loginnav() {
        return navigation('/login')
    }

    // form validation
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        mobilenumber: '',
        password: '',
        repassword: ''
    })

    const validate = () => {
        let errors = {};

        if (!inputs.name) {
            errors.username = 'Username is required';
        }

        if (!inputs.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
            errors.email = 'Email is invalid';
        }

        if (!inputs.password) {
            errors.password = 'Password is required';
        } else {
            if (inputs.password.length < 8) {
                errors.password = 'Password must be at least 8 characters long';
            }
            if (!/[a-z]/.test(inputs.password)) {
                errors.password = 'Password must contain at least one lowercase letter';
            }
            if (!/[A-Z]/.test(inputs.password)) {
                errors.password = 'Password must contain at least one uppercase letter';
            }
            if (!/[0-9]/.test(inputs.password)) {
                errors.password = 'Password must contain at least one number';
            }
            if (!/[!@#$%^&*]/.test(inputs.password)) {
                errors.password = 'Password must contain at least one special character';
            }
        }
        if (!inputs.mobilenumber) {
            errors.mobilenumber = 'Mobile Number is required';
        } else {
            if (inputs.mobilenumber.length < 10) {
                errors.mobilenumber = 'mobilenumber must be 10 characters long';
            }
            if (inputs.mobilenumber.length > 10) {
                errors.mobilenumber = 'mobilenumber must be 10 characters long';
            }
            if (!/[0-9]/.test(inputs.mobilenumber)) {
                errors.mobilenumber = 'mobilenumber must contain numbers';
            }
        }

        if (inputs.repassword !== inputs.password) {
            errors.repassword = 'Passwords do not match';
        }

        return errors;
    };


    //for store the form data and submit

    function change(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((pre) => { return { ...pre, [name]: value } })

    }
    const [resError, setResError] = useState({})
    const [Submitted, setSubmitted] = useState(false);
    const [loader, setloader] = useState(false)

    async function register(e) {

        e.preventDefault()
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            // console.log('Form data:', inputs);
            setloader(true)
            try {
                const response = await fetch('http://127.0.0.1:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputs),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message == 'Email or MobileNumber is Already Registered') {
                        setResError({ "error": data.message })
                        setSubmitted(true)
                        setIsSubmitted(false)
                        setloader(false)


                    }
                    else {
                        console.log('Success:', data);
                        setIsSubmitted(true)
                        setSubmitted(false)
                        setloader(false)
                        setInputs({
                            name: '',
                            email: '',
                            mobilenumber: '',
                            password: '',
                            repassword: ''
                        })

                    }


                } else {
                    console.error('Error:', response.statusText);
                    setResError({ "error": response.statusText })
                    setSubmitted(true)
                    setloader(false)


                }
            } catch (error) {
                console.error('Error:', error);
                setResError({ "error": error })
                setloader(false)
            }

        } else {
            setIsSubmitted(false);
        }
    }
    return (show ? <>

        <div className="container register-form">

            <form className="form" onSubmit={register}>
                {loader ? <div className='loaderHead'>
                    <div className="loader"></div>
                </div> : null}
                <div className="note">
                    <h1>Register</h1>
                </div>

                <div className="form-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Your Name *" name='name' onChange={change} value={inputs.name} />
                            </div>
                            {formErrors.username && <span>{formErrors.username}</span>}
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="email *" name='email' onChange={change} value={inputs.email} />
                            </div>
                            {formErrors.email && <span>{formErrors.email}</span>}
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Mobile Number *" name='mobilenumber' onChange={change} value={inputs.mobilenumber} />
                            </div>
                            {formErrors.mobilenumber && <span>{formErrors.mobilenumber}</span>}
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Your Password *" name='password' onChange={change} value={inputs.password} />
                            </div>
                            {formErrors.password && <span>{formErrors.password}</span>}
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Confirm Password *" name='repassword' onChange={change} value={inputs.repassword} />
                            </div>
                            {formErrors.repassword && <span>{formErrors.repassword}</span>}
                        </div>
                    </div>
                    <button type="submit" className="btnSubmit my-3" >Register</button>
                    <div className='login-box'>
                        <p className=' login' onClick={loginnav}>Already have a account ?</p>
                    </div>

                    {isSubmitted && <div className='text-success my-2 mess'> Register successfully!</div>}
                    {Submitted && <div className='text-danger my-2 mess'>{resError['error']} </div>}
                </div>
            </form>

        </div> </> : null
    )
}

export default Register;