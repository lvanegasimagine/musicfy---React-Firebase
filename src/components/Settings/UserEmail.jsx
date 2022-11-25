import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import AlertErrors from "../../utils/AlertErrors";
import {
  getAuth,
  sendEmailVerification,
  signOut,
  updateEmail,
} from "firebase/auth";

export default function UserEmail({
  user,
  setShowModal,
  setTitleModal,
  setContentModal,
}) {
  const onEdit = () => {
    setTitleModal("Actualizar Email");
    setContentModal(
      <ChangeEmailForm email={user.email} setShowModal={setShowModal} />
    );
    setShowModal(true);
  };

  return (
    <div className="user-email">
      <h3>Email: {user.email}</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeEmailForm({ email, setShowModal }) {
  const auth = getAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!formData.email) {
      toast.warning("El email es el mismo");
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          updateEmail(auth.currentUser, formData.email)
            .then(() => {
              toast.success("Email Actualizado");
              setIsLoading(false);
              setShowModal(false);
              sendEmailVerification(auth.currentUser).then(() => signOut(auth));
            })
            .catch((err) => {
              AlertErrors(err?.code);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          AlertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={email}
          type="text"
          name="email"
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          icon={
            <Icon
              name={showPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />
          }
          name="password"
          onChange={handleChange}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar Email
      </Button>
    </Form>
  );
}
