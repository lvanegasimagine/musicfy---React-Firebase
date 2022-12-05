import React, { useState, useCallback } from "react";
import { Form, Input, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import NoImage from "../../../assets/png/no-image.png";
import "./AddArtistForm.scss";

export default function AddArtistForm({ setShowModal }) {
  const [formData, setFormData] = useState(initialValueForm());
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore();
  const storage = getStorage();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setBanner(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    if (!file) {
      toast.error("Please upload an image first!");
    }
    const storageRef = ref(storage, `/artist/${fileName}`);
    return uploadBytesResumable(storageRef, file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.warning("Añade el nombre del artista");
    } else if (!file) {
      toast.warning("Añade la imagen del artista");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName)
        .then(async () => {
          await addDoc(collection(db, "artists"), {
            name: formData.name,
            banner: fileName,
          })
            .then(() => {
              toast.success("Artista creado correctamente");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch((err) => {
              toast.error("Error al crear al artista");
              console.log(err);
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.error("Error al subir la imagen.");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setBanner(null);
  };
  return (
    <Form className="add-artist-form" onSubmit={handleSubmit}>
      <Form.Field className="artist-banner">
        <div
          {...getRootProps()}
          className="banner"
          style={{ backgroundImage: `url('${banner}')` }}
        />
        <Input {...getInputProps()} />
        {!banner && <Image src={NoImage} />}
      </Form.Field>
      <Form.Field className="artist-avatar">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
        />
      </Form.Field>
      <Form.Field>
        <Input
          onChange={(e) => setFormData({ name: e.target.value })}
          placeholder="Nombre del artista"
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Crear artista
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
  };
}
