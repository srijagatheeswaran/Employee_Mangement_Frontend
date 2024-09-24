import { useNavigate } from 'react-router-dom';
import './css/login.css'
import { useState, useEffect } from 'react';


function Login() {


    //for routeing 
    const [show, setshow] = useState(false);
    const [loader, setloader] = useState(false)



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
    const [isSubmitted, setIsSubmitted] = useState(false);
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
    const [reserror, setreserror] = useState({})
    const [errshow, seterrshow] = useState(false)

    async function login(e) {

        e.preventDefault()
        // console.log(inputs)
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setloader(true)
            setIsSubmitted(true);
            // console.log('Form data:', inputs);
            try {
                const response = await fetch('http://127.0.0.1:5000/login', {
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
                        setreserror({ "message": data.message })
                        seterrshow(true)
                    }
                    else {
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('email', data.email_or_mobilenumber)
                        localStorage.setItem('login', true);
                        navigation('/profile');

                    }
                }
            } catch (error) {
                console.log('Error');
                setreserror({ "message": error })
                seterrshow(true)

            } finally {
                setloader(false)

            }

        } else {
            setIsSubmitted(false);
        }

    }


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
                                <input type="text" className="form-control" placeholder="Your Password *" name='Password' onChange={change} />
                            </div>
                            {formErrors.password && <span>{formErrors.password}</span>}

                        </div>
                    </div>
                    <button type="submit" className="btnSubmit my-3" >Login</button>
                    <div className='login-box'>
                        <p className=' login' onClick={registernav}>I Don't Have a Account</p>
                    </div>

                    {errshow ? <div className='text-danger my-2 mess'>{reserror.message} </div> : null}
                </div>
            </form>
        </div> : null
    )

}
export default Login;