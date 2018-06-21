window.onload = function(){
	var path = window.location.pathname;
	var path_part = path.split('/');
	// check url path and do something
	switch (path_part[3]) {
		case 'service.htm':
			new ServicePage();
			break;

		case 'log.htm':
			new LogPage();
			break;
		
		default:
			
			break;
	}
}