import { Search } from '@mui/icons-material'
import React, { useEffect } from 'react'
import "./Widgets.css"

const Widgets = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div className='widgets'>
            <div className="widgets_input">
                <Search className='widgets_searchIcon' />
                <input placeholder='キーワード検索' type="text" />
            </div>
            <div className="widgets_widgetContainer">
                <h2>いまどうしてる？</h2>
                <div>
                    <blockquote className='twitter-tweet'>
                        <a href="https://twitter.com/user/status/1716358192198975961"></a>
                    </blockquote>
                </div>
                {/* <div>
                    <a className="twitter-timeline"
                        data-height="400"
                        href="https://twitter.com/ariyoshihiroiki">
                    </a>
                </div> */}
                <div>
                    <a href="https://twitter.com/share"
                        className='twitter-share-button'
                        data-text="#React.js勉強中"
                        data-via="ariyoshihiroiki"
                    >Tweet
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Widgets