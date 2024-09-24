import Slider from "./slide";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./css/Calendar.css"



function Calendar() {
    const navigation = useNavigate();
    const email = localStorage.getItem('email');
    const [loginHistory, setLoginHistory] = useState([]);
    const [error, setError] = useState(false);
    const [show, setshow] = useState(true)

    function logout() {
        localStorage.removeItem('authToken');
        localStorage.setItem('login', false)
        localStorage.removeItem('email');
        navigation('/login')
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/profile/Calendar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.message == "No login history found") {
                        console.error(result.error);
                        setError(true)
                        setshow(false)
                    } else {
                        setLoginHistory(result.login_history)
                        console.log(result.login_history)
                        setError(false)
                        console.log(result)
                        setshow(false)
                    }
                } else {
                    console.error('Error fetching profile details.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData();
    }, [email]);
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the menu state
    };
    return <>
        <div className='profile'>
            <header>
                <div>
                    <i className="bi bi-list" onClick={toggleMenu}></i>
                    <h1 className='text-primary '>Calendar </h1>
                </div>
                <i className="bi bi-box-arrow-right logout" onClick={logout}></i>
            </header>
            <div className="midContant">
                <Slider Open={isOpen} />
                <div className="contantBox">
                    {show ? <p>loading....</p> :
                        <div className='contant1'>
                            <h1>Attendance Details</h1>
                            {error ? <p>No login history found.....</p> :
                                <table className="table table-striped m-3">
                                    <thead>
                                        <tr>
                                            <th scope="col">S.NO</th>
                                            <th scope="col">DATE</th>
                                            <th scope="col">TIME</th>
                                            <th scope="col">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {loginHistory.map((entry, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{entry.date}</td>
                                                <td>{entry.time}</td>
                                                <td>Login</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}

                        </div>}
                </div>
            </div>
        </div>
    </>


}


export default Calendar;