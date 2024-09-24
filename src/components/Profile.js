import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profile.css';
import TackPic from './takepic';
import CheckImg from './check';
import Slider from './slide';

export default function Profile() {
    const navigation = useNavigate();
    const [show, setshow] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);


    const email = localStorage.getItem('email')
    async function checkTokan() {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://127.0.0.1:5000/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'token': token, 'email': email }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                localStorage.setItem('login', data);
                setIsLoggedIn(data);
                setshow(data)
            } else {
                console.error('Error:', response.statusText);
                setIsLoggedIn(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setIsLoggedIn(false)
        }
    }


    useEffect(() => {
        const loginStatus = localStorage.getItem('login');
        if (loginStatus === 'false') {
            navigation('/login');
        }
    }, [isLoggedIn, navigation]); // Depend on isLoggedIn state and navigate

    // Call checkTokan on component mount
    useEffect(() => {
        checkTokan();
    }, []);

    //for logout
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.setItem('login', false)
        localStorage.removeItem('email');
        navigation('/login')
    }

    const [tackpic, settack] = useState(false)
    const [targetpic, settargetpic] = useState(false)
    function showpic() {
        settack(true)
        settargetpic(false)
    }
    function showpic1() {
        settargetpic(true)
        settack(false)
    }
    // function close() {
    //     settack(false)
    //     settargetpic(false)
    // }
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the menu state
    };

    return show ? <div className='profile'>
        <header>
            <div>
                <i className="bi bi-list" onClick={toggleMenu}></i>
                <h1 className='text-primary '>HOME </h1>
            </div>
            <i className="bi bi-box-arrow-right logout" onClick={logout}  ></i>
        </header>
        <div className="midContant">
            <Slider Open={isOpen} />
            <div className="contantBox">
                <div className='contant'>
                    <div className='imageBox'>
                        <div className='sourceBox'>
                            <h1 className="text-danger">Uplode source image one time is enough....</h1>
                            {tackpic ? null : <button onClick={showpic} className="btn btn-primary send">Uplode source image</button>}
                        </div>
                        <div className='targetBox'>
                            <h1>Update your attendance</h1>
                            {targetpic ? null : <button onClick={showpic1} className="btn btn-primary send">Update</button>}
                        </div>
                    </div>
                    <div className='imgPicBox'>
                        {/* {targetpic || tackpic ? <i class="bi bi-x" onClick={close}></i> : null} */}
                        {targetpic ? <CheckImg email={email} /> : null}
                        {tackpic ? <TackPic email={email} /> : null}

                    </div>
                </div>
            </div>

        </div>



    </div> : <p className='loading text-primary'>Loading.....</p>
}