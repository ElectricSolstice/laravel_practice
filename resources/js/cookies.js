export function getCookie(cookieName) {
    var cookies = document.cookie.split(';');
    for (var cookie of cookies) {
        if (cookie.trim().indexOf(cookieName+"=") == 0) {
            return cookie.trim().slice(cookieName.length+1);
        }
    }
    return null;
}

export function setCookie(cookieName, value) {
    document.cookie = cookieName+"="+String(value)+"; path=/";
}
