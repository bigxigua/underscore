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
	var timer = null, immediately = immediately;
	return function() {
		if(immediately) {
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

_.once = function (fn) {
	var count = 0;
	return function () {
		if(count == 0) {
			fn.apply(this, arguments);
			count = 1;
		}
	}
}

var once = _.once(() => {log(1)})
setInterval(once, 100)