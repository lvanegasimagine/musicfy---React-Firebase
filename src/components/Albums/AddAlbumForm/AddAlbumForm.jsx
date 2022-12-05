/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from "react";
import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { map } from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import NoImage from "../../../assets/png/no-image.png";
import "./AddAlbumForm.scss";

export default function AddAlbumForm({ setShowModal }) {
  const [artists, setArtists] = useState([]);
  const [albumImage, setAlbumImage] = useState(null);
  const [formData, setFormData] = useState(initialValueForm());
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    getDocs(collection(db, "artists"))
      .then((response) => {
        const arrayArtists = [];
        map(response?.docs, (artist) => {
          const data = artist.data();
          arrayArtists.push({
            key: artist.id,
            value: artist.id,
            text: data.name,
          });
        });
        setArtists(arrayArtists);
      })
      .catch((err) => console.log(err));
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setAlbumImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    if (!file) return toast.error("Subi una imagen primero!");
    const storageRef = ref(storage, `/album/${fileName}`);
    return uploadBytesResumable(storageRef, file);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.artist)
      return toast.warning("El nombre del album y del artista es obligatoria");
    if (!file) return toast.warning("La imagen del album es obligatoria");
    setIsLoading(true);
    const fileName = uuidv4();
    uploadImage(fileName)
      .then(async () => {
        await addDoc(collection(db, "album"), {
          name: formData.name,
          artist: formData.artist,
          banner: fileName,
        })
          .then(() => {
            toast.success("Album Creado");
            resetForm();
            setIsLoading(false);
            setShowModal(false);
          })
          .catch(() => {
            toast.error("Error al crear el Album");
            setIsLoading(false);
          });
      })
      .catch(() => {
        toast.error("Error al subir la imagen.");
        setIsLoading(false);
      });
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setAlbumImage(null);
  };

  return (
    <Form className="add-album-form" onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar" width={5}>
          <div
            {...getRootProps()}
            className="avatar"
            style={{ backgroundImage: `url('${albumImage}')` }}
          />
          <input type="text" {...getInputProps()} />
          {!albumImage && <Image src={NoImage} />}
        </Form.Field>
        <Form.Field className="album-inputs" width={11}>
          <Input
            placeholder="Nombre del album"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Dropdown
            placeholder="El album pertenece..."
            fluid
            search
            selection
            lazyLoad
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
            options={artists}
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isLoading}>
        Crear album
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    artist: "",
  };
}
