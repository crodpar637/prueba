function logMensaje(mensaje) {
  console.log(mensaje);
  // Otras opciones: agregar a fichero, enviar a otra parte,...
}

function logErrorSQL(err) {
  console.error("Error de MySQL:");
  console.error("Code:", err.code);
  console.error("Errno:", err.errno);
  console.error("SQL Message:", err.sqlMessage);
  console.error("SQL State:", err.sqlState);
  // Otras opciones: agregar a fichero, enviar a otra parte,...
}

module.exports = { logMensaje, logErrorSQL };
