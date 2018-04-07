const arr = [1,7,6,4,8,0,-1,''];

//冒泡排序
const sortbyBubble = function (arr) {
	if(!Array.isArray(arr) || !arr.length) return [];
	for (let i = 0, len = arr.length; i < len; i++) {
		for (let j = i; j < len; j++) {
			var temp = arr[i];
			if(arr[i] > arr[j]) {
				arr[i] = arr[j];
				arr[j] = temp;
			}
		}
	}
	return arr;
}
//快速排序
const quickSort = function (arr) {
	if(!Array.isArray(arr) || !arr.length || arr.length <= 1) return arr;
	var len = arr.length;
	var middleItem = arr.splice(Math.round(len/2), 1)[0];
	var leftArr = [], rightArr = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] <= middleItem) {
			leftArr.push(arr[i])
		} else {
			rightArr.push(arr[i]);
		}
	}
	return quickSort(leftArr).concat([middleItem],quickSort(rightArr))
}

//选择排序
const selectSort = function (arr) {
	if(!Array.isArray(arr) || !arr.length || arr.length <= 1) return arr;
	var len = arr.length, minIndex = 0;
	for(var i = 0; i < len; i++){
		minIndex = i;
		for(var j = i + 1; j < len; j++) {
			if(arr[i] >= arr[j]) {
				minIndex = j;
			}
		}
		var tmp = arr[i];
		arr[i] = arr[minIndex];
		arr[minIndex] = tmp;
	}
	return arr;
}

//插入排序
const insertSort = function (arr) {
	if(!Array.isArray(arr) || !arr.length || arr.length <= 1) return arr;
	for(var i = 1; i < arr.length; i++) {
		var prevIndex = i - 1;
		var current = arr[i];
		while (prevIndex >= 0 && arr[prevIndex] >= current) {
			arr[prevIndex + 1] = arr[prevIndex]
			prevIndex--;
		}
		arr[prevIndex + 1] = current;
	}
	return arr;
}

//希尔排序
const shellSort = function (arr) {
	if(!Array.isArray(arr) || !arr.length || arr.length <= 1) return arr;
	var middleIndex = Math.floor(arr.length/2);
	var left = arr.slice(0, middleIndex);
	var right = arr.slice(middleIndex);
	// console.log(left)
	// shellSort(left);
	var merge = function (leftArr, rightArr) {
		var result = [];
		while (leftArr.length >= 0 && rightArr.length >= 0) {
			if(leftArr[0] <= rightArr[0]) {
				result.push(leftArr.shift());
			} else {
				result.push(rightArr.shift());
			}
		}
		while (leftArr.length) {
			result.push(leftArr.shift())
		}
		while (rightArr.left) {
			result.push(rightArr.shift())
		}
		return result;
	}

	return merge(shellSort(left), shellSort(right))

}

const isPrime = function (n) {
	var n = Number(n);
	if(!n || n !== n) return false;
	var m = 2;
	while (m < n) {
		if(n % m == 0) return false;
		m++;
	}
	return true;
}



console.log(shellSort(arr))
