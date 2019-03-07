import axios from 'axios';
// axios.defaults.baseURL = "http://192.168.1.232:8080";
axios.defaults.baseURL = 'http://192.168.0.109:8080';
export default {
	restfullCall: function (url, body, method, dataFormat) {
    axios({
      method: method,
      url: url,
      data: body
    })
		.then(res => {
			dataFormat(res);
      })
      .catch(error => {
        // console.log(error);
      });
  },
  restfullCalls: function (url, body, method, dataFormat, parameter) {
		axios({
			method: method,
			url: url,
			data: body
		})
			.then(res => {
				dataFormat(res, parameter);
			})
			.catch(error => {
				// console.log(error);
			});
	}
};