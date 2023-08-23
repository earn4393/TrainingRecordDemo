import axios from 'axios'

export default axios.create({
    // baseURL: 'http://10.201.133.65:3333/service2',
    // baseURL: 'http://10.201.128.66:3331/service2'
    baseURL: 'http://localhost:3333/service2'
})