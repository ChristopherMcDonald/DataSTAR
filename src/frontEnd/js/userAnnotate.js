
jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
    return this.each(function() {
        var select = this;
        var options = [];
        $(select).find('option').each(function() {
            options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);
        $(textbox).bind('change keyup', function() {
            var options = $(select).empty().data('options');
            var regex = new RegExp(search,"gi");
          
            $.each(options, function(i) {
                var option = options[i];
                if(option.text.match(regex) !== null) {
                    $(select).append(
                       $('<option>').text(option.text).val(option.value)
                    );
                }
            });
            if (selectSingleMatch === true && $(select).children().length === 1) {
                $(select).children().get(0).selected = true;
            }
        });            
    });
};

$(function() {
    $('#select').filterByText($('#textbox1'), false);
  $("select option").click(function(){
    alert(1);
  });
});



window.onload = function(){
    axios.get("http://localhost:3000/next?userId=" + localStorage.getItem("userId"))
    .then(res => { 
        var source = res.data.ticket.link;
        var options = res.data.ticket.options;
        
        localStorage.setItem("datasetId", res.data.data);

        $("#dataImg").attr('src', source);
        $("#select").html("");
        options.forEach(option => {
            $("#select").append($('<option/>', {
                value: option,
                text: option
            }));
        });

     })
    .catch(error => {
        console.error(error);
        document.getElementById("thanksMsg").style.display = "block";
        document.getElementById("annotation").style.display = "none";
        
    });
};

$("#dataNextBtn").click(function(evt){
    axios.post("http://localhost:3000/annotate", {
        userId: localStorage.getItem("userId"),
        datasetId: localStorage.getItem("datasetId"),
        resourceName: $("#dataImg").attr('src'),
        label: $("#select").val()
    })
    .then(res => {
        
    })
    .catch(error => {})
});
    /*going through data in the dataset
    var showing = [1, 0, 0, 0, 0];
    var data = ['d0', 'd1', 'd2', 'd3', 'd4'];

    function next() {
        var qElems = [];
        for (var i = 0; i < data.length; i++) {
            qElems.push(document.getElementById(data[i]));   
        }
        for (var i = 0; i < showing.length; i++) {
            if (showing[i] == 1) {
                qElems[i].style.display = 'none';
                showing[i] = 0;
            if (i == showing.length - 1) {
                qElems[i].style.display = 'block';
            } else {
                qElems[i + 1].style.display = 'block';
                showing[i + 1] = 1;
            }
                break;
            }
        }      
    }
*/

