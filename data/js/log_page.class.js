class LogPage{
	constructor(){
		this.responses = [];
		this.cleaned_files = [];
		this.logs = '';
		this.html = '';
		this.date_from;
		this.date_to;
		// this.today_utc = new Date(Date.UTC(2018, 3, 26, 3, 0, 0));
		this.today_utc = new Date();
		this.today = this.makeRightDateFormat(this.today_utc);
		this.files = [];
		this.makeLogTable();
		this.putListenerOnButton();
		this.isAjax = false;
	}

	makeLogTable(date_from=this.today, date_to=this.today){
		$('tbody').empty();
	    var self = this;
	    this.cleaned_files = this.makeLogFilesArray(date_from, date_to);

        // for each
       
    	$.each(this.files, function(key, file){
    		console.log(file);
    		$.get({url: file, cache: false}).done(function(data){
    		// on successfuly opened log file
    			// push response data in array 
				self.responses.push(data);
				// when iteration trough files is over show results on html page table(if iteration ends with existing log file)
				self.createTableBodyHTML(date_from, date_to);
    		// if log file failed to open(it doesn't exists) 
    		}).fail(function(){
    			console.log('Ne postoji fajl ' + file);
    			// iterate trough files and unset non-existing one
    			$.each(self.cleaned_files, function(k, v){
    				if (v == file) {
    					self.cleaned_files.splice(k, 1);
    				}
    			});
    			// if files are empty, there is no logs for that period
    			if (self.cleaned_files.length == 0) {
    				$('tbody').html('Za dati period nema logova.');
    				return;
    			}
    			// when iteration trough files is over show results on html page table(if iteration ends with non-existing log file)
    			self.createTableBodyHTML(date_from, date_to);
    		});
    	});
	}

	putListenerOnButton(){
		var btn = $('button');
		var self = this;
		$(btn).on('click', function(){
			self.isAjax = true;
			self.responses = [];
			self.files = [];
			self.logs = '';
			self.html = '';
			self.data = [];
			var from = $('#from').val().split('-');
			var to = $('#to').val().split('-');
			from = new Date(Date.UTC(from[0], from[1], from[2], 3, 0, 0));
			to = new Date(Date.UTC(to[0], to[1], to[2], 3, 0, 0));
			var date_from = self.makeRightDateFormat(from);
			var date_to = self.makeRightDateFormat(to);
			self.makeLogTable(date_from, date_to);
		});
	}

	makeRightDateFormat(date){
        var dd = date.getDate();
        if (!this.isAjax) {
        	var mm = date.getMonth() + 1;
        } else {
        	var mm = date.getMonth();
        }
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
			var path = `log/${from}.txt`;
			// if (this.fileExist(path)) {
				this.files.push(path);
			// }
		// if log is in same year but different month
		} else if (date_from.split('/')[2] == date_to.split('/')[2]){
			for (var i = date_from.split('/')[1]; i <= date_to.split('/')[1]; i++) {
				if (this.countChars(i) == 1) {
					i = '0'+i;
				}
				var path = `log/${i}${date_to.split('/')[2]}.txt`;
				// if (this.fileExist(path)) {
					this.files.push(path);
				// }
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

	fileExist(str){
		$.get(str).done(function(){
			return true;
		}).fail(function(){
			return false;
		});
	}

	createTableBodyHTML(date_from, date_to){
		var self = this;
		var counter = 0;
		if (this.responses.length == this.cleaned_files.length) {
			$.each(self.responses, function(ke, response){
				self.logs += ',' + response;
			});
			var logs_arr = self.logs.trim().split(/\r\n/);
			$.each(logs_arr, function(k, value){
				value = value.substring(1);
				logs_arr[k] = value.split(',');
			});
			$.each(logs_arr, function(k, v){
				var date = v[1].split(' ');
				date = date[0];
				if (self.prepareDateForComparation(date) >= self.prepareDateForComparation(date_from) && self.prepareDateForComparation(date) <= self.prepareDateForComparation(date_to)) {
					self.html += `<tr>
			                        <td>${++counter}</td>
			                        <td>${v[0]}</td>
			                        <td>${v[1]}</td>
			                        <td>${v[2]}</td>
			                    </tr>`;
				}
            });
            $('tbody').html(self.html);
		}
	}
	prepareDateForComparation(date){
		var parts = date.split('/');
		var d = Number(parts[2] + parts[1] + parts[0]);
		return d;
	}
}