import { useState, useEffect } from "react";

const ImageGallery = ({ imageDataUrls, removeImage }) => {
    const [show, setshow] = useState(false)
    useEffect(() => {
        if (imageDataUrls.length !== 0) {
            setshow(true);
        } else {
            setshow(false);
        }
    }, [imageDataUrls]);
    // console.log(imageDataUrls)
    return (
        <>
            <div className="image-gallery">

                {show ? <p className="text-danger">Click the image for Remove</p> : null}
                {imageDataUrls.map((dataUrl, index) => (
                    <img key={index} src={dataUrl}
                        alt={`Captured Image ${index + 1}`}
                        onClick={() => removeImage(index)} />
                ))}
            </div>
        </>
    );
};

export default ImageGallery;