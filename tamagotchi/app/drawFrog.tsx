import React, { useState } from "react";

// Define the types for the component
const ImageSelector = () => {
    // Initialize state with a default image
    const [selectedImage, setSelectedImage] = useState("image1.jpg");

    // Function to handle the selection change with event typing
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedImage(event.target.value);
    };

    return (

            <div>
                <img src={selectedImage} alt="Selected" width={300} />
            </div>
    );
};

export default ImageSelector;
