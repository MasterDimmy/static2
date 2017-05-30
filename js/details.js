var vote_rid = 0;
var vote_dir = 0;
function ReviewThumbsUp(id , n) {
	reloadCaptcha();
	vote_dir = n;
	vote_rid = id;
	$('#voteReviewForm').modal('show');
}
function DoVote() {	
	var captcha = document.getElementById("captcha_vote").value;
	captcha = captcha.replace(/\s+/g, '');

	var errors = false;
	
	document.getElementById("captcha_vote").className = "form-control";
	if (captcha.length === 0) {
		$('#captcha_vote').tooltip({
			title: "Required field", 
			placement: "right",
			trigger : 'focus'
		});
		$('#captcha_vote').tooltip('show');
		document.getElementById("captcha_vote").className += " w2ui-error";
		errors = true;		
	} else {
		$('#captcha_vote').tooltip('destroy');
	};
		
	if (errors) return;
		
	$.getJSON( "/thumbsup?id="+vote_rid.toString()+"&ups="+vote_dir.toString()+"&CaptchaId="+captchaKey+"&UserCaptcha="+captcha, function( data ) {
		reloadCaptcha();
		if (data.status !== "success") {
			if (data.message == "Captcha input error!") {
				$('#captcha_vote').tooltip({
					title: "Required field", 
					placement: "right",
					trigger : 'focus'
				});
				$('#captcha_vote').tooltip('show');
				document.getElementById("captcha_vote").className += " w2ui-error";
				return;
			};
			w2alert(data.message);
			return;
		}
		var to = (vote_dir === 1 ? "up" : "down");
		var sid = "review_"+vote_rid.toString()+"_"+to;
		var span = document.getElementById(sid);
		var old_val = span.innerHTML;
		var newval = Number(old_val)+1;
		document.getElementById(sid).innerHTML = newval.toString();
		$('#voteReviewForm').modal('hide');
	});
};

///////////////////////////////////////////////

function ResetReviews(id) {
	$.getJSON( "/reset_reviews?id="+id.toString(), function( data ) {
		if (data.status !== "success") {
			w2alert(data.message);
			return;
		};
		var set0 = function(id,to) {
			var sid = "review_"+id.toString()+"_"+to;
			var span = document.getElementById(sid);
			document.getElementById(sid).innerHTML = "0";
		};
		set0(id,"up");
		set0(id,"down");
	});
};

function ShowReview(id, show) {
	$.getJSON( "/show_review?bcompany_id=-1&id="+id.toString()+"&show="+show.toString(), function( data ) {
		if (data.status !== "success") {
			w2alert(data.message);
			return;
		};
		if (id == -1) { //command for all reviews
			location.reload(); 
		} else {
			var obj = "review_"+id.toString()+"_show";
			var div = document.getElementById(obj);
			var newval = "";
			if (show) 
				newval = "rgba(50, 150, 50, 0.3)";
			else 
				newval = "rgba(150, 50, 50, 0.3)";		
			document.getElementById(obj).style.background = newval;
		};		
	});
};

function ShowAll(show) {
	$('#waitModal').modal('show');
	var adc = document.getElementById("review_conrol");
	var control = ((typeof adc) !== 'undefined' && adc !== null);	
	var id = -1;
	if (!control) {
		var cobj = document.getElementById("cid");
		if (typeof cobj === 'undefined') {
			w2alert("company_id not found");
			return;
		};		
		var nid = parseInt(cobj.innerHTML);
		if (nid > 0) {
			id = nid;
		};
	}
	$.getJSON( "/show_review?id=-1&bcompany_id="+id.toString()+"&show="+show.toString(), function( data ) {
		if (data.status !== "success") {
			$('#waitModal').modal('hide');
			w2alert(data.message);
			return;
		};
		location.reload(); 
	});
}

function logoUrlChanged() {
	var logo = document.getElementById("LogoFile");
	document.getElementById("editLogo").src = logo.value;	
}

function EditCompany(cid) {
	if (cid ==0) { //create new
		document.getElementById("editLogo").style.display = "none";
		document.getElementById("companyBLISTING_ID").value = "";
		document.getElementById("companyFetchedStr").value = "";		
	} else {
		document.getElementById("editLogo").style.display = "inline";
	}
	$('#editCompanyModal').modal('show');		
	CreateCompanyEditor(cid);
};


