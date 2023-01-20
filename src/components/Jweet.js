import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

const Jweet = ({ jweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newJweet, setNewJweet] = useState(jweetObj.text);
  const jweetTestRef = doc(dbService, "jweets", `${jweetObj.id}`);

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewJweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(jweetTestRef, { text: newJweet });
    setEditing(false);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this jweet?");
    if (ok) {
      // delete
      await deleteDoc(jweetTestRef);
      if (jweetObj.attachmentUrl)
        await deleteObject(ref(storageService, jweetObj.attachmentUrl));
    }
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your jweet"
              value={newJweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Udate Jweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{jweetObj.text}</h4>
          {jweetObj.attachmentUrl && (
            <img src={jweetObj.attachmentUrl} alt="게시물 사진" width="100px" />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit</button>
              <button onClick={onDeleteClick}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Jweet;
