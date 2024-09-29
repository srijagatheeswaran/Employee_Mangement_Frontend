import { useState } from "react"
import { ToastContainer, toast ,Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DetailForm({ Details }) {
    const [inputs, setInputs] = useState({
        "name": Details.name,
        "age": Details.age,
        "email": Details.email,
        "mobilenumber": Details.mobilenumber
    })
    const [formErrors, setFormErrors] = useState({});
    const [loader, setloader] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);


    function storeInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((pre) => { return { ...pre, [name]: value } })
    }
    const validate = () => {
        let errors = {};

        if (!inputs.name) {
            errors.name = 'Name is required';
        }

        if (!inputs.age) {
            errors.age = 'Age is required';
        }
        return errors;
    };
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
    function notifiysuccess(data){
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
    async function sendReq() {
        // console.log(inputs)
        setIsSubmitted(false)
        const errors = validate();
        setFormErrors(errors);
        // console.log(formErrors)
        if (Object.keys(errors).length === 0) {
            setloader(true)
            try {
                const response = await fetch('https://employee-management-backend-2-bf4e.onrender.com/DetailsForm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputs),
                });

                const data = await response.json();
                if (response.ok) {
                    // console.log(data)
                    // setIsSubmitted(true)
                    notifiysuccess("Details Update Successfully!")

                }
            } catch (error) {
                console.log('Error');
                notifiyErr(error)

            } finally {
                setloader(false)

            }

        }
    }


    return <>

        <form className="Detail_form">
            {loader ? <div className='loaderHead'>
                <div className="loader"></div>
            </div> : null}
            <div className="inputBox">
                <label>NAME :</label>
                <input placeholder='name' type='text' value={inputs.name} name="name" onChange={storeInput} />
            </div>
            {formErrors.name && <span className="text-danger">{formErrors.name}</span>}
            <div className="inputBox">
                <label>AGE :</label>
                <input placeholder='Age' type='number' value={inputs.age} name="age" onChange={storeInput} />
            </div>
            {formErrors.age && <span className="text-danger">{formErrors.age}</span>}
            <div className="inputBox">
                <label>EMAIL :</label>
                <input className='disable' placeholder='Email' type='text' disabled value={inputs.email} />
            </div>
            <div className="inputBox">
                <label>MOBILE NO :</label>
                <input className='disable' placeholder='Mobilenumber' type='text' disabled value={inputs.mobilenumber} />
            </div>
            <button className='btn btn-success' onClick={sendReq} type="button">Update</button>
            <ToastContainer/>
            {/* {isSubmitted && <div className='text-success my-2 mess '> Details Update Successfully!</div>} */}

        </form>

    </>
}