function CreateCompanyEditor(cid) {
	if ((typeof w2ui['editCompanyForm'] !== 'undefined') || (w2ui['editCompanyForm'] != null)) {
		w2ui['editCompanyForm'].destroy();
	}
	
	document.getElementById("editCompanyForm").innerHTML = document.getElementById("editCompanyForm2").innerHTML;
				
	$('#editCompanyForm').w2form({ 
		name   : 'editCompanyForm',
		url    : '/company_control',
		recid: cid,
		fields: [
			{ name: 'Show', type: 'checkbox', required: true },
			
			{ name: 'Name', type: 'text', required: true },
			{ name: 'Est', type: 'text', required: true },
			{ name: 'LogoFile', type: 'text', required: true },
			
			{ name: 'SiteURL', type: 'text', required: true },
			{ name: 'StreetAddress', type: 'text', required: true },
			{ name: 'AddressLocality', type: 'text', required: true },
			{ name: 'AddressRegion', type: 'text', required: true },
			{ name: 'AddressCountry', type: 'text', required: true },
			{ name: 'PostalCode', type: 'text', required: true },
			{ name: 'Telephone', type: 'text', required: true },
			
			{ name: 'AboutText', type: 'text', required: false },
			
			{ name: 'CreditBureauReporting', type: 'text', required: false}, 			
			
			{ name: 'LoanAmount_min', type: 'float', required: true },
			{ name: 'LoanAmount_max', type: 'float', required: true },
			{ name: 'PaymentOptionsText', type: 'text', required: false },
			{ name: 'APR_min', type: 'float', required: true },
			{ name: 'APR_max', type: 'float', required: true },			
			{ name: 'MaxLoanTermMonthsText', type: 'text', required: false }, 
			
			{ name: 'CheckingAccountRequired', type: 'checkbox', required: true },
			{ name: 'LendToMilitary', type: 'checkbox', required: true },
			{ name: 'VerificationDocumentsRequired', type: 'text', required: false },
			{ name: 'ImmigrationStatusRequirementsText', type: 'text', required: false },
			{ name: 'MinimumAge', type: 'text', required: false },			
			
			{ name: 'CustomizablePaymentDates', type: 'checkbox', required: true },
			{ name: 'JointLoansAvailable', type: 'checkbox', required: true },
			{ name: 'NoOriginationFee', type: 'checkbox', required: true },
			{ name: 'PreApprovedSoftCreditInquiry', type: 'checkbox', required: true },
			{ name: 'DeferredPayments', type: 'checkbox', required: true },
			{ name: 'NoLateFees', type: 'checkbox', required: true },
			{ name: 'NoPrepaymentFee', type: 'checkbox', required: true },
			
			{ name: 'Minutes', type: 'checkbox', required: true },
			{ name: 'Days17', type: 'checkbox', required: true },
			{ name: 'SameDay', type: 'checkbox', required: true },
			{ name: 'Weeks24', type: 'checkbox', required: true },
			
			{ name: 'ApplicationFee', type: 'int', required: true }, //todo: add to edit form
			
			{ name: 'LeasePurchase', type: 'checkbox', required: true },
			{ name: 'Refinance', type: 'checkbox', required: true },
			{ name: 'InstitutionType', type: 'list', required: true, 
				options: { items: [ 
				{id:'Bank', text:'Bank'},
				{id:'Credit Union', text:'Credit Union'},
				{id:'Direct Lender', text:'Direct Lender'},
				{id:'Marketplace Lender',text:'Marketplace Lender'},
				{id:'Other',text:'Other'}
				] } },
				 		
			{ name: 'NewLoan', type: 'checkbox', required: true },
			{ name: 'UsedCarLoan', type: 'checkbox', required: true },
			
			{ name: 'ApprovalSpeedHours', type: 'text', required: false }
		],
		actions: {			
			save: function () {
				var obj = this;
				this.save({}, function (data) { 
					if (data.status == 'error') {
						w2alert(data.message);
					}
					$('#editCompanyModal').modal('hide');		
					w2ui['editCompanyForm'].destroy();		
					location.reload(); 
				});
			}
		}
	});
	
}

