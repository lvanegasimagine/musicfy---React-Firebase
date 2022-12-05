/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { map } from "lodash";
import { Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import AlertErrors from "../../utils/AlertErrors";
import "./Artists.scss";

export default function Artists() {
  const db = getFirestore();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const artistSnapshot = await getDocs(collection(db, "artists"));
        const arrayArtists = [];
        map(artistSnapshot?.docs, (artist) => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });

        setArtists(arrayArtists);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="artists">
      <h1>Artistas</h1>
      <Grid>
        {map(artists, (artist) => (
          <Grid.Column key={artist.id}  mobile={8} tablet={4} computer={3}>
            <Artist artist={artist} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

function Artist({ artist }) {
  const storage = getStorage();
  const refStats = ref(storage, `/artist/${artist.banner}`);
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    getDownloadURL(refStats)
      .then((url) => setBannerUrl(url))
      .catch((err) => AlertErrors(err.code));
  }, [artist]);

  return (
    <Link to={`/artist/${artist.id}`}>
      <div className="artists__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${bannerUrl}')` }}
        />
        <h3>{artist.name}</h3>
      </div>
    </Link>
  );
}
