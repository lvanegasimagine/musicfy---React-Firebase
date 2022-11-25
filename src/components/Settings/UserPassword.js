import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { getAuth, signOut, updatePassword } from "firebase/auth";
import { reauthenticate } from "../../utils/Api";
import AlertErrors from "../../utils/AlertErrors";

export default function UserPassword({
  setShowModal,
  setTitleModal,
  setContentModal,
}) {
  const onEdit = () => {
    setTitleModal("Actualizar Contraseña");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };

  return (
    <div className="user-password">
      <h3>Contraseña: *** *** *** ***</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangePasswordForm({ setShowModal }) {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    showCurrentPassword: false,
    showNewPassword: false,
    showRepeatPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { currentPassword, newPassword, repeatPassword } = formData;

  const { showCurrentPassword, showNewPassword, showRepeatPassword } =
    showPassword;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !repeatPassword) {
      toast.warning("Los campos son requeridos");
    } else if (currentPassword === newPassword) {
      toast.warning("La nueva contraseña no puede ser igual a la actual");
    } else if (newPassword !== repeatPassword) {
      toast.warning("Las nuevas contraseñas no son iguales");
    } else if (newPassword.length < 6) {
      toast.warning("La contraseña tiene que tener minimo 6 caracteres");
    } else {
      setIsLoading(true);
      reauthenticate(currentPassword)
        .then(() => {
          updatePassword(auth.currentUser, newPassword)
            .then(() => {
              toast.success("Contraseña actualizada");
              setIsLoading(false);
              setShowModal(false);
              signOut(auth)
            })
            .catch((err) => {
              AlertErrors(err?.code);
              setIsLoading(false);
            })
            .finally(() => {
              setIsLoading(false);
            });
        })
        .catch((err) => {
          AlertErrors(err?.code);
          setIsLoading(false);
        })
        .finally(() => setIsLoading(false));
    }
    console.log(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <Input
          name="currentPassword"
          placeholder="Contraseña Actual"
          type={showCurrentPassword ? "text" : "password"}
          icon={
            <Icon
              name={showCurrentPassword ? "eye slash outline" : "eye"}
              link
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  showCurrentPassword: !showCurrentPassword,
                })
              }
            />
          }
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Input
          name="newPassword"
          placeholder="Nueva Contraseña"
          type={showNewPassword ? "text" : "password"}
          icon={
            <Icon
              name={showNewPassword ? "eye slash outline" : "eye"}
              link
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  showNewPassword: !showNewPassword,
                })
              }
            />
          }
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Input
          name="repeatPassword"
          placeholder="Confirmar Contraseña"
          type={showRepeatPassword ? "text" : "password"}
          icon={
            <Icon
              name={showRepeatPassword ? "eye slash outline" : "eye"}
              link
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  showRepeatPassword: !showRepeatPassword,
                })
              }
            />
          }
          onChange={handleChange}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar Contraseña
      </Button>
    </Form>
  );
}
