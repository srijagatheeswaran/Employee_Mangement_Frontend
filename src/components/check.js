import { useEffect, useState, useRef } from "react";

function CheckImg(props) {
    const [showerror, seterror] = useState(null)
    const { email } = props
    let [count, setcount] = useState(1)
    const [show, setshow] = useState(true)
    const [imageDataUrl, setimageDataUrl] = useState(null)
    const [showpic, setshowpic] = useState(false);
    const [loader, setloader] = useState(false)
    const [serverErr, setserverErr] = useState(null)
    const [showserver, setshowserver] = useState(null)
    const [showres, setres] = useState(false)

    const videoRef = useRef(null);
    const streamRef = useRef(null);


    useEffect(() => {
        const startCamera = async () => {
            try {

                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const videoElement = videoRef.current;

                    if (videoElement) {
                        videoElement.srcObject = stream;
                        streamRef.current = stream;

                        videoElement.style.display = 'none';

                        videoElement.onloadedmetadata = () => {
                            setshowpic(true);

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
        console.log(count)

    }
    useEffect(() => {
        if (count === 0) {
            setshow(false);
        }
    }, [count]);

    async function send() {
        // console.log("send")
        // console.log(imageDataUrl)
        setloader(true)
        try {
            const response = await fetch('http://127.0.0.1:5000/compare', {
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
                    setserverErr(data.error)
                    setcount((pre) => pre + 1)
                    if (show === false) {
                        setshow(true);
                    }
                    console.log(count)
                    setres(true)

                }
                else {
                    console.log(data)
                    setserverErr(null)
                    setshowserver(data.message)
                    closeMediaStream(streamRef.current)
                    setres(true)
                }

            }
        }

        catch (error) {
            console.log(error)

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

    return <>
        {loader ? <div className='loaderHead'>
            <div className="loader"></div>
        </div> : null}
        {showerror ?
            <div className="error mt-5"><h1 className="text-danger">{showerror}</h1></div> :
            <div className="picBox">
                <h1 className="text-primary">Attendance</h1>
                <video ref={videoRef} id="camera-stream" autoPlay ></video>
                {showpic ? (
                    <>
                        {show ? <button onClick={captureImage} className="clickPic">{count}</button> : null}
                        {show ? null : <button onClick={send} className="btn btn-success">conform</button>}
                        <canvas id="image-capture"></canvas>
                    </>
                ) : (
                    <div className="Waiting"><h1>Waiting for camera permission...</h1></div>
                )}
                {showres ? <p className="text-danger ">{serverErr}</p> : null}
                {showres ? <p className="text-success ">{showserver}</p> : null}
            </div>}
    </>



}


export default CheckImg;