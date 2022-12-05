/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import BannerArtist from "../../components/BannerArtist/BannerArtist";
import "./Artist.scss";

function Artist({ match }) {
  const db = getFirestore();

  const [artist, setArtist] = useState(null);

  useEffect(() => {
    (async () => {
      const artistDoc = await getDoc(doc(db, "artists", match?.params?.id));

      if (artistDoc.exists()) {
        setArtist(artistDoc.data());
      } else {
        console.log("No existe");
      }
    })();
  }, [match]);

  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <h2>Mas Información...</h2>
    </div>
  );
}

export default withRouter(Artist);
