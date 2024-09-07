import Resizer from "react-image-file-resizer";

const resizeFile = (file: Blob, size: number = 200) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            size,
            size,
            "JPEG",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });

export default resizeFile;