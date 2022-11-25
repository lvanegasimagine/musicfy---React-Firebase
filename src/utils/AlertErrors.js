import { toast } from "react-toastify";

export default function AlertErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warning("La contraseña introducida no es correcta.");
      break;
    case "auth/email-already-in-use":
      toast.warning("El nuevo Email ya existe.");
      break;
    default:
      toast.warning("Error del servidor, intentalo mas tarde");
      break;
  }
}
