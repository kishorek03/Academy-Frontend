export const fetchUserDetails = async (token, setUser) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ name: payload.sub, id: payload.userId });
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
};

export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};
