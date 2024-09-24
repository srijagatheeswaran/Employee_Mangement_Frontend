
import { useNavigate } from 'react-router-dom';

export default function Slider({ Open }) {

    const navigation = useNavigate();

    function profilePage() {
        navigation('/profile/profile_Details')

    }
    function profile() {
        navigation('/profile');
    }

    function CalendarPage() {
        navigation('/profile/Calendar')

    }
    return <>
        <div className={`sidebar ${Open ? "open" : ""}`}>
            <ul>
                <li onClick={profile}>Home</li>
                <li onClick={profilePage}>Profile</li>
                {/* <li>Address</li> */}
                <li onClick={CalendarPage}>Calendar</li>
            </ul>


        </div>
    </>
}