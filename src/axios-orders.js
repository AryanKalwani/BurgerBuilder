import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-c6bb7.firebaseio.com/'
});

export default instance;