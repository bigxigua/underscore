var PENDDING = 'pendding';
var FULFILLED = 'success';
var REJECTED = 'failed';

var Promise = function (executor) {
	var state = PENDDING;
	var result = null;
	var handlers = [];

	var fulfill = function (value) {
		console.log(handlers, value)
		if(handlers.length > 0) {
			handlers.forEach((handle) => {
				result = value;
				handle.resolve(result)
			})
		}
		state = FULFILLED;
		result = value;
		handlers = [];
	};

	var reject = function (err) {
		state = REJECTED;
		result = err;
	};

	var resolve = function (value) {
		 try{
		 	 var then = getThen(value);
		 	 if(then) {
		 	 	doResolved(then.bind(value), resolve, reject);
		 	 } else {
		 	 	fulfill(value)
		 	 }
		 }catch(e){
		 	reject(e)
		 }
	};

	var doResolved = function (fn, resolvedHandle, rejectedHandle) {
		try{
			fn((value) => {
				resolvedHandle(value)
			}, (error) => {
				rejectedHandle(error)
			})
		} catch(e){
			rejectedHandle(e)
		}
	};

	var getThen = function (value) {
		var t = typeof value;
		if(value && (t === 'function' || t === 'object')) {
			var then = value.then;
			if(then) {
				return then
			}
		}
		return null;
	};


	this.then = function (successHandle, failedHandle) {
		return new Promise((resolve, reject) => {
			if(state == PENDDING) {
				handlers.push({
					resolve: successHandle,
					reject: failedHandle
				});
			}
			if(state == FULFILLED) {
				successHandle(result)
			}
			if(state == REJECTED) {
				failedHandle(result)
			}
		})
	};

	this.catch = function (fn) {

	};

	doResolved(executor, resolve, reject)

}

new Promise((resolve, reject) => {
	// resolve(1)
	setTimeout(() => {
		resolve(111)
	}, 1000)
}).then((d) => {
	
}, (err) => {
	console.log(err, 'fuck ERROR')
}).then((d) => {
	console.log('-----',d)
})
//Promise构造函数接受一个函数作为参数定义为fn
//fn有两个函数参数 resolve和reject
//resolve和reject的执行控制权在调用者手里
//Promise实例有then方法
//then方法接受同样一个函数thenHandle作为参数，并返回一个新的Promise实例
//then里的函数会在上一个resolve时被执行
// log(promise)
//同步时then方法何时被调用