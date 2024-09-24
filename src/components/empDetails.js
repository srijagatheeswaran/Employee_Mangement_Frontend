import { useNavigate } from 'react-router-dom';
import "./css/Details.css";
import DetailForm from './Detaile_Form';
import { useEffect, useState } from 'react';
import Slider from './slide';

export default function Details() {
    const navigation = useNavigate();
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('authToken');
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/profile/profile_Details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, email }),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.error) {
                        console.error(result.error);
                    } else {
                        setData(result);
                        console.log(result)
                    }
                } else {
                    console.error('Error fetching profile details.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData();
    }, [token, email]);

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the menu state
    };



    function logout() {
        localStorage.removeItem('authToken');
        localStorage.setItem('login', false);
        localStorage.removeItem('email');
        navigation('/login');
    }

    return (
        <div className='profile'>
            <header>
                <div>
                    <i className="bi bi-list" onClick={toggleMenu}></i>
                    <h1 className='text-primary '>Profile</h1>
                </div>
                <i className="bi bi-box-arrow-right logout" onClick={logout}></i>
            </header>
            <div className="midContant">
                <Slider Open={isOpen} />
                <div className="contantBox">
                    <div className='contant1'>
                        <h1>Personal Details</h1>
                        {data ? <DetailForm Details={data} /> : <p className='text-primary'>Loading...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
