import { Avatar, Button, CircularProgress } from '@mui/material'
import React, { useRef, useState } from 'react'
import "./Tweetbox.css"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import db from "../../firebase"

const Tweetbox = () => {
    const [tweetMessage, setTweetMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const [showCamera, setShowCamera] = useState(false);
    const [videoRef, setVideoRef] = useRef(null);
    const [streamRef, setstreamRef] = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("ファイルサイズは5MB以下にしてください");
                return;
            }
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("ファイルサイズは5MB以下にしてください");
                return;
            }
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const sendTweet = async (e) => {
        e.preventDefault();
        if (!tweetMessage && !imageFile) {
            setError("テキストか画像を入力してください");
            return;
        }

        setLoading(true);

        try {
            let base64Image = "";
            if (imageFile) {
                if (imageFile.size > 5 * 1024 * 1024) {
                    setError("ファイルサイズは5MB以下にしてください");
                    setLoading(false);
                    return;
                }
                base64Image = await convertToBase64(imageFile);
            }

            await addDoc(collection(db, "posts"), {
                displayName: "Nissho Code",
                userName: "nissho_code",
                verified: true,
                text: tweetMessage,
                avatar: "https://yosshyjungle.sakura.ne.jp/oa_works/smile_man.png",
                image: base64Image,
                timestamp: serverTimestamp(),
            });

            setTweetMessage("");
            setImageFile(null);
            setPreview("");
            setError("");
        } catch (err) {
            setError("投稿に失敗しました。再度お試しください。");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCameraError = (err) => {
        let message = "カメラの起動に失敗しました。";

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            message = "カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。";
        } else if (err.name === "NotFoundError") {
            message = "カメラが見つかりません。デバイスを確認できません。";
        } else if (err.name === "NotReadableError") {
            message = "カメラにアクセスできません。他のアプリケーションが使用中かもしれません。";
        }

        setError(message);
        console.log(err);
        setShowCamera(false);
    };

    const startCamera = async () => {
        try {
            setShowCamera(true);

            setTimeout(async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        streamRef.current = stream;
                    }
                } catch (err) {
                    handleCameraError(err);
                }
            }, 100);
        } catch (err) {
            handleCameraError(err);
        }
    };

    const takePicture = () => {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg");
        setPreview(imageData);

        canvas.toBlob((blob) => {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setImageFile(file);
        }, "image/jpeg");
        stopCamera();
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            setShowCamera(false);
        }
    };

    const handleVideoLoad = () => {
        videoRef.current?.play()
            .catch(err => {
                console.error("Video playback failed:", err);
                setError("カメラの起動に失敗しました。");
            });
    }

    return (
        <div className='tweetBox'>
            <form>
                <div className="tweetBox_input">
                    <Avatar />
                    <input
                        value={tweetMessage}
                        placeholder='いまどうしてる'
                        type="text"
                        onChange={(e) => setTweetMessage(e.target.value)}
                        required
                    />
                </div>
                <div className='tweetBox_imageInputContainer'>
                    <input
                        className='tweetBox_imageInput'
                        type="file"
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                </div>
                {preview && (
                    <div className='tweetBox_preview'>
                        <img
                            src={preview}
                            alt="preview"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                    </div>
                )}
                {error && <p className='tweetBox_error'>{error}</p>}
                <Button
                    className='tweetBox_tweetButton'
                    type='submit'
                    onClick={sendTweet}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "ツイートする"}
                </Button>
            </form>
        </div>
    )
}

export default Tweetbox