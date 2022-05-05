import React from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4} from "uuid";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"

const FtweetFactory = ({userObj}) => {

    const [ftweet, setFtweet] = useState("");
    const [attachment, setAttachment] = useState("");


    const onSubmit = async (event) => {
        event.preventDefault();
        if (ftweet === ""){
            return ;
        }
        let attachmentUrl=""
        if (attachmentUrl !== ""){
        const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
        const response = await attachmentRef.putString(attachment, "data_url");
        attachmentUrl = await response.ref.getDownloadURL();
    }
        await dbService.collection("ftweets").add({
            text: ftweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        });
        setFtweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setFtweet(value);
    };

    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        if (Boolean(theFile)) {
            reader.readAsDataURL(theFile);
        }
    }

    const onClearAttachment = () => setAttachment("");
    
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
            <input
                className="factoryInput__input"
                value={ftweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxlength={120}
            />
            <input type="file" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img 
                        src={attachment} 
                        style={{
                            backgroundImage: attachment,
                        }}
                        alt=""
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                </div>
                </div>
            )}
        </form>
    );
}

export default FtweetFactory;