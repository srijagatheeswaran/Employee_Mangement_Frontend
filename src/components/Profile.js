import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profile.css';
import TackPic from './takepic';
import CheckImg from './check';
import Slider from './slide';
import Loading from './Loading';

export default function Profile() {
    const navigation = useNavigate();
    const [show, setshow] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const[showSrc,setsrc] =useState(false)
    const [reload, setReload] = useState(false);
    const email = localStorage.getItem('email')
    async function checkTokan() {
        // console.log('in')
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('https://employee-management-backend-2-bf4e.onrender.com/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'token': token, 'email': email }),
            });

            if (response.ok) {
                const data = await response.json();
                // console.log('Success:', data);
                localStorage.setItem('login', data.status);
                setIsLoggedIn(data.status);
                setshow(data.status)
                setsrc(data.sourceImg)
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
    }, [reload]);

    //for logout
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.setItem('login', false)
        localStorage.removeItem('email');
        navigation('/login')
    }

    const [tackpic, settack] = useState(false)
    const [targetpic, settargetpic] = useState(false)
    const showpic2 =function () {
        settack(true)
        settargetpic(false)
    }
    function showpic1() {
        settargetpic(true)
        settack(false)
    }
    const showpic3=function(){
        settargetpic(false)

    }
    
    // function close() {
    //     settack(false)
    //     settargetpic(false)
    // }
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the menu state
    };
    const reloadProfile = () => {
        // console.log(reload)
        setReload(prevReload => !prevReload);

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
                        {showSrc?null:
                        <div className='sourceBox'>
                            <h1 className="text-danger">Upload Source Image One Time Is Enough....</h1>
                            {tackpic ? null : <button onClick={showpic2} className="btn btn-primary send">Upload image</button>}
                        </div>}
                        <div className='targetBox'>
                            <h1>Update Your Daily Attendance</h1>
                            {targetpic ? null : <button onClick={showpic1} className="btn btn-primary send">Update</button>}
                        </div>
                    </div>
                    <div className='imgPicBox'>
                        {/* {targetpic || tackpic ? <i class="bi bi-x" onClick={close}></i> : null} */}
                        {targetpic ? <CheckImg email={email} showpic3={showpic3} /> : null}
                        {tackpic ? <TackPic email={email} onRequestSuccess={reloadProfile} /> : null}

                    </div>
                </div>
            </div>

        </div>



    </div> : <Loading/>
}