import { wrap, header, footer, card, spacer, label, heading, para, btn, C } from "./base";

export const urgenciaActivacion = (nombre: string) => wrap(`
  ${header()}
  ${card(`
    ${label("Activación", C.gold)}
    ${heading("Tu transformación te está esperando")}
    ${para(`Hola, <strong>${nombre}</strong>,`)}
    ${para(`Te registraste pero todavía no activaste tu programa. Todavía podés hacerlo — y los primeros 7 días son clave.`)}
    ${para(`Quienes empiezan en los primeros 7 días tienen <strong>3x más probabilidad</strong> de completar la transformación.`)}
    ${para(`Tu código de activación te espera. Es un momento de 5 minutos que puede cambiar tu próximo mes.`)}
    ${btn("Activar mi programa", "https://ien.app/activar", C.gold)}
  `, C.gold)}
  ${spacer()}
  ${footer()}
`);
