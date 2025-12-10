// utils/jwt.js
export const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (e) {
    console.log(e);
    return null;
  }
};
