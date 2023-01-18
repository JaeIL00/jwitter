import { dbService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [jweet, setJweet] = useState("");
  const [jweets, setJweets] = useState([]);

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
    try {
      await addDoc(collection(dbService, "jweets"), {
        text: jweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setJweet("");
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setJweet(value);
  };
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
        <input type="submit" value="Jweet" />
      </form>
      <div>
        {jweets.map(({ id, text }) => (
          <div key={id}>
            <h4>{text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
