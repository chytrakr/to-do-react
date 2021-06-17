import axios from 'axios';

let base = 'http://localhost:3000/api/v1/';

export default function api(url, method='GET', data={}) {

	return new Promise(function(resolve, reject) {
	    const requestOptions = {
	    	url: base + url,
	        method: method,
	        headers: {
	        	'Content-Type': 'application/json'
	        },
	        data
	    };

	    axios(requestOptions)
	  	.then(function (response) {
			resolve(response.data);
	  	})
		.catch(function (error) {
			reject(error);
		});
	});
}

export function AddToDoAPI(data) {
    return new Promise(function(resolve, reject) {
        api(`to-do/add?id=${localStorage.userId ? localStorage.userId : ''}`, 'POST', data)
        .then((resp) => {
            return resolve(resp);
        }, (error) => {
            return reject(error.response.data.message);
        })
    })
}

export function GetToDoListAPI(tag='') {
    return new Promise(function(resolve, reject) {
        api(`to-do/list?id=${localStorage.userId ? localStorage.userId : ''}&tag=${tag}`)
        .then((resp) => {
            return resolve(resp);
        }, (error) => {
            console.log(error)
            debugger
            return reject(error.response.data.message);
        })
    })
}

export function UpdateToDoAPI(data, toDoId) {
    return new Promise(function(resolve, reject) {
        api(`to-do/done/${localStorage.userId}/${toDoId}`, 'PUT', data)
        .then((resp) => {
            return resolve(resp);
        }, (error) => {
            return reject(error.response.data.message);
        })
    })
}

export function DeleteToDoAPI(toDoId) {
    return new Promise(function(resolve, reject) {
        api(`to-do/delete/${localStorage.userId}/${toDoId}`, 'PUT', {})
        .then((resp) => {
            return resolve(resp);
        }, (error) => {
            return reject(error.response.data.message);
        })
    })
}