import { POSTGRES_URI } from "./config";

export const connectDB = async () => {
  //Conexion con la DB
  // Aca se conectaba la DB si no funciona bien el ORM
  console.log(POSTGRES_URI);
  
};