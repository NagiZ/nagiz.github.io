$(document).ready(function(){
	var arr = ['ac', 'ce', '=', 'nothing', 'ans'],
		inputArr = [];
		last_result = '',//上一次的结果
		equalTag = false;//是否按下等于
	$("#main-box").click(function(event) {
		/* Act on the event */
		if (!event.target.value) {
			return;
		}
		if (equalTag) {
			$("#result").val('');
			equalTag = false;
		}
		var targetValue = event.target.value;
		if ($.inArray(targetValue, arr) == -1) {
			inputArr.push(targetValue);
			var expression = $("#result").val() + targetValue;
			$("#result").val(expression);
		}else{
			switch(targetValue){
				case 'ac': 
					$("#result").val('');
					break;
				case 'ce':
					if (inputArr.length>0) {
						inputArr.pop();
						var last_val = inputArr.join('');
					}else{
						last_val = '';
					}
					$("#result").val(last_val);
					break;
				case 'ans':
					console.log(last_result);
					if (last_result.length!='') {
						$("#result").val($("#result").val() + last_result);
						inputArr.push(last_result);
					}
					break;
				case '=':
					var result = $("#result").val();
					var reg = /[0-9]+/;
					if (!reg.test(result.charAt(result.length-1))) {
						return;
					}
					equalTag = true;
					result = calculate(result);
					last_result = result;
					$("#result").val(result);
					inputArr = [];
					break;
				default: break;
			}
		}
	});
})

function calculate(str){
	var regsup = /\*|\/|\%/;
	var norresult = normalizeStr(str, 'sub'),
		numArrsup = [],
		actionSup = [];//乘除法
	var numArrsub = norresult.num;
	console.log(numArrsub);
	numArrsub.forEach(function(value, index) {
		if (regsup.test(value)) {
			numArrsup.push(normalizeStr(value, 'sup').num);
			actionSup.push(normalizeStr(value, 'sup').action);
			console.log(normalizeStr(value, 'sup').action);
		}else{
			numArrsup.push(value);
		}
	});
	console.log(numArrsup);
	numArrsup.forEach((value, index)=>{
		if (!Array.isArray(value)) {
			console.log(value);
			numArrsup[index] = +value;
		}else{
			numArrsup[index] = value.reduce((accumulation, curvalue, curIndex)=>{
				var actionIn = actionSup[index];
				return sum(accumulation, curvalue, actionIn[curIndex-1]);
			})
		}
	});
	var result = numArrsup.reduce((accumulation, curvalue, curIndex)=>{
		return sum(accumulation, curvalue, norresult.action[curIndex-1]);
	});
	console.log(numArrsup);
	console.log(result);
	return result;
}

function normalizeStr(str, subOrSup){
	var outNumArr = [],
		outActionArr = [];
		start = 0;
	if (subOrSup=='sub') {
		str = str.split('');
		str.forEach((val, i)=>{
			var regr= /[0-9]+|\+|\-/,
				regl = /[0-9]/;
			if (val=='+'||val=='-') {
				if (i>0) {
					if (regl.test(str[i-1])&&regr.test(str[i+1])) {
						outNumArr.push(str.slice(start, i).join(''));
						outActionArr.push(val);
						start = i+1;
					}
				}
			}
		});
		outNumArr.push(str.slice(start).join(''));
	}else if(subOrSup=='sup'){
		var reg = /\*+|\/|\%/,
			regAnti = /[^\*\/\%]/;
		outNumArr = str.split(reg);
		str.split(regAnti).forEach((value)=>{
			if (value!='') {
				outActionArr.push(value);
			}
		});
	}
	return {
		num: outNumArr,
		action: outActionArr
	};
}

function sum(num1, num2, action){
	num1 = +num1;
	num2 = +num2;
	var result = 0;
	switch(action){
		case '+':
			result = num1 + num2;
			break;
		case '-':
			result = num1 - num2;
			break;
		case '*':
			result = num1 * num2;
			break;
		case '/':
			result = num1 / num2;
			break;
		case '%':
			result = num1 % num2;
			break;
		case '**':
			result = Math.pow(num1, num2);
			break;
		default: break;
	}
	return result;
}