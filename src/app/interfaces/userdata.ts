
//Interfaz para hacer Register, LogIn y donde se actualizan los pokemon favoritos
export default interface Userdata {
  id? : string;
  email: string;
  favorites?: string[];
}
