import React from "react";
import { Modal, Icon } from "semantic-ui-react";
import "./BasicModal.scss";

export default function BasicModal({ show, setShow, title, children }) {
  const onCloseModal = () => {
    setShow(false);
  };
  return (
    <Modal open={show} onClose={onCloseModal} className="basic-modal" size="tiny">
      <Modal.Header>
        <h3>{title}</h3>
        <Icon name="close" onClick={onCloseModal} />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
}
