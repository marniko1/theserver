class ServicePage{
	constructor(){
		this.listAllCards();
	}
	listAllCards(){
		var html = `<table class="table">
                        <thead class="thead-dark">
                            <tr>
                               <th scope="col" style="width: 5%">#</th> 
                               <th scope="col" style="width: 85%">card id</th> 
                               <th scope="col" style="width: 10%">option</th> 
                            </tr>
                        </thead>
                        <tbody>
                        `;
        var counter = 0;
        var allCards = new XMLHttpRequest();
        $.ajax({
            type: "GET",
            // url: "/Reley",
            url: "php_test.php",
            data: "action=demand_all_cards",
            success: function(data){
                // var response = JSON.parse(data);
                // console.log(data);
                var xmlDoc = data;
                var cards = $(xmlDoc).find('card');
                // console.log(cards);
                $.each(cards, function(key, card){
                    if (key == 0) {
                        html += `<tr>
                                    <td>M</td>
                                    <td>${$(card).text()}</td>
                                    <td><img src="images/delete-icon.ico"><img class="ml-2" src="images/edit.png"></td>
                                </tr>
                                <tr>
                                    <th colspan="3"></th>
                                </tr>`;
                    } else {
                        html += `<tr>
                                    <td>${++counter}</td>
                                    <td>${$(card).text()}</td>
                                    <td><img src="images/delete-icon.ico"></td>
                                </tr>`;
                    }
                });
                html += `</tbody><table>`;
                $('.table_wrapper').html(html);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error"+errorThrown);
            }
        });
	}
	deleteCard(){

	}
	editMasterCard(){

	}
}