import axios from 'axios';
// import Router from 'vue-router'
// const login = () => import('../views/login/login.vue')

// axios.defaults.baseURL = "http://192.168.1.233:8080";
axios.defaults.baseURL = "http://192.168.1.198:8080";
// axios.defaults.baseURL = 'http://192.168.1.107:8081';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
if (window.localStorage.getItem('token')) {
	Axios.defaults.headers.common['Authorization'] = `Bearer ` + window.localStorage.getItem('token')
}

axios.defaults.withCredentials = true
export default {
	restfullCall: function (url, body, method, dataFormat) {
    axios({
      method: method,
      url: url,
      data: body
    })
		.then(res => {
			//返回是否是203？跳转到login
			// console.log(res.status)
		if(res.status==203){
			window.location="/#/login"
		}else{
			dataFormat(res);
		}
      })
      .catch(error => {
				console.log(error);
				window.location = "/#/login"
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