function RunParse() {
	$('#parsingInfo').modal('show');
	$.getJSON( "/run_parsing", function( data ) {
		if ((typeof data.status !== 'undefined') && (data.status === "success")) {						
			document.getElementById("percent").innerHTML = "0 (0/0)"; 		
			document.getElementById("process").innerHTML = ""; 		
			document.getElementById("errors").innerHTML = ""; 		
			document.getElementById("close").style.display = "none";
			$('#parsingInfo').modal('show');
			cycleParseInfo();
		} else {
			$('#parsingInfo').modal('hide');
			if (typeof data.message !== 'undefined') {
				//document.getElementById("errors").innerHTML = "0"; 		
				w2alert("Got Error: "+data.message.toString());
			} else {
				w2alert("Got unknown error. Please report to admin.");
			}
		};
	});
}

function cycleParseInfo() {
	$.getJSON( "/get_parsing_progress", function( data ) {
		if (typeof data.status !== 'undefined') {
			if (typeof data.record === 'undefined') {
				if (typeof data.message !== 'undefined') {
					//document.getElementById("errors").innerHTML = "0"; 		
					w2alert("Got Error: "+data.message.toString());
				} else {
					w2alert("Got unknown error. Please report to admin.");
				}	
				return;
			};
			var newpercent = data.record["progress"]+" "+data.record["progress_string"];
			if (document.getElementById("percent").innerHTML !== newpercent) {
				document.getElementById("percent").innerHTML = newpercent;
				document.getElementById("process").innerHTML = data.record["progress_last_company"];
				if (data.record["error"].length>0)
					document.getElementById("errors").innerHTML += data.record["error"] + "<br/>"; 		
			};
						
			if (data.record["state"] === 1) { //finished
				document.getElementById("errors").innerHTML += "Got " + data.record["new_reviews"] + " NEW reviews. New are hided for now. Admin can turn them to show below."; 		
				document.getElementById("closeParsing").style.display = "block";
			} else {
				cycleParseInfo();
			};
		} else {
			$('#parsingInfo').modal('hide');
			if (typeof data.message !== 'undefined') {
				w2alert("Got Error: "+data.message.toString());
			} else {
				w2alert("Got unknown error. Please report to admin.");
			}
		};			
	});
}

////// ADDING NEWS CONTROL /////////////////////////////////
function EditNews(id) {
	document.getElementById("save").innerHTML = "Save";
	$('#addNewsForm').modal('show');
	NewsForm(id);
}

function AddNews() {
	document.getElementById("save").innerHTML = "Add";
	$('#addNewsForm').modal('show');		
	NewsForm(0);
}

function RemoveNews(id){
	w2confirm('Are you sure to remove?', function btn(answer) {
		if (answer === "Yes") {
			window.location.href = '/news_control?cmd=remove&id='+id.toString();
		};
	});
}

var newsForm_created = 0;
function NewsForm(id) {
	newsForm_created++;
	if (newsForm_created == 1) {
		$('#newsForm').w2form({ 
			name   : 'newsForm',
			url: '/news_control',
			recid: id,
			fields : [
				{ name: 'caption', type: 'text', required: true },
				{ name: 'text',  type: 'text', required: true },
				{ name: 'image',   type: 'text', required: true }
			],
			actions: {
				save: function () {
					this.save();					
				}
			},
			onSave: function(event) {
				if (typeof event.status !== 'undefined')
					if (event.status == 'success') {
						$('#addNewsForm').modal('hide');						
						location.reload(); 
					}
			}       
		});
	} else {
		newsForm_created = 2;
		w2ui['newsForm'].recid = id;
		w2ui['newsForm'].reload();
		//document.getElementById("newsForm").style.height = "100%";
	}
};

////// ADDING ADV  CONTROL /////////////////////////////////
function EditAdv(id) {
	document.getElementById("save").innerHTML = "Save";
	$('#addAdvForm').modal('show');
	AdvForm(id);
}

function AddAdv() {
	document.getElementById("save").innerHTML = "Add";
	$('#addAdvForm').modal('show');		
	AdvForm(0);
}

function RemoveAdv(id){
	w2confirm('Are you sure to remove?', function btn(answer) {
		if (answer === "Yes") {
			window.location.href = '/adv_control?cmd=remove&id='+id.toString();
		};
	});
}

var newsForm_created = 0;
function AdvForm(id) {
	newsForm_created++;
	if (newsForm_created == 1) {
		$('#advForm').w2form({ 
			name   : 'AdvForm',
			url: '/adv_control',
			recid: id,
			fields : [
				{ name: 'image',   type: 'text', required: true }
			],
			actions: {
				save: function () {
					this.save();					
				}
			},
			onSave: function(event) {
				if (typeof event.status !== 'undefined')
					if (event.status == 'success') {
						$('#addAdvForm').modal('hide');						
						location.reload(); 
					}
			}       
		});
	} else {
		newsForm_created = 2;
		w2ui['AdvForm'].recid = id;
		w2ui['AdvForm'].reload();
		//document.getElementById("AdvForm").style.height = "100%";
	}
};

