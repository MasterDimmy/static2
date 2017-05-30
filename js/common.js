function WaitClick(url) {
	$('#waitModal').modal('show');
	window.location.href = url;
}


//drop down menu
var options = [];
$( '.dropdown-menu a' ).on( 'click', function( event ) {
   var $target = $( event.currentTarget ),
       val = $target.attr( 'data-value' ),
       $inp = $target.find( 'input' ),
       idx;

   if ( ( idx = options.indexOf( val ) ) > -1 ) {
      options.splice( idx, 1 );
      setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
   } else {
      options.push( val );
      setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
   }

   $( event.target ).blur();
      
   console.log( options );
   return false;
});



//sliders

 $( function() {
    $( "#slider-apr" ).slider({
      range: "min",
      value: 30,
      min: 0,
      max: 30,
      slide: function( event, ui ) {
        $( "#amount_apr" ).val( ui.value + "%");
      }
    });
    $( "#amount_apr" ).val(  $( "#slider-apr" ).slider( "value" ) + "%");
  } );
  
   $( function() {
    $( "#slider-loan-amount" ).slider({
      range: "min",
      value: 25,
      min: 0,
      max: 100,
      slide: function( event, ui ) {
		//0-25: 0 - 10 000
		//25-50: 10 000 - 100 000
		//50-75: 100 000 - 1 000 000
		//75-100: 1 000 000 - 10 000 000
		var vt = ui.value;
		if (vt<=25) {
			vt = (vt * 10000/25).toString();
		} else {
			if (vt<=75) {
				vt -= 25;
				vt = (vt * 10000 / 500).toString() + "K";
			} else {
				vt -= 75;
				vt = (1 + (vt * 9.0 / 25)).toString().substring(0,4) + "M";
			}
		}
        $( "#amount_loan" ).val( "$" + vt );
      }
    });
    //$( "#amount_loan" ).val( "$" + $( "#slider-loan-amount" ).slider( "value" ) );
	$( "#amount_loan" ).val( "$10K");
  } );
  
   $( function() {
    $( "#slider-min-apr" ).slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      slide: function( event, ui ) {
        $( "#amount_minapr" ).val( ui.value/20 + "%");
      }
    });
    $( "#amount_minapr" ).val( $( "#slider-min-apr" ).slider( "value" )/20 + "%");
  } );
  
   $( function() {
    $( "#slider-min-income" ).slider({
      range: "min",
      value: 1000,
      min: 0,
      max: 1000,
      slide: function( event, ui ) {
        $( "#amount_minincome" ).val( "$" + ui.value);
      }
    });
    $( "#amount_minincome" ).val( "$" + $( "#slider-min-income" ).slider( "value" ));
  } );
  
   $( function() {
    $( "#slider-fee" ).slider({
      range: "min",
      value: 1000,
      min: 0,
      max: 1000,
      slide: function( event, ui ) {
        $( "#amount_fee" ).val( '$' + ui.value);
      }
    });
    $( "#amount_fee" ).val( '$' + $( "#slider-fee" ).slider( "value" ));
  } );

//mobile select for all select-pickers
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  $('.selectpicker').selectpicker('mobile');
}

//quicksearch
$('.quicksearch').on('changed.bs.select', function (clickedIndex, newValue, oldValue) {
  window.location.href = "/details.html?id="+ this.options[this.selectedIndex].id;
});
  
//tooltip
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    // Enables popover
    $("[data-toggle='popover']").popover();
});

///////////////////// edit n write a review ///////////////////////////////////////
var captchaKey = "";
function reloadCaptcha() {
	$.ajax({
		type: "GET",
		url: "/new_captcha_id",
		dataType: "JSON",
		async: true,
		success: function(data){
			if (typeof data.Message !== "undefined") {
				w2alert(data.Message);
			} else {
				var key = data.record.captchaid;
				captchaKey = key;
				var nowTime = Date.now();
				var cimg = document.getElementById("captchaimg");
				cimg.src = "/captcha?"+key+".png&reload="+nowTime;
				var cimg2 = document.getElementById("captchaimg_vote");
				if (cimg2 != null)
					cimg2.src = "/captcha?"+key+".png&reload="+nowTime;
			};
		}
	});		
};

