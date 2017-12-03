$('body').on('click','.option li',function(){
	var i = $(this).parents('.select').attr('id');
	var v = $(this).children().text();
	var o = $(this).attr('id');
	$('#'+i+' .selected').attr('id',o);
	$('#'+i+' .selected').text(v);
});

$("#uploadDataBtn").click(evt => {
    var type = $("#type").val();
    var links = $("#links").val().split(",");
    links = links.map(string => string.trim());
    var options = $("#options").val().split(",");
    options = options.map(string => string.trim());
    var tier = $("#tierDropDown").val();
    
    axios.post('http://localhost:3000/client/addData', {
        id: localStorage.getItem('clientId'),
        type: type,
        tier: tier,
        options: options,
        files: links
    }).then(res => {
        window.location.href = "clientDatasets.html";
    }).catch(err => {
        console.log(err);
    });
});