import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CheckImg(props) {
    // const [showerror, seterror] = useState(null)
    const { email } = props
    const {showpic3} =props
    let [count, setcount] = useState(1)
    const [show, setshow] = useState(true)
    const [imageDataUrl, setimageDataUrl] = useState(null)
    const [showpic, setshowpic] = useState(false);
    const [loader, setloader] = useState(false)
    // const [serverErr, setserverErr] = useState(null)
    // const [showserver, setshowserver] = useState(null)
    // const [showres, setres] = useState(false)

    const videoRef = useRef(null);
    const streamRef = useRef(null);


    useEffect(() => {
        const startCamera = async () => {
            try {

                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const videoElement = videoRef.current;
                    setshowpic(true);
                    setloader(true)

                    if (videoElement) {
                        videoElement.srcObject = stream;
                        streamRef.current = stream;

                        videoElement.style.display = 'none';

                        videoElement.onloadedmetadata = () => {
                            // Show the video element
                            videoElement.style.display = 'block';
                            videoElement.play();  // Ensure video starts playing
                            setloader(false)

                        };

                    }
                    // else {
                    //     setshowpic(false);
                    //     setloader(false)
                    // }
                } else {
                    setshowpic(false);
                    notifiyErr("Camera API not supported by this browser.");
                }
            } catch (error) {
                setshowpic(false);
                notifiyErr("Error accessing the camera: reload the Browser " + error.message + "Reload the Browser and Try again");
            }
        };

        startCamera();
    }, [])


    function captureImage() {
        const canvas = document.getElementById('image-capture');
        const context = canvas.getContext('2d');
        const video = document.getElementById('camera-stream');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        setimageDataUrl(canvas.toDataURL('image/png'))


        setcount((pre) => pre - 1)
        // console.log(count)

    }
    useEffect(() => {
        if (count === 0) {
            setshow(false);
        }
    }, [count]);
    function notifiyErr(err) {
        toast.error(err, {
            position: "top-right",
            autoClose: 10000,
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
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
            transition: Flip,
        });
    }

    async function send() {
        // console.log("send")
        // console.log(imageDataUrl)
        setloader(true)
        try {
            const response = await fetch('https://employee-management-backend-2-bf4e.onrender.com/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "target_image": imageDataUrl, 'email': email }),
            });
            if (response.ok) {
                const data = await response.json();
                // console.log(data)
                if (data.error) {
                    setimageDataUrl(null)
                    // setserverErr(data.error)
                    notifiyErr(data.error)
                    setcount((pre) => pre + 1)
                    if (show === false) {
                        setshow(true);
                    }
                    console.log(count)
                    // setres(true)

                }
                else {
                    // console.log(data)
                    notifiysuccess(data.message)
                    // setserverErr(null)
                    // setshowserver(data.message)
                    closeMediaStream(streamRef.current)
                    setshowpic(false)
                    showpic3()
                    // setres(true)
                }

            }
        }

        catch (error) {
            console.log(error)
            notifiyErr(error)


        } finally {
            setloader(false)
        }

    }
    function closeMediaStream(stream) {
        // Check if the stream is valid and has tracks
        if (stream && typeof stream.getTracks === 'function') {
            // Stop all tracks (audio and video) in the stream
            const tracks = stream.getTracks();
            tracks.forEach(track => {
                console.log('Stopping track:', track);
                track.stop();
            });
    
            // Log to check if the stream is inactive after stopping
            console.log('Is stream active after stop?:', stream.active);  // Should be false
        } else {
            console.warn('Invalid media stream or no tracks found.');
        }
    
        if (stream && typeof stream.getTracks === 'function') {
            const activeTracks = stream.getTracks().filter(track => track.readyState === 'live');
            if (activeTracks.length > 0) {
                console.warn('Some tracks are still active:', activeTracks);
            } else {
                console.log('All media tracks stopped successfully.');
            }
        }
    }

    return <>
        {loader ? <div className='loaderHead'>
            <div className="loader"></div>
        </div> : null}
        {showpic ?
            <div className="picBox">
                <h1 className="text-primary">Attendance</h1>
                <video ref={videoRef} id="camera-stream" autoPlay ></video>

                {show ? <button onClick={captureImage} className="clickPic">{count}</button> : null}
                {show ? null : <button onClick={send} className="btn btn-success">conform</button>}
                <canvas id="image-capture"></canvas>

                {/* {showres ? <p className="text-danger ">{serverErr}</p> : null}
                {showres ? <p className="text-success ">{showserver}</p> : null}*/}
            </div> : null}
        <ToastContainer />
    </>



}


export default CheckImg;