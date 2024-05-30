import axios from "axios";

export default axios.interceptors.response.use(resp => resp, async error => {
    console.clear()
})