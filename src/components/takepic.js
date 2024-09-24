import { useEffect, useState, useRef } from "react";
import "./css/tackpic.css";
import ImageGallery from "./imageGallery";


function TackPic(props) {
    const [showerror, seterror] = useState(null);
    const [count, setcount] = useState(3);
    const [show, setshow] = useState(true);
    const [imgArr, setImgArr] = useState([]);
    const { email } = props;
    const [showpic, setshowpic] = useState(false);
    const [loader, setloader] = useState(false)
    const [serverErr, setserverErr] = useState(null)
    const [showserver, setshowserver] = useState(null)
    const [showres, setres] = useState(false)
    // Create a ref for the video element
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                // Check if mediaDevices and getUserMedia are available
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const videoElement = videoRef.current;

                    if (videoElement) {
                        videoElement.srcObject = stream;
                        streamRef.current = stream;

                        // Initially hide the video element
                        videoElement.style.display = 'none';

                        // Wait for the video metadata to load
                        videoElement.onloadedmetadata = () => {
                            setshowpic(true);  // Now we are sure the video stream is ready

                            // Show the video element
                            videoElement.style.display = 'block';
                            videoElement.play();  // Ensure video starts playing
                        };
                    }
                } else {
                    seterror("Camera API not supported by this browser.");
                }
            } catch (error) {
                seterror("Error accessing the camera: " + error.message);
            }
        };

        startCamera();
    }, []);  // Empty dependency array ensures this effect runs once on mount

    function captureImage() {
        const canvas = document.getElementById('image-capture');
        const context = canvas.getContext('2d');
        const video = videoRef.current;

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
            const response = await fetch('http://127.0.0.1:5000/tackpic', {
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
                    setserverErr(data.error)
                    setres(true)
                }
                else {
                    console.log(data)
                    setshowserver(data)
                    closeMediaStream(streamRef.current)
                    setserverErr(null)
                    setres(true)
                }

            }
            else {
                const data = await response.json()
                console.log(data);
            }
        } catch (error) {
            console.log(error);


        } finally {
            setloader(false)

        }

    }
    function closeMediaStream(stream) {
        // Check if the stream is valid
        console.log(stream, stream.getTracks)
        if (stream && stream.getTracks) {
            const tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop();
            });

            console.log('Media stream has been stopped.');
        } else {
            console.warn('Invalid media stream.');
        }
    }
    return (
        <>{loader ? <div className='loaderHead'>
            <div className="loader"></div>
        </div> : null}
            {showerror ? (
                <div className="error mt-5"><h1 className="text-danger">{showerror}</h1></div>
            ) : (
                <div className="picBox">
                    <h1 className="text-primary">Source Image</h1>
                    <div className='video'>
                        <video ref={videoRef} id="camera-stream" autoPlay playsInline style={{ display: 'none' }}></video>
                        <ImageGallery imageDataUrls={imgArr} removeImage={removeImage} />

                        <canvas id="image-capture"></canvas>

                    </div>
                    {showpic ? (
                        <>
                            {show ? <button onClick={captureImage} className="clickPic">{count}</button> : null}
                            {show ? null : <button onClick={send} className="btn btn-success ">Confirm</button>}
                        </>
                    ) : (
                        <div className="Waiting"><h1>Waiting for camera permission...</h1></div>
                    )}
                    {showres ? <p className="text-success">{showserver}</p> : null}
                    {showres ? <p className="text-danger">{serverErr}</p> : null}
                </div>
            )}
        </>
    );
}

export default TackPic;
