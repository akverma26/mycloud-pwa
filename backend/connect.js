// const SERVER_URL = "http://localhost:3000";
const SERVER_URL = "https://akvcloudapi.herokuapp.com";

const fetchFromAPI = (url, options) => {
    let _options = {
        ...options
    };

    return fetch(
        `${SERVER_URL}${url}`,
        _options
    )
}