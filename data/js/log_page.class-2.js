class LogPage{
	constructor(){
		this.requestsQueue = [];
		this.syncTaskPointer = null;
		this.requestResolveCallbackQueue = [];
		this.responses = [];
		this.logs = '';
		this.date_from;
		this.date_to;
		this.today_utc = new Date(Date.UTC(2018, 3, 26, 3, 0, 0));
		this.today = this.makeRightDateFormat(this.today_utc);
		this.files = [];
		// this.makeLogTable();
		this.putListenerOnButton();
	}
	makeLogTable(date_from=this.today, date_to=this.today){
		// console.log(date_from);
		// console.log(date_to);
		this.makeLogFilesArray(date_from, date_to);
        var rawFile = new XMLHttpRequest();
        var html = '';
        var counter = 0;
	    var self = this;
        // console.log(this.files);
        // var async_request=[];
		// var responses=[];

        // for each
        $.each(this.files, function(key, file){
        	self.ajaxSync(file).then(function(result){
        		self.responses.push(result);
        		console.log(result);
        		// console.log(this.files.lenght);
        		// if (self.responses.length == self.files.lenght) {
        		// 	console.log(self.responses);
        		// }
        	});
			// console.log(promiseA);
        });
        console.log(this.responses.lenght);
        while(this.files.lenght != this.responses.lenght){
        	console.log('cekam ajax');
        }
        if (this.files.lenght == this.responses.lenght) {
        	console.log(this.responses);
        }
     //    $.each(this.files, function(key, file){
     //    	$.get(file, function(data){
     //    		self.responses.push(data);
     //    	});
     //    });
     //    $.when.apply($, this.responses).done(function(){
     //    	console.log(self.responses[0]);
	    // });
        
        	
        	// console.log(this.responses);
	}
	putListenerOnButton(){
		var btn = $('button');
		var self = this;
		$(btn).on('click', function(){
			var from = $('#from').val().split('-');
			var to = $('#to').val().split('-');
			from = new Date(Date.UTC(from[0], from[1], from[2], 3, 0, 0));
			to = new Date(Date.UTC(to[0], to[1], to[2], 3, 0, 0));
			var date_from = self.makeRightDateFormat(from);
			var date_to = self.makeRightDateFormat(to);
			self.makeLogTable(date_from, date_to);
		});
	}
	// makeRightInputDateFormat(date_input){
	// 	var date = date_input.split('-');
	// 	return `${date[2]}/${date[1]}/${date[0]}`;
	// }
	makeRightDateFormat(date){
        var dd = date.getDate();
        var mm = date.getMonth();
        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        return dd+'/'+mm+'/'+yyyy;
	}
	makeLogFilesArray(date_from, date_to){
		var from = date_from.split('/')[1]+date_from.split('/')[2];
		var to = date_to.split('/')[1]+date_to.split('/')[2];
		// if log is in same month
		if (from == to) {
			this.files.push(`log/${from}.TXT`);
		// if log is in same year but different month
		} else if (date_from.split('/')[2] == date_to.split('/')[2]){
			for (var i = date_from.split('/')[1]; i <= date_to.split('/')[1]; i++) {
				if (this.countChars(i) == 1) {
					i = '0'+i;
				}
				this.files.push(`log/${i}${date_to.split('/')[2]}.TXT`);
			}
		// if log is in different years
		} else {

		}
		return this.files;
	}
	countChars(str){
		var str_string = str.toString();
		var counter = 0;
		var arr = str_string.split('');
		$.each(arr, function(key, value){
			++counter;
		});
		return counter;
	}
	nativeAjax(requestObj){
		//this is your actual ajax function 
		//which will return a promise
		
		//after finishing the ajax call you call the .next() function of syncRunner
		//you need to put it in the suceess callback or in the .then of the promise
		var self = this;
		$.ajax(requestObj).then(function (responseData) {
			(self.requestResolveCallbackQueue.shift())(responseData);
			self.syncTaskPointer.next();
		});
	}
	ajaxSync(requestObj){
		var self = this;
		this.requestsQueue.push(requestObj);
		if(!this.syncTaskPointer){
			this.syncTaskPointer = this.syncRunner();
			this.syncTaskPointer.next();
		}
		return new Promise(function (resolve, reject) {
			var responseFlagFunc = function (data) {
				resolve(data);
			}
			self.requestResolveCallbackQueue.push(responseFlagFunc);
		});
	}
	* syncRunner(){
		while(this.requestsQueue.length>0){
			yield this.nativeAjax(this.requestsQueue.shift());	
		}

		//set the pointer to null
		this.syncTaskPointer = null;
		console.log("all resolved");
	};
}


// var syncTaskPointer = null;
// var requestsQueue = [];
// var requestResolveCallbackQueue = [];

// function nativeAjax (requestObj) {
// 	//this is your actual ajax function 
// 	//which will return a promise
	
// 	//after finishing the ajax call you call the .next() function of syncRunner
// 	//you need to put it in the suceess callback or in the .then of the promise
// 	$.ajax(requestObj).then(function (responseData) {
// 		(requestResolveCallbackQueue.shift())(responseData);
// 		syncTaskPointer.next();
// 	});
// }

// function* syncRunner(){
// 	while(requestsQueue.length>0){
// 		yield nativeAjax(requestsQueue.shift());	
// 	}

// 	//set the pointer to null
// 	syncTaskPointer = null;
// 	console.log("all resolved");
// };

// ajaxSync = function (requestObj) {
// 	requestsQueue.push(requestObj);
// 	if(!syncTaskPointer){
// 		syncTaskPointer = syncRunner();
// 		syncTaskPointer.next();
// 	}
// 	return new Promise(function (resolve, reject) {
// 		var responseFlagFunc = function (data) {
// 			resolve(data);
// 		}
// 		requestResolveCallbackQueue.push(responseFlagFunc);
// 	});
// }

// ajaxSync("http://myApis.com/getUser");
// ajaxSync("http://myApis.com/getHisFriends");
// ajaxSync("http://myApis.com/unfriendThisParticularFriend");
// ajaxSync("http://myApis.com/dateHisGirlFriend");