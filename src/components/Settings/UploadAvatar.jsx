/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from "react";
import { Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import firebase from "../../utils/Firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";

import NoAvatar from "../../assets/png/user.png";

export default function UploadAvatar({ user, setReloadApp }) {
  const auth = getAuth();
  const storage = getStorage();

  const [avatarUrl, setAvatarUrl] = useState(user.photoURL);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarUrl(URL.createObjectURL(file));
    uploadImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (file) => {
    if (!file) {
      toast.error("Please upload an image first!");
    }
    const storageRef = ref(storage, `/avatar/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => toast.error("Error al actualizar el avatar"),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (url) => {
          await updateProfile(auth.currentUser, {
              photoURL: url,
            });
            setReloadApp((prevState) => !prevState);
          })
          .catch(() => toast.error("Error al actualizar al avatar"));
      }
    );
  };

  return (
    <div className="user-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image src={NoAvatar} />
      ) : (
        <Image src={avatarUrl ? avatarUrl : NoAvatar} />
      )}
    </div>
  );
}
