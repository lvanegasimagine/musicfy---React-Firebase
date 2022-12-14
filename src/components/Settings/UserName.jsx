import React, { useState } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { getAuth, updateProfile } from "firebase/auth";

export default function UserName({
  user,
  setShowModal,
  setTitleModal,
  setContentModal,
  setReloadApp
}) {
  const onEdit = () => {
    setTitleModal("Actualizar Nombre");
    setContentModal(
      <ChangeDisplayNameForm
        displayName={user.displayName}
        setShowModal={setShowModal}
        setReloadApp={setReloadApp}
      />
    );
    setShowModal(true);
  };
  return (
    <div className="user-name">
      <h2>{user.displayName}</h2>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeDisplayNameForm({ displayName, setShowModal, setReloadApp }) {
  const auth = getAuth();
  const [formData, setFormData] = useState({ displayName: displayName });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!formData.displayName || formData.displayName === displayName) {
      setShowModal(false);
    } else {
      setIsLoading(true);
      updateProfile(auth.currentUser, {
        displayName: formData.displayName,
      })
        .then(() => {
          toast.success("Nombre Actualizado");
          setReloadApp((prevState) => !prevState);
          setIsLoading(false);
          setShowModal(false);
        })
        .catch(() => toast.error("Error al actualizar el nombre"))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={formData.displayName}
          onChange={(e) => setFormData({ displayName: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar nombre
      </Button>
    </Form>
  );
}
