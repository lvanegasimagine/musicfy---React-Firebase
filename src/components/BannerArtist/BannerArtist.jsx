/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import AlertErrors from "../../utils/AlertErrors";
import "./BannerArtist.scss";

export default function BannerArtist({ artist }) {
  const storage = getStorage();
  const statesRef = ref(storage, `/artist/${artist?.banner}`);
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    getDownloadURL(statesRef)
      .then((url) => setBannerUrl(url))
      .catch((err) => AlertErrors(err.code));
  }, []);

  return (
    <div
      className="banner-artist"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    >
      <div className="banner-artist__gradient" />
      <div className="banner-artist__info">
        <h4>ARTISTA</h4>
        <h1>{artist.name}</h1>
      </div>
    </div>
  );
}
