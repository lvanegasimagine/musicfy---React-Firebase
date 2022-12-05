/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { map, size } from "lodash";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import "./BasicSliderItems.scss";
import AlertErrors from "../../../utils/AlertErrors";

export default function BasicSliderItems({
  title,
  data,
  folderImage,
  urlName,
}) {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  if (size(data) < 5) return null;

  return (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <RenderItem
            key={item.id}
            item={item}
            folderImage={folderImage}
            urlName={urlName}
          />
        ))}
      </Slider>
    </div>
  );
}

function RenderItem({ item, folderImage, urlName }) {
  const storage = getStorage();
  const statsRef = ref(storage, `/${folderImage}/${item.banner}`);

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    getDownloadURL(statsRef)
      .then((url) => setImageUrl(url))
      .catch((err) => AlertErrors(err.code));
  }, [item, folderImage]);

  return (
    <Link to={`/${urlName}/${item.id}`}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <h3>{item.name}</h3>
      </div>
    </Link>
  );
}
