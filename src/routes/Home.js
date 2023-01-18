import Jweet from "components/Jweet";
import { dbService, storageService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [jweet, setJweet] = useState("");
  const [jweets, setJweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    const dbJweets = query(
      collection(dbService, "jweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(dbJweets, (snapshot) => {
      const jweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJweets(jweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const jweetObj = {
      text: jweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "jweets"), jweetObj);
    setJweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setJweet(value);
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
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachmentClick = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={jweet}
          onChange={onChange}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Jweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="업로드 사진 미리보기" width="300px" />
            <button onClick={onClearAttachmentClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {jweets.map((jweetObj) => (
          <Jweet
            key={jweetObj.id}
            jweetObj={jweetObj}
            isOwner={jweetObj.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
