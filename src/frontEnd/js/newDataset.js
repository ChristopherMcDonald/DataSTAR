$('body').on('click','.option li',function(){
	var i = $(this).parents('.select').attr('id');
	var v = $(this).children().text();
	var o = $(this).attr('id');
	$('#'+i+' .selected').attr('id',o);
	$('#'+i+' .selected').text(v);
});