import { Avatar, Button } from '@mui/material'
import React, { useState } from 'react'
import "./Tweetbox.css"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import db from "../../firebase"

const Tweetbox = () => {
    const [tweetMessage, setTweetMessage] = useState("");
    const [tweetImage, setTweetImage] = useState("");

    const sendTweet = (e) => {
        e.preventDefault();

        addDoc(collection(db, "posts"),{
            displayName: "Nissho Code",
            userName: "nissho_code",
            verified: true,
            text: tweetMessage,
            avatar: "https://yosshyjungle.sakura.ne.jp/oa_works/smile_man.png",
            image: tweetImage,
            timestamp: serverTimestamp(),
        });

        setTweetMessage("");
        setTweetImage("");
    };

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
                    />
                </div>
                <input
                    value={tweetImage}
                    className='tweetBox_imageInput'
                    placeholder='画像のURLを入力してください'
                    type="text"
                    onChange={(e) => setTweetImage(e.target.value)}
                />
                <Button
                    className='tweetBox_tweetButton'
                    type='submit'
                    onClick={sendTweet}
                >ツイートする</Button>
            </form>
        </div>
    )
}

export default Tweetbox