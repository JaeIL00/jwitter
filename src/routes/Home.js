import Jweet from "components/Jweet";
import JweetFactory from "components/JweetFactory";
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
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

  return (
    <div>
      <JweetFactory userObj={userObj} />
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
