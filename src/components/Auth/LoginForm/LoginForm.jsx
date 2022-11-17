import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import "./LoginForm.scss";

export default function LoginForm({ setSelectedForm }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(defaultValueForm());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);

  const auth = getAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
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

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);

      const { email, password } = formData;
      signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          setUser(response.user);
          setUserActive(response.user.emailVerified);

          if (!response.user.emailVerified) {
            toast.warning(
              "Para poder hacer login antes tienes que verificar la cuenta."
            );
          }
        })
        .catch((err) => {
          console.log("aca", err);
          handlerErrors(err.code);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleShowPassword = (_) => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <h1>Musica para todos.</h1>

      <Form onSubmit={handleSubmit} onChange={handleChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo Electronico"
            icon="mail outline"
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
          />
          {formError.password && (
            <span className="error-text">
              Elige una contraseña superior a 5 caracteres
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>Iniciar Sesión</Button>
      </Form>
      {!userActive ? (
        <ButtonResetSendEmailVerification
          user={user}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        ></ButtonResetSendEmailVerification>
      ) : null}
      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          No tienes cuenta?{" "}
          <span onClick={() => setSelectedForm("register")}>Registrarte</span>
        </p>
      </div>
    </div>
  );
}

function ButtonResetSendEmailVerification({
  user,
  setIsLoading,
  setUserActive,
}) {
  const resendVerificationEmail = () => {
    sendEmailVerification(user)
      .then(() => {
        toast.success("Se ha enviado el email de verificacion");
      })
      .catch((err) => {
        handlerErrors(err.code);
      })
      .finally(() => {
        setIsLoading(false);
        setUserActive(true);
      });
  };

  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el email de verificacion puedes volver a enviarlo
        haciendo click <span onClick={resendVerificationEmail}>Aquí.</span>
      </p>
    </div>
  );
}

function handlerErrors(code) {
  switch (code) {
    case "auth/wrong-password":
    case "auth/user-not-found":
      toast.warning("El usuario o contraseña son incorrecto.");
      break;

    case "auth/too-many-requests":
      toast.error(
        "Has enviado demasiadas solicitudes de reenvio de email de confirmacion en muy poco tiempo"
      );
      break;
    default:
      break;
  }
}
function defaultValueForm() {
  return {
    email: "",
    password: "",
  };
}
