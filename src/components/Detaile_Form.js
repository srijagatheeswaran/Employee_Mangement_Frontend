import { useState } from "react"

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
    async function sendReq() {
        // console.log(inputs)
        setIsSubmitted(false)
        const errors = validate();
        setFormErrors(errors);
        // console.log(formErrors)
        if (Object.keys(errors).length === 0) {
            setloader(true)
            try {
                const response = await fetch('http://127.0.0.1:5000/DetailsForm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputs),
                });

                const data = await response.json();
                if (response.ok) {
                    // console.log(data)
                    setIsSubmitted(true)

                }
            } catch (error) {
                console.log('Error');

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
            {isSubmitted && <div className='text-success my-2 mess '> Details Update Successfully!</div>}

        </form>

    </>
}