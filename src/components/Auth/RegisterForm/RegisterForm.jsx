import React, { useState } from "react";
import firebase from "../../../utils/Firebase";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { validateEmail } from "../../../utils/Validations";

import "./RegisterForm.scss";

export default function RegisterForm({ setSelectedForm }) {
  const [formData, setFormData] = useState(defaultValueForm());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowPassword = (_) => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setFormError({});
    let errors = {};
    let formOk = true;

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }

    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }

    if (formData.username.trim() === "") {
      errors.username = true;
      formOk = false;
    }

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then(() => {
          toast.success("Usuario Registrado");
          changeUserName();
          sendVerificationEmail();
        })
        .catch((err) => toast.error("Error Creando la cuenta", err))
        .finally(() => {
          setIsLoading(false);
          setSelectedForm(null);
        });
    }
  };

  const changeUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: formData?.username,
    }).catch(_ => toast.error("Error al asignar el nombre de usuario"));
  };

  const sendVerificationEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      toast.success("Se ha enviado correo de verificacion, revisa tu bandeja de entrada")
    })
    .catch((err) => {
      toast.error("Error al enviar el email de verificacion")
    })
  }

  return (
    <div className="register-form">
      <h1>Empieza a escuchar con una cuenta de Musicfy gratis</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo Electronico"
            icon="mail outline"
            onChange={handleChange}
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, introduce un email valido
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            error={formError.password}
            icon={
              showPassword ? (
                <Icon
                  name="eye slash outline"
                  link
                  onClick={handleShowPassword}
                />
              ) : (
                <Icon name="eye" link onClick={handleShowPassword} />
              )
            }
            onChange={handleChange}
          />
          {formError.password && (
            <span className="error-text">
              Elige una contraseña superior a 5 caracteres
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type="text"
            name="username"
            placeholder="Como deberiamos llamarte?"
            icon="user circle outline"
            onChange={handleChange}
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">Por favor, introduce un nombre</span>
          )}
        </Form.Field>
        <Button type="submit" onClick={onSubmit} loading={isLoading}>
          Continuar
        </Button>
      </Form>

      <div className="register-form__options">
        <p onClick={() => setSelectedForm(null)}>volver</p>
        <p>
          Ya tiene musicfy?
          <span onClick={() => setSelectedForm("login")}>Inciar Sesion</span>
        </p>
      </div>
    </div>
  );
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: "",
  };
}