var review_mode = 0; //0-edit, 1-save
function EditReview(logo,name,rid) {
	document.getElementById("save").innerHTML = "Save";
	document.getElementById("rid").value = rid.toString();	
	document.getElementById("company_logo").class = logo;	
	document.getElementById("company_name").innerHTML = name;
	document.getElementById("captcha_group").style.display = "none";
	review_mode = 0;
	
	document.getElementById("text").value = document.getElementById("review_text_"+rid.toString()).innerHTML;
	document.getElementById("author").value = document.getElementById("review_"+rid.toString()+"_author").innerHTML;
	
	var stars = document.getElementById("review_stars_"+rid.toString()).getElementsByTagName("i");
	var i = 0;
	for (var s in stars) {
		if (typeof stars[s].className !== 'undefined')
		if (stars[s].className.toString().indexOf("price-text-color")>=0)
			i++;
	};					
	document.getElementById("captcha_group").style.display = "none";
	$('#addReviewForm').modal('show');
	StarClick(i);
}

var cid_value = 0;
function WriteReview(logo,name,cid) {
	document.getElementById("save").innerHTML = "Add";
	document.getElementById("company_logo").src = logo;	
	document.getElementById("company_name").innerHTML = name;
	document.getElementById("captcha_group").style.display = "block";
	
	reloadCaptcha();
	review_mode = 1;
	cid_value = cid;
	document.getElementById("captcha_group").style.display = "inline-block";
	$('#addReviewForm').modal('show');		
}

var stars_clicked = 0;
function StarClick(num) {
	if (num<=0) return;
	if (num>5) num=5;
	stars_clicked = num;
	for (var i=1;i<=5;i++)
		document.getElementById("addReviewStar"+i.toString()).className = "fa fa-star star_chooser";
	for (var i=1;i<=num;i++)
		document.getElementById("addReviewStar"+i.toString()).className += " price-text-color";
}

function SaveOrAddReview() {
	var text = document.getElementById("text").value;
	var captcha = document.getElementById("captcha").value;
	var author = document.getElementById("author").value;
	captcha = captcha.replace(/\s+/g, '');
	
	var rid = document.getElementById("rid").value;
	
	var errors = false;
	document.getElementById("author").className = "form-control";
	if (author.length === 0) {
		console.log("2");
		$('#author').tooltip({
			title: "Required field", 
			placement: "right",
			trigger : 'focus'
		});
		$('#author').tooltip('show');
		document.getElementById("author").className += " w2ui-error";
		errors = true;
	} else {
		$('#author').tooltip('destroy');
	};
	
	document.getElementById("text").className = "form-control";
	if (text.length === 0) {
		$('#text').tooltip({
			title: "Required field", 
			placement: "right",
			trigger : 'focus'
		});
		$('#text').tooltip('show');
		document.getElementById("text").className += " w2ui-error";
		errors = true;
	} else {
		$('#text').tooltip('destroy');
	};
	
	if (review_mode == 1) { 
		document.getElementById("captcha").className = "form-control";
		if (captcha.length === 0) {
			$('#captcha').tooltip({
				title: "Required field", 
				placement: "right",
				trigger : 'focus'
			});
			$('#captcha').tooltip('show');
			document.getElementById("captcha").className += " w2ui-error";
			errors = true;		
		} else {
			$('#captcha').tooltip('destroy');
		};
	};
		
	if (errors) return;
	
	//post save or add command	
	var cmd = "edit_review";
	if (review_mode == 1)
		cmd = "add_review";
	
	var data = {};
	data["cmd"]=cmd;
	data["id"]=rid;
	data["text"]=text;
	data["CaptchaId"]=captchaKey;
	data["UserCaptcha"]=captcha;
	data["stars"]=stars_clicked;
	data["Author"] = author;
	data["cid"]=cid_value;
	
	if (review_mode!=1) {
		$('#waitModal').modal('show');
	}

	$.ajax({
	  type: "POST",
	  url: "/review_control",
	  data: data,
	  dataType: 'json',
	  success: function( data ) {
		if (data.status !== "success") {
			w2alert(data.message);
			reloadCaptcha();
			return;
		};
		$('#addReviewForm').modal('hide');		
		if (review_mode==1) {
			w2alert("Thanx! Your review will be added as soon as possible!","Success");			
		} else  {
			location.reload(); 
		}
	}});
}

