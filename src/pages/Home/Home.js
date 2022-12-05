/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { map } from "lodash";
import BannerHome from "../../components/BannerHome";
import "firebase/firestore";
import "./Home.scss";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";

export default function Home() {
  const [artists, setArtists] = useState([]);
  const [album, setAlbum] = useState([]);
  const db = getFirestore();
  console.log("🚀 ~ file: Home.js:13 ~ Home ~ album", album);

  useEffect(() => {
    (async () => {
      const artistSnapshot = await getDocs(collection(db, "artists"));
      const arrayArtists = [];
      map(artistSnapshot?.docs, (artist) => {
        const data = artist.data();
        data.id = artist.id;
        arrayArtists.push(data);
      });
      setArtists(arrayArtists);
    })();
  }, []);

  useEffect(() => {
    getDocs(collection(db, "album"))
      .then((response) => {
        const arrayAlbum = [];
        map(response?.docs, (album) => {
          const data = album.data();
          data.id = album.id;
          arrayAlbum.push(data);
        });
        setAlbum(arrayAlbum);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Ultimos artistas"
          data={artists}
          folderImage="artist"
          urlName="artist"
        />
        <BasicSliderItems
          title="Ultimos Albumes"
          data={album}
          folderImage="album"
          urlName="album"
        />
      </div>
    </>
  );
}
