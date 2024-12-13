export const decodeToken = (token) =>
  JSON.parse(decodeURIComponent(escape(atob(token.split(".")[1]))));