function RemoveReview(id){
	w2confirm('Are you sure to remove?<br>Review will be still stored in database for parsing compability,<br>you can see it if you want, but you will never be able to turn it on again.', function btn(answer) {
		if (answer === "Yes") {
			$.ajax({
			  type: "GET",
			  dataType: 'json',
			  url: '/review_control?cmd=remove&id='+id.toString(),
			  success: function( data ) {
				if (data.status !== "success") {
					w2alert(data.message);
					return;
				};
				location.reload(); 
			}});
		};
	});
}

////////////////////////////////////////////////////////////////

function DoSearch() {
	drawLoans();
};

////// add testimotial ////
$('#testimonialorPartnerForm').validate({
    rules: {
        userName: {
            minlength: 1,
			maxlength: 70,
            required: true
        },
        userMessage: {
            minlength: 10,
			maxlength: 10000,
            required: true
        }
    },
    highlight: function (element) {
		$(element).closest('.control-group').removeClass('error').removeClass('valid')
		$(element).removeClass('valid').addClass('error');
    },
    success: function (element) {
        element
			.removeClass('error').addClass('valid')
            .closest('.control-group').removeClass('error').addClass('valid'); 			
    }
});

$('#testimonialorPartnerForm').submit(function(evt) {
    evt.preventDefault();
    if( $('#testimonialorPartnerForm').valid() ) { //do submit
		var data = {
			UserName: document.getElementById("userName").value,			
			CaptchaId: captchaKey,
			UserCaptcha: document.getElementById("captcha").value,
			UserEmail: "none",
			UserTheme: document.getElementById("theme").value,
			UserMessage: document.getElementById("userMessage").value,
		};
		$.ajax({
			type: "POST",
			url: "/new_message",
			data: data,
			dataType: "JSON",
			async: true,
			success: function(data){
				$(this).closest('testimonialorPartnerForm').find("input[type=text], textarea").val("");
				reloadCaptcha();
				if (typeof data.message !== "undefined") {
					w2alert(data.message);
				} else 
					w2alert("Message has been sent");
			}
		});
    };	// form has errors
});

/// contact us //////
$('#messageForm').validate({
    rules: {
        userName: {
            minlength: 2,
			maxlength: 70,
            required: true
        },
        userEmail: {
			minlength: 6,
			maxlength: 70,
            required: true,
            email: true
        },
        userTheme: {
			minlength: 2,
			maxlength: 70,
            required: true
        },
        userMessage: {
            minlength: 10,
			maxlength: 10000,
            required: true
        }
    },
    highlight: function (element) {
		$(element).closest('.control-group').removeClass('error').removeClass('valid')
		$(element).removeClass('valid').addClass('error');
    },
    success: function (element) {
        element
			.removeClass('error').addClass('valid')
            .closest('.control-group').removeClass('error').addClass('valid'); 			
    }
});

$('#messageForm').submit(function(evt) {
    evt.preventDefault();
    if( $('#messageForm').valid() ) { //do submit
		var data = {
			UserEmail: document.getElementById("userEmail").value,
			UserTheme: document.getElementById("userTheme").value,
			UserName: document.getElementById("userName").value,
			UserMessage: document.getElementById("userMessage").value,
			CaptchaId: captchaKey,
			UserCaptcha: document.getElementById("captcha").value
		};
		$.ajax({
			type: "POST",
			url: "/new_message",
			data: data,
			dataType: "JSON",
			async: true,
			success: function(data){
				reloadCaptcha();
				$(this).closest('messageForm').find("input[type=text], textarea").val("");
				if (typeof data.message !== "undefined") {
					w2alert(data.message);
				} else 
					w2alert("Message has been sent");
			}
		});
    } // form has errors
});

