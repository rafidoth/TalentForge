import api from "./index";

export function loginWithGoogle() {
    const returnUrl = encodeURIComponent(window.location.origin + "/");
    window.location.href = `${import.meta.env.VITE_API_URL}/login/google?provider=Google&returnUrl=${returnUrl}`;
}