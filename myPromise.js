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