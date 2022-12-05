import { toast } from "react-toastify";

export default function AlertErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warning("La contraseña introducida no es correcta.");
      break;
    case "auth/email-already-in-use":
      toast.warning("El nuevo Email ya existe.");
      break;
    case "storage/object-not-found":
      toast.warning("El archivo no se encuentra");
      break;
    case "storage/unauthorized":
      toast.warning("El usuario no tiene permiso para acceder al objeto");
      break;
    case "storage/canceled":
      toast.warning("Carga Cancelada");
      break;
    case "storage/unknown":
      toast.warning(
        "Ocurrió un error desconocido, inspeccione la respuesta del servidor"
      );
      break;
    default:
      toast.warning("Error del servidor, intentalo mas tarde");
      break;
  }
}
