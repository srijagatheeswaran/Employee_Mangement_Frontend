import { useEffect, useState, useRef } from "react";
import "./css/tackpic.css";
import ImageGallery from "./imageGallery";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function TackPic(props) {
    // const [showerror, seterror] = useState(null);
    const [count, setcount] = useState(3);
    const [show, setshow] = useState(true);
    const [imgArr, setImgArr] = useState([]);
    const { email } = props;
    const { onRequestSuccess } = props
    const [showpic, setshowpic] = useState(false);
    const [loader, setloader] = useState(false)
    const [videoElement, setvideoElement] = useState(null)
    const [isPTagHidden, setIsPTagHidden] = useState(false);
    // const [serverErr, setserverErr] = useState(null)
    // const [showserver, setshowserver] = useState(null)
    // const [showres, setres] = useState(false)
    // Create a ref for the video element
    // const videoRef = useRef(null);
    const streamRef = useRef(null);

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

    useEffect(() => {
        const startCamera = async () => {
            try {
                // Check if mediaDevices and getUserMedia are available
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setvideoElement(document.getElementById('camera-stream'))

                    // const videoElement = videoRef.current;
                    // const videoElement=document.getElementById('camera-stream')
                    // console.log(videoRef.current)

                    setshowpic(true)
                    setloader(true)
                    console.log(videoElement)


                    if (videoElement) {
                        videoElement.srcObject = stream;
                        streamRef.current = stream;

                        // Initially hide the video element
                        videoElement.style.display = 'none';

                        // Wait for the video metadata to load
                        videoElement.onloadedmetadata = () => {

                            // Show the video element
                            videoElement.style.display = 'block';
                            videoElement.play();  // Ensure video starts playing
                            setloader(false)

                        };
                    }
                    else {
                        console.log("ss")
                        // setshowpic(false);
                        // setloader(false)
                    }
                } else {
                    setshowpic(false);
                    notifiyErr("Camera API not supported by this browser.");
                }
            } catch (error) {
                setshowpic(false);
                notifiyErr("Error accessing the camera: " + error.message);
            }
        };

        startCamera();
    }, [videoElement]);


    function captureImage() {
        const canvas = document.getElementById('image-capture');
        const context = canvas.getContext('2d');
        const video = document.getElementById('camera-stream');

        if (video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/png');
            // console.log(imageDataUrl);

            setImgArr((prevImgArr) => [...prevImgArr, imageDataUrl]);

            setcount((pre) => pre - 1);
            // console.log(count)
            if (count === 1) {
                setshow(false);
            }
        }
    }

    const removeImage = (index) => {
        const newIndex = parseInt(index)
        setImgArr((prevImgArr) => {
            const newImgArr = prevImgArr.filter((_, i) => i !== newIndex);
            // console.log("new", newImgArr)
            return newImgArr;
        });

        setcount((prevCount) => prevCount + 1);

        if (show === false) {
            setshow(true);
        }
    };



    async function send() {
        setloader(true)
        try {
            const response = await fetch('https://employee-management-backend-2-bf4e.onrender.com/tackpic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'imgArr': imgArr, 'email': email }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    console.log(data.error, data.index)
                    removeImage(data.index)
                    notifiyErr(data.error)

                    // setserverErr(data.error)
                    // setres(true)
                }
                else {
                    console.log(data)
                    notifiysuccess(data)
                    // setshowserver(data)
                    closeMediaStream(streamRef.current)
                    setshowpic(false)
                    onRequestSuccess()
                    setIsPTagHidden(true)
                    // setserverErr(null)
                    // setres(true)
                }

            }
            else {
                const data = await response.json()
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            notifiyErr(error)


        } finally {
            setloader(false)

        }

    }
    function closeMediaStream(stream) {
        // Check if the stream is valid
        if (stream && typeof stream.getTracks === 'function') {
            const tracks = stream.getTracks();

            tracks.forEach(track => {
                console.log('Stopping track:', track);
                track.stop();  // Stop each track
            });

            // After stopping all tracks, remove the stream from any video elements
            if (stream.active) {
                console.log('Media stream is still active, stopping all tracks.');
                stream.getTracks().forEach(track => track.stop()); // Ensure stopping all tracks
            }

            console.log('Media stream has been stopped.');
        } else {
            console.warn('Invalid media stream.');
        }
    }
    return (
        <>{loader ? <div className='loaderHead'>
            <div className="loader"></div>
        </div> : null}

            <div className="picBox">
            {showpic ?  <h1 className="text-primary">Source Image</h1>:null}
                <div className='video' style={{ display: isPTagHidden ? 'none' : 'flex' }}>
                    <video id="camera-stream" autoPlay playsInline></video>
                    <ImageGallery imageDataUrls={imgArr} removeImage={removeImage} />

                    <canvas id="image-capture"></canvas>

                </div>
                {showpic ?
                    (
                        <>
                            {show ? <button onClick={captureImage} className="clickPic">{count}</button> : null}
                            {show ? null : <button onClick={send} className="btn btn-success ">Confirm</button>}
                        </>
                    ) : null}

                {/* {showres ? <p className="text-success">{showserver}</p> : null}
                    {showres ? <p className="text-danger">{serverErr}</p> : null} */}
            </div>

            <ToastContainer />
        </>
    );
}

export default TackPic;
