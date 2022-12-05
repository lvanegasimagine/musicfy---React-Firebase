import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import AlertErrors from "../../utils/AlertErrors";
import "./BannerHome.scss";

export default function BannerHome() {
  const storage = getStorage();
  const statsRef = ref(storage, "other/banner-home.jpg");

  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    getDownloadURL(statsRef)
      .then((url) => setBannerUrl(url))
      .catch((err) => AlertErrors(err.code));
  }, []);

  if(!bannerUrl) return null;

  return <div className="banner-home" style={{ backgroundImage: `url('${bannerUrl}')`}}/>;
}
