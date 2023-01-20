import Jweet from "components/Jweet";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const onLonOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const [jweets, setJweets] = useState([]);
  useEffect(() => {
    const dbJweets = query(
      collection(dbService, "jweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(dbJweets, (snapshot) => {
      const jweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJweets(jweetArr);
    });
  }, [userObj]);

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
      alert("Name change completed.");
    } else {
      alert("This is the same name as your current name.");
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update profile" />
      </form>
      <button onClick={onLonOutClick}>Log out</button>
      <div>
        {jweets.map((jweetObj) => (
          <Jweet
            key={jweetObj.id}
            jweetObj={jweetObj}
            isOwner={jweetObj.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Profile;
