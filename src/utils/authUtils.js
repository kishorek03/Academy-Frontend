export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};
