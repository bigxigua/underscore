var root = this;
var log = function(...content) {
	console.log(...content)
}

var _ = function(option) {
	this.option = option;
}

var isArray = Array.isArray;
var isObject = function(obj) {
	return obj.constructor === Object;
}

if (typeof exports !== 'undefined') {
	if (module && module.exports) {
		exports = module.exports = _;
	}
	exports._ = _;
} else {
	root._ = _;
}

_.keys = function(obj) {
	if (!isObject(obj)) return '';
	var keys = [];
	for (var key in obj) {
		if (!keys[key]) {
			keys.push(key)
		}
	}
	return keys;
}

_.each = function(arr, cb) {
	if (isArray(arr)) {
		for (var i = 0; i < arr.length; i++) {
			cb(arr[i], i, arr);
		}
	} else {
		var keys = _.keys(arr);
		for (var i = 0; i < keys.length; i++) {
			cb(keys[i], arr[keys[i]], arr);
		}
	}
	return arr;
}

_.map = function(arr, cb) {
	var result = [];
	if (isArray(arr)) {
		var _arr_ = arr.concat([]);
		for (var i = 0; i < _arr_.length; i++) {
			result.push(cb(_arr_[i], i, _arr_));
		}
	} else {
		var keys = _.keys(arr);
		for (var i = 0; i < keys.length; i++) {
			result.push(cb(keys[i], arr[keys[i]], arr));
		}
	}
	return result;
}

_.reduce = function(arr, cb, accumulator) {
	var accumulator = accumulator || '';
	if (isArray(arr)) {
		var beginIndex = accumulator ? 0 : 1;
		accumulator = accumulator || arr[0];
		for (var i = beginIndex; i < arr.length; i++) {
			accumulator = cb(accumulator, arr[i], i, arr);
		}
	}
	return accumulator;
}

_.reduceRight = function(arr, cb, accumulator) {
	var accumulator = accumulator || '';
	if (isArray(arr)) {
		var length = arr.length;
		var beginIndex = accumulator.length > 0 ? length - 2 : length - 1;
		accumulator = accumulator.length > 0 ? accumulator : arr[length - 1];
		for (var i = beginIndex; i > 0; i--) {
			accumulator = cb(accumulator, arr[i - 1], i, arr);
		}
	}
	return accumulator;
}

_.find = function(arr, cb) {
	var result;
	if (isArray(arr)) {
		_.each(arr, (item, i) => {
			if (cb(item, i, arr)) {
				result = item;
			}
		})
	}
	return item
}



_.clone = function(obj) {
	var _obj_ = {};
	for (var key in obj) {
		if (obj[key] && obj[key].constructor == 'Object') {
			arguments.callee(obj[key])
		} else {
			_obj_[key] = obj[key]
		}
	}
	return _obj_;
}

_.memozie = function(fn) {
	var cache = {};
	return function() {
		cache[arguments] ? {} : cache[arguments] = fn.apply(this, arguments);
		return cache[arguments];
	}
}

//函数节流是指在一段时间间隔内只会触发一次事件执行
_.throttle = function(fn, wait, immediately) {
	var latestTime = Date.now(),
		immediately = immediately;
	return function() {
		if (!immediately) {
			fn.apply(this, arguments);
			immediately = true;
		} else {
			var curTime = Date.now();
			if (curTime >= latestTime + wait) {
				fn.apply(this, arguments);
				latestTime = curTime;
			}
		}
	}
}

//函数防抖是指函数多次被触发时不执行，等待函数不被触发后过一定时间间隔后执行一次
_.debunce = function(fn, wait, immediately) {
	var timer = null,
		immediately = immediately;
	return function() {
		if (immediately) {
			fn.apply(this, arguments);
			immediately = false;
		} else {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn.apply(this, arguments);
			}, wait)
		}
	}
}

_.once = function(fn) {
	var count = 0;
	return function() {
		if (count == 0) {
			fn.apply(this, arguments);
			count = 1;
		}
	}
}

_.compose = function() {
	var handles = Array.prototype.slice.call(arguments);
	return function() {
		if (handles.length == 0) return '';
		if (handles.length == 1) return handles[0].apply(this, arguments);
		var params = handles.pop().apply(this, arguments);
		return arguments.callee(params)
	}
}

_.curry = function(fn) {
	var argsLength = fn.length;
	var params = [];
	return function() {
		if (arguments.length > 1 && params.length < argsLength) {
			log('params must one')
		}
		params.push(arguments[0]);
		if (params.length == argsLength) {
			return fn.apply(this, params)
		} else {
			return arguments.callee;
		}
	}
}

var fn1 = function(a, b, c, d) {
	return a + b + c + d
}
var fn2 = function(b) {
	return b + 'bbb'
}
var fn3 = function(c) {
	return c + 'ccc'
}
// log(_.compose(fn1, fn2, fn3)(1))
// var a = _.curry(fn1)(1)(2)(3)(4)
var fs = require('fs');
var promisify = require('util').promisify;
var readFile = promisify(fs.readFile);

var Promise = function(fn) {
	var PENDDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var state = PENDDING,
		handles = [],
		value = null,
		handle = null;

	var fulfill = function(result) {
		state = FULFILLED;
		value = result;
	}

	var reject = function(err) {
		state = REJECTED;
		value = err;
	}

	var resolve = function(result) {
		try {
			var then = genThen(result);
			if (then) {
				doResolved(then.bind(result), resolve, reject)
			} else {
				fulfill(result)
			}
		} catch (e) {
			reject(e)
		}
	}

	var genThen = function(result) {
		var typeResult = typeof result;
		if (result && (typeResult == 'object' || typeResult == 'function')) {
			var then = result.then;
			if(typeof then === 'function') {
				return then;
			}
		}
		return null;
	}

	var doResolved = function(fn, onResloved, onRejected) {
		//什么时候执行resolve/reject
		try {
			fn(function(result) {
				onResloved(result)
			}, function(error) {
				onRejected(error)
			})
		} catch (e) {
			onRejected(e)
		}
	}

	var executeHandle = function (handler) {
		if(state === PENDDING) {
			handles.push(handler)
		}
		if(state === FULFILLED) {
			handles.onResloved(value)
		}
		if(state === REJECTED) {
			handles.onRejected(value)
		}
	}

	this.done = function (onResloved, onRejected) {
		// setTimeout()
		executeHandle({
			onResloved,
			onRejected
		})
	}

	this.then = function(onResloved, onRejected) {
		var _me = this;
		return new Promise((resolve, reject) => {
			_me.done((result) => {
				try{
					resolve(onResloved(result))
				}catch(e){
					reject(e)
				}
			}, () => {

			})
		})
	}
	this.catch = function() {}

	doResolved(fn, resolve, reject);

}

var promise = new Promise((resolve, reject) => {
	resolve(readFile('./index.html'))
}).then((d) => {
	log(d, 'ddddd')
})

//Promise构造函数接受一个函数作为参数定义为fn
//fn有两个函数参数 resolve和reject
//resolve和reject的执行控制权在调用者手里
//Promise实例有then方法
//then方法接受同样一个函数thenHandle作为参数，并返回一个新的Promise实例
//then里的函数会在上一个resolve时被执行
// log(promise)
//同步时then方法何时被调用