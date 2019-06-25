import axios from 'axios';
class Service {
	getRestClient () {
		if (!this.serviceInstance) {
			this.serviceInstance = axios.create({
				baseURL: process.env.REACT_APP_PLMUNORA_API,
				timeout: 10000,
				headers: {},
			});
		}
		return this.serviceInstance;
	}
	getFileDlClient () {
		if (!this.serviceInstance) {
			this.serviceInstance = axios.create({
				baseURL: process.env.REACT_APP_REST_API_LOCATION,
				timeout: 10000,
				headers: {},
			});
		}
		return this.serviceInstance;
	}
}

export default new Service();
