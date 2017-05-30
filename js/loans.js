var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

function drawLoans(all) {
	$( "#companyGrid" ).html(`
	<center>
		<img src="/images/loading_circle_1.gif">
	</center>
	`);
	
	//собираем параметры
	var getForm = function(form,type){
		var ret = [];
		for (var i in form) {
				switch (type) {
					case 'int': 
						if (typeof form[i].checked !== 'undefined')
						ret.push( {
							"name": form[i].name,
							"value": [form[i].checked + 0],
							"type": type
						});
					break;
				case 'contains': 
					if (typeof form[i].checked !== 'undefined')
					if (form[i].checked)
						ret.push( {
							"name": form[i].getAttribute("basename"),
							"value": [form[i].name],
							"type": type
						});
				break;
				case 'selectpicker': 
					if (typeof form[i] !== 'object') continue;
					//console.log(form[i]);
					var basename = $(form[i]).attr("basename");
					//console.log(basename);
					if (typeof basename == 'undefined' || basename.length==0) continue;
					var li = $(form[i]).find('option:selected');
					var val = [];
					if (li != null && typeof (li !=='undefined'))
						for (var j in li) {
							if (typeof li[j] !== 'object') continue;
							var els = li[j];
							if (typeof els.innerHTML === 'undefined') continue;
							if (els.innerHTML != 'Not set')
								val.push(encodeURIComponent(els.innerHTML));
						};
					ret.push( {
						"name": basename,
						"value": val,
						"type": type
					});
				break;
			}			
		};
		return ret;
	}
	
	var search_data = {
		"cmd": "get-records",
		"offset": 0,
		"limit": 1000,
		"searchLogic": "AND",
		"sort[0][field]": "Name",
		"sort[0][direction]": "ASC"
	};

	var form = document.getElementsByClassName("form_param");
	var form2 = document.getElementsByClassName("form_containsparam"); 
	var form3 = document.getElementsByClassName("selectpicker");
	var data = $.merge(getForm(form,'int'), getForm(form2,'contains'));
	var data2 = getForm(form3,'selectpicker');	
	data = $.merge(data,data2);

	//APR
	data2 = [{
		"name": "APR_max",
		"value": [$( "#slider-apr" ).slider( "value" )],
		"type": "max"
	}];
	data = $.merge(data,data2);
	
	//LoanAmount
	var setloanamount = $( "#slider-loan-amount" ).slider( "value" );
	//algo from common.js line 51:
	if (setloanamount<=25) {
			setloanamount = (setloanamount * 10000/25);
		} else {
			if (setloanamount<=75) {
				setloanamount -= 25;
				setloanamount = (setloanamount * 10000 / 500) * 1000;
			} else {
				setloanamount -= 75;
				setloanamount = (1 + (setloanamount * 9.0 / 25)) * 1000000;
			}
		}
	data2 = [{
		"name": "LoanAmount_min",
		"value": [setloanamount],
		"type": "max"
	},
	{
		"name": "LoanAmount_max",
		"value": [setloanamount],
		"type": "more or 0"
	}
	];
	data = $.merge(data,data2);	
	
	//MinAPR
	//0..5%
	data2 = [{
		"name": "MinAPR",
		"value": [$( "#slider-min-apr" ).slider( "value" )/20],
		"type": "min"
	}];
	data = $.merge(data,data2);	

	//ApplicationFee
	data2 = [{
		"name": "ApplicationFee",
		"value": [$( "#slider-fee" ).slider( "value" )],
		"type": "max"
	}];
	data = $.merge(data,data2);	
	
	//MinimumIncome
	//это кому? искать до? после?
	//поле отключено т.к. всего одна запись для него $21
	/*
	data2 = [{
		"name": "MinimumIncome",
		"value": [$( "#slider-min-income" ).slider( "value")],
		"type": "max"
	}];
	data = $.merge(data,data2);	
	*/
	
	var searches = 0;
	for (var i in data) {
		//console.log(data[i]);
		if (data[i].type=='int' && data[i].value > 0) {
			search_data[`search[${searches}][field]`] = data[i].name;
			search_data[`search[${searches}][type]`] = data[i].type;
			search_data[`search[${searches}][operator]`] = 'is';
			search_data[`search[${searches}][value][]`] = data[i].value[0];
			searches++;
		}
		if (data[i].type=='contains' && data[i].value.length > 0) {
			search_data[`search[${searches}][field]`] = data[i].name;
			search_data[`search[${searches}][type]`] = 'text';
			search_data[`search[${searches}][operator]`] = 'contains';
			search_data[`search[${searches}][value]`] = data[i].value[0];
			searches++;
		}
		if (data[i].type=='selectpicker' && data[i].value.length > 0) {
			search_data[`search[${searches}][field]`] = data[i].name;
			search_data[`search[${searches}][type]`] = 'text';
			search_data[`search[${searches}][operator]`] = 'contains';//in
			//for (var v in data[i].value)
			search_data[`search[${searches}][value][]`] = data[i].value[0];
			searches++;
		}
		if (data[i].type=='more or 0' && data[i].value.length > 0) {
			search_data[`search[${searches}][field]`] = data[i].name;
			search_data[`search[${searches}][type]`] = 'text';
			search_data[`search[${searches}][operator]`] = 'more or 0';
			search_data[`search[${searches}][value][]`] = data[i].value[0];
			searches++;
		}
		if (data[i].type=='max' || data[i].type=='min') {
			search_data[`search[${searches}][field]`] = data[i].name;
			search_data[`search[${searches}][type]`] = 'int';
			search_data[`search[${searches}][operator]`] = 'between';//in
			//for (var v in data[i].value)
			if (data[i].type=='max')
				search_data[`search[${searches}][value]`] = [0, data[i].value[0]];
			else 
				search_data[`search[${searches}][value]`] = [data[i].value[0],10000000];
			searches++;
		}
	};
	
	if (all) search_data = {};		
				
	$.post( "/get_company_grid",search_data, function( data ) {
		if (data.status !== "success") return;
		if (typeof data.records === 'undefined') return;
		var table = "";
		var records = data.records;
		var totalc = document.getElementById("total_companies");
		if (typeof totalc !== 'undefined' && totalc != null) totalc.innerHTML = data.total;
		
		records.forEach(function(record, i, arr) {
			var stars = "";
			for (var si=0;si<record.Stars;si++)
				stars += `<i class="price-text-color fa fa-star"></i>`;
			for (var si=0;si<(5-record.Stars);si++)
				stars += `<i class="fa fa-star"></i>`;     		               
			
			var back_color = "rgba(0,0,0,0.4);";			
			if (!record.Show)
				back_color = "rgba(80, 20, 0, 0.7)"
			
			var cell = `<div class="loan_company_card">
					<div class="row"><div>
					<div class="summary-item company col-sm-12" style="background:`+back_color+`">
						<div class="col-sm-3 col-xs-12 padding-top-15 padding-bottom-10 text-center">
							<a href="/details.html?id=${record.Id}">
								<img src="${record.LogoBase64}" width="140px" alt="${record.Name}">
							</a>
						</div>
						<div class="col-sm-3 col-xs-12 text-center">
							<a href="/details.html?id=${record.Id}"><h3>${record.Name}</h3></a>
							<h4>${record.Est}</h4>
							<div class="row icons">
							`+
							(record.NoOriginationFee ? `<span class="fa fa-child padding-left-20" data-toggle="tooltip" data-placement="top" title="" data-original-title="No Origination Fee"></span>` : ``)+
							(record.NoPrepaymentFee ? `<span class="fa fa-bar-chart padding-left-20" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="No Prepayment Fee"></span>` : ``)
							+`
							</div>
						</div>
						<div class="col-sm-3 col-xs-12 padding-top-sm-20 padding-top-xs-5 text-center">`+
							(record.APR.length > 0 ? `<div class="row">
								<p>APR: ${record.APR}</p>
							</div>` : ``)+
							(record.LoanAmount.length > 0 ? `<div class="row">
								<p>Loan Amount: ${record.LoanAmount}</p>
							</div>` : ``)+
							(record.MinAPR > 0 ? `<div class="row">
								<p>Min APR: ${record.MinAPR}%</p>
							</div>` : ``)+
						`</div>
						<div class="col-sm-3 col-xs-12" style="text-align:center">
							<div class="padding-top-sm-20 padding-top-xs-5">
								<div class="stars">
									${stars}
								</div>
								
								<h5 class="margin-left-0"><a href="#" onclick="WriteReview('${record.LogoFile}','${record.Name}',${record.Id})"><p>`+
								(record.ReviewCount > 0 ? `${record.ReviewCount} User Reviews` : "Be the first to review")+								
								`</p></a></h5>
							</div>
						</div>
					</div></div></div></div>`;
			table += cell;
		});		

		$( "#companyGrid" ).html( table );
		$('[data-toggle="tooltip"]').tooltip();
	}, 'json');
};

$(document).ready(function(){
	drawLoans(true);
});

