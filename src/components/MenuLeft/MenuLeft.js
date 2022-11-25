import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import "./MenuLeft.scss";
import { isUserAdmin } from "../../utils/Api";
import BasicModal from "../Modal/BasicModal/BasicModal";

function MenuLeft({ user, location }) {
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [userAdmin, setUserAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  useEffect(() => {
    isUserAdmin(user.uid).then((resp) => setUserAdmin(resp));
  }, [user]);

  const handlerMenu = (e, menu) => {
    setActiveMenu(menu.to);
  };

  const handlerModal = (type) => {
    console.log("🚀 ~ file: MenuLeft.js ~ line 25 ~ handlerModal ~ type", type);
    switch (type) {
      case "artist":
        setTitleModal("Nuevo Artista");
        setContentModal(<h2>Formulario nueva artista</h2>);
        setShowModal(true);
        break;
      case "song":
        setTitleModal("Nueva Canción");
        setContentModal(<h2>Formulario nueva canción</h2>);
        setShowModal(true);
        break;
      default:
        setTitleModal(null);
        setContentModal(null);
        setShowModal(false);
        break;
    }
  };

  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
          <Menu.Item
            as={Link}
            to="/"
            active={activeMenu === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" /> Inicio
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/artists"
            active={activeMenu === "/artists"}
            onClick={handlerMenu}
          >
            <Icon name="music" /> Artistas
          </Menu.Item>
        </div>
        {userAdmin ? (
          <div className="footer">
            <Menu.Item onClick={() => handlerModal("artist")}>
              <Icon name="plus square outline" />
              Nuevo Artista
            </Menu.Item>
            <Menu.Item onClick={() => handlerModal("song")}>
              <Icon name="plus square outline" />
              Nueva Cancion
            </Menu.Item>
          </div>
        ) : null}
      </Menu>
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default withRouter(MenuLeft);
