$(function() { 
	document.body.style.background = "#F2FCFF";

	function findGetParameter(parameterName) {
	    var result = null,
	        tmp = [];
	    location.search
	        .substr(1)
	        .split("?")
	        .forEach(function (item) {
	          tmp = item.split("=");
	          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	        });
	    return result;
	}

//Set up global variables
function set_settings(){
	window.settings = [];
	window.settings.numberofavatars = 48;
	window.currConfed = 0;
	window.totalConfeds = 30;
	window.currRatings = 0;
	window.practiceClicks = [];
	window.fullClicks = [];
	window.motivationRatings = [];
	window.pracmotivationRatings = [];
	window.defeatistRatings = [];
	window.PracdefeatistRatings = [];
	window.pracConfedRatings = [1,0]; //1 = reward, 0 = reject (NOTE: DIFFERENT FROM CONDITIONS BELOW)
	window.conditions = [0,0,2,1,2,0,2,0,1,1,2,1,0,1,0,2,0,1,1,2,2,1,2,0,1,0,2,0,1,2]; //pseudorandomized using excel
		//0=reward, 1=ambig, 2=reject
	window.currReward = 0;
	window.currAmbig = 0;
	window.currReject = 0;
	window.needThreatAnswers = [];
	window.firstAmbResp = 999;

	//COMMENT BELOW LINES OUT FOR TESTING OUTSIDE PAVLOVIA
	window.finishExperimentAndSave = undefined;
	jsPsych.init({timeline:[
		{
			type: "pavlovia",
			command: "init"
		},
		{
			type:'call-function',
			async:true,
			func:function(done){
	    		window.finishExperimentAndSave = done;
			}
		},
		{
			type: "pavlovia",
			command: "finish",
			participantId: window.ptpID
		}
	], display_element: 'jspsych-target'});

}

//Present instructions #1
function intro_init(){
	$('#intro1').show();

	window.ptpID = findGetParameter('ptpID');
	window.session = findGetParameter('session');
	//window.ptpID = '0000';
	//window.session = '0000'; //temp until working in pavlovia
	jsPsych.data.get().push(['ptpID', window.ptpID]);
	jsPsych.data.get().push(['session',window.session]);

	$('#continue').on('click',function(){
		$('#intro1').hide();
		intro_init_2();
	})
}

//Present instructions #2
function intro_init_2(){
	$('#intro2').show();
	$('#continue2').on('click',function(){
		$('#intro2').hide();
		intro_practice();
	})
}

//Present instructions for practice round
function intro_practice(){
	$('#introPrac').show();
	$('#continue3').on('click',function(){
		$('#introPrac').hide();
		enter_username_practice();
	})

}

//Enter username for practice round
function enter_username_practice(){
	$('#usernameP').show();
	$('#cont_uname').on('click',function(){
		var error = 0;
		var unameP = $('#usernamePrac').val()

		if(unameP===""){
			error=1;
			errormsg='Please enter text';
			unameP="undefined";
		}
		if(!unameP.match(/^[a-zA-Z0-9]+$/i)){
			error=1;
			errormsg='Please only letters (and no spaces)';
		}
		if(error===0){
			$('#usernameP').hide();
			window.usernamePrac = $('#usernamePrac').val();
			jsPsych.data.get().push(['PracticeUsername', window.usernamePrac]);
			choose_avatar_practice();
		} else {
			alertify.log(errormsg,"error");
		}
	})
}

//Select avatar for practice round
function choose_avatar_practice(){
	$('#avatarP').show();
	var numavatars = window.settings.numberofavatars;
	for(var i=0; i<numavatars; i++){
		$('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />')
	}

	$('.avatar').on('click',function(){
  		$('.avatar').removeClass('selected');
  		$(this).addClass('selected');
	})

    $('#cont_avatar').on('click',function() {
    	if($('.selected').length === 1) {
  			$('#avatarP').hide();
  			window.avatarPrac = $('.selected').attr('id');
  			window.avatarPracExport = /avatar_([^\s]+)/.exec(window.avatarPrac)[1];
  			jsPsych.data.get().push(['PracticeAvatar',window.avatarPrac]); //un-comment when running real task
    		qainstr1();  			
    	} else {
    		alertify.log("Please select an avatar","error");
    	}
    });
}

function qainstr1(){
	$('#AnswerInstr1').show();
	$('#cont_qa').on('click',function(){
		$('#AnswerInstr1').hide();
		Answer_Prac();
	});
}

function Answer_Prac(){
	$('#AnswerPrac').show();
	$('#Weekend').keyup(function(){
		$('#count_wkd').text("Characters left: " + (215-$(this).val().length))
	});

	$('#cont_ansPrac').on('click',function() {
  		var error = 0;
  		if($('#Weekend').val() == "") {
  			error = 1;
  			errormsg = 'Please enter text.';
  		}
  		if($('#Weekend').val() !== "" && $('#Weekend').val().length < 100) {
  			error = 1;
  			errormsg = 'Please write a bit more.';
			}
  		if($('#Weekend').val().length > 215) {
  			error = 1;
  			errormsg = 'You are over the text limit.';
  		}  		
  		if(error == 0) {
  			$('#AnswerPrac').hide();
  			window.weekend = $('#Weekend').val();
  			jsPsych.data.get().push(['PracticeResponse',window.weekend]);
    		Answer_Prac2();  			
    	} else {
    		alertify.log(errormsg,"error");
    	}
  	});  
}

function Answer_Prac2(){
	$('#AnswerPrac2').show();
	$('#FreeTime').keyup(function(){
		$('#count_ft').text("Characters left: " + (215-$(this).val().length))
	});

	$('#cont_ansPrac2').on('click',function() {
  		var error = 0;
  		if($('#FreeTime').val() == "") {
  			error = 1;
  			errormsg = 'Please enter text.';
  		}
  		if($('#FreeTime').val() !== "" && $('#FreeTime').val().length < 100) {
  			error = 1;
  			errormsg = 'Please write a bit more.';
			}
  		if($('#FreeTime').val().length > 215) {
  			error = 1;
  			errormsg = 'You are over the text limit.';
  		}  		
  		if(error == 0) {
  			$('#AnswerPrac2').hide();
  			window.freetime = $('#FreeTime').val();
  			jsPsych.data.get().push(['PracticeResponse2',window.freetime]);
    		Motivation_Instr();  			
    	} else {
    		alertify.log(errormsg,"error");
    	}
  	});  
}

function Motivation_Instr(){
	$('#MotInstr').show();
	$('#cont_motinstr').on('click',function(){
		$('#MotInstr').hide();
		PracPreMot();
	})
}

function Motivation_Instr2(){
	$('#MotInstr2').show();
	$('#cont_motinstr2').on('click',function(){
		$('#MotInstr2').hide();
		PracPreMot();
	})
}

function PracPreMot(){
	$('#PracMotivationPre').show();
}

$('#PracMot0').on('click',function() {
	window.pracmotivationRatings.push(0);
	$('#PracMotivationPre').hide();
	Rating_Instr();
})

$('#PracMot1').on('click',function() {
	window.pracmotivationRatings.push(1);
	$('#PracMotivationPre').hide();
	Rating_Instr();
})

$('#PracMot2').on('click',function() {
	window.pracmotivationRatings.push(2);
	$('#PracMotivationPre').hide();
	Rating_Instr();
})

$('#PracMot3').on('click',function() {
	window.pracmotivationRatings.push(3);
	$('#PracMotivationPre').hide();
	Rating_Instr();
})

$('#PracMot4').on('click',function() {
	window.pracmotivationRatings.push(4);
	$('#PracMotivationPre').hide();
	Rating_Instr();
})

function Rating_Instr(){
	if (window.currConfed==0) {
		$('#RatingInstr').show();
		$('#cont_ratInst').on('click',function(){
			$('#RatingInstr').hide();
			Rating_Demo();
		})
	} else {
		$('#Pracpre_rating').show();
		$('#cont_responsePrac').on('click',function(){
			$('#Pracpre_rating').hide();
			Ratings_Practice();
		})
	}
}

function Rating_Demo(){
	$('#RatingDemo').show();
	$('#cont_ratDemo').on('click',function(){
		$('#RatingDemo').hide();
		Rating_Demo_Pictures();
	})
}

function Rating_Demo_Pictures(){
	$('#RatingDemoPix').show();
	$('#cont_ratDemopix').on('click',function(){
		$('#RatingDemoPix').hide();
		Results_Demo();
	})
}

function Results_Demo(){
	$('#ResultsDemo').show();
	$('#cont_resDemo').on('click',function(){
		$('#ResultsDemo').hide();
		Results_Demo_Pictures();
	})
}

function Results_Demo_Pictures(){
	$('#ResultsDemoPix').show();
	$('#introlike').show();
	$('#cont_resDemopix').on('click',function(){
		$('#ResultsDemoPix').hide();
		$('#introlike').hide();
		Ratings_Practice();
	})
}

function Ratings_Practice(){
	$('#RatingsPractice').show();
	ShowRatingsProfilesPractice();
}

function ShowRatingsProfilesPractice(){
	$('.usernamedemoratings').text(window.profiles.confeds_prac[window.currConfed].username);
	$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_prac[window.currConfed].avatar+ ")");
	$('.wkdanswerdemoratings').text(window.profiles.confeds_prac[window.currConfed].response_wkd);
}

$('#like_arrow_demoratings').on('click',function () {
	//window.practiceClicks[window.currConfed] = 1;
	window.practiceClicks.push(1);
	$('#RatingsPractice').hide();
	Ratings_Practice2();
})

$('#dislike_arrow_demoratings').on('click',function (){
	//window.practiceClicks[window.currConfed] = 0;
	window.practiceClicks.push(0);
	$('#RatingsPractice').hide();
	Ratings_Practice2();
})

function Ratings_Practice2(){
	$('#RatingsPractice2').show();
	ShowRatingsProfilesPractice2();
}

function ShowRatingsProfilesPractice2(){
	$('.usernamedemoratings').text(window.profiles.confeds_prac[window.currConfed].username);
	$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_prac[window.currConfed].avatar+ ")");
	$('.wkdanswerdemoratings').text(window.profiles.confeds_prac[window.currConfed].response_ft);
}

$('#like_arrow_demoratings2').on('click',function () {
	//window.practiceClicks[window.currConfed] = 1;
	window.practiceClicks.push(1);
	$('#RatingsPractice2').hide();
	connect_feedback_prac();
})

$('#dislike_arrow_demoratings2').on('click',function (){
	//window.practiceClicks[window.currConfed] = 0;
	window.practiceClicks.push(0);
	$('#RatingsPractice2').hide();
	connect_feedback_prac();
})

function connect_feedback_prac(){
	$('#Cont_FeedbackPrac').show();
	$('#cont_fbprac').on('click',function(){
		$('#Cont_FeedbackPrac').hide();
		FeedbackPrac();
	})
}

function FeedbackPrac(){
	$('#FeedbackPractice').show();
	$('#likeline').show();
	//Ptp answer for right box
	$('.ViewMyUname').text(window.usernamePrac);
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatarPrac + ".png')");
	$('#leftanswerprac').text(window.weekend);
	//Ptp answer for left box
	$('#rightanswerprac').text(window.freetime);
	//Present "likes" for first practice confederate, and "dislikes" for the second one.
	if (window.pracConfedRatings[window.currConfed]==1){
		$('#pracConfedLikeArrow').show();
		$('#pracConfedLikeArrow2').show();
		$('#likeexplained').show();
	}
	if (window.pracConfedRatings[window.currConfed]==0){
		$('#pracConfedDislikeArrow').show();
		$('#pracConfedDislikeArrow2').show();
		$('#dislikeexplained').show();
	}
}

$('#cont_pracRatings').on('click',function() {
	$('#FeedbackPractice').hide();
	$('#pracConfedLikeArrow').hide();
	$('#pracConfedLikeArrow2').hide();
	$('#likeexplained').hide();
	$('#pracConfedDislikeArrow').hide();
	$('#pracConfedDislikeArrow2').hide();
	$('#dislikeexplained').hide();
	$('#likeline').hide();
	if (window.currConfed == 0){
		PostMot_Instr();
	} else {
		PracPostDefeatist();
	}
})

function PostMot_Instr(){
	$('#PostMotInstr').show();
	$('#cont_postmotinstr').on('click',function (){
		$('#PostMotInstr').hide();
		PracPostDefeatist();
	})
}

function PracPostDefeatist(){
	$('#PracDefeatistPost').show();
}

$('#PracDef0').on('click',function() {
	window.PracdefeatistRatings.push(0);
	$('#PracDefeatistPost').hide();
	PracPostMot();
})

$('#PracDef1').on('click',function() {
	window.PracdefeatistRatings.push(1);
	$('#PracDefeatistPost').hide();
	PracPostMot();
})

$('#PracDef2').on('click',function() {
	window.PracdefeatistRatings.push(2);
	$('#PracDefeatistPost').hide();
	PracPostMot();
})

$('#PracDef3').on('click',function() {
	window.PracdefeatistRatings.push(3);
	$('#PracDefeatistPost').hide();
	PracPostMot();
})

$('#PracDef4').on('click',function() {
	window.PracdefeatistRatings.push(4);
	$('#PracDefeatistPost').hide();
	PracPostMot();
})

function PracPostMot(){
	$('#PracMotivationPost').show();
}

$('#PracMot0_2').on('click',function() {
	window.pracmotivationRatings.push(0);
	$('#PracMotivationPost').hide();
	ContinueRatings();
})

$('#PracMot1_2').on('click',function() {
	window.pracmotivationRatings.push(1);
	$('#PracMotivationPost').hide();
	ContinueRatings();
})

$('#PracMot2_2').on('click',function() {
	window.pracmotivationRatings.push(2);
	$('#PracMotivationPost').hide();
	ContinueRatings();
})

$('#PracMot3_2').on('click',function() {
	window.pracmotivationRatings.push(3);
	$('#PracMotivationPost').hide();
	ContinueRatings();
})

$('#PracMot4_2').on('click',function() {
	window.pracmotivationRatings.push(4);
	$('#PracMotivationPost').hide();
	ContinueRatings();
})

function ContinueRatings(){
	if (window.currConfed >= 1) {
		$('#RatingsPractice').hide();
		window.currConfed = 0;
		jsPsych.data.get().push(['PracticeRatings',window.practiceClicks]); //un-comment this when running real task
		jsPsych.data.get().push(['PracticeMotivation',window.pracmotivationRatings]);
		jsPsych.data.get().push(['PracticeDefeatist',window.PracdefeatistRatings]);
		Prac_complete_instr();
	} else {
		window.currConfed++; //this is working in round 2
		Motivation_Instr2();
	}
}

function Prac_complete_instr(){
	$('#PracContinueInstr').show();
	$('#cont_praccontinstr').on('click',function () {
		$('#PracContinueInstr').hide();
		LetsGetStarted();
	})
}

function LetsGetStarted() {
	$('#GetStarted').show();
	$('#cont_getstarted').on('click',function() {
		$('#GetStarted').hide();
		enter_username();
	})
}

function enter_username() {
	$('#UsernameEntry').show();
	$('#cont_uname2').on('click',function(){
		var error = 0;
		var uname = $('#username_entrybox').val()

		if(uname===""){
			error=1;
			errormsg='Please enter text';
			uname="undefined";
		}
		if(!uname.match(/^[a-zA-Z0-9]+$/i)){
			error=1;
			errormsg='Please only letters (and no spaces)';
		}
		if(error===0){
			$('#UsernameEntry').hide();
			window.username = $('#username_entrybox').val();
			jsPsych.data.get().push(['Username',window.username]);
			choose_avatar();
		} else {
			alertify.log(errormsg,"error");
		}
	})
}

function choose_avatar() {
	$('#avatarSelect').show();
	var numavatars = window.settings.numberofavatars;
	for(var i=0; i<numavatars; i++){
		$('.avatars2').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />')
	}

	$('.avatar').on('click',function(){
  		$('.avatar').removeClass('selected');
  		$(this).addClass('selected');
	})

    $('#cont_avatar2').on('click',function() {
    	if($('.selected').length === 1) {
  			$('#avatarSelect').hide();
  			window.avatar = $('.selected').attr('id');
  			window.avatarExport = /avatar_([^\s]+)/.exec(window.avatar)[1];
  			jsPsych.data.get().push(['Avatar',window.avatar]);
    		qainstr2();  			
    	} else {
    		alertify.log("Please select an avatar","error");
    	}
    });
}

function qainstr2 () {
	$('#realqa').show();
	$('#cont_realqa').on('click', function() {
		$('#realqa').hide();
		Answer_TV();
	})
}

function Answer_TV() {
	$('#AnswerTV').show();
	$('#TVmovie').keyup(function(){
		$('#count_tvmovie').text("Characters left: " + (215-$(this).val().length))
	});

	$('#cont_tvmov').on('click',function() {
  		var error = 0;
  		if($('#TVmovie').val() == "") {
  			error = 1;
  			errormsg = 'Please enter text.';
  		}
  		if($('#TVmovie').val() !== "" && $('#TVmovie').val().length < 100) {
  			error = 1;
  			errormsg = 'Please write a bit more.';
			}
  		if($('#TVmovie').val().length > 215) {
  			error = 1;
  			errormsg = 'You are over the text limit.';
  		}  		
  		if(error == 0) {
  			$('#AnswerTV').hide();
  			window.tvmovie = $('#TVmovie').val();
  			jsPsych.data.get().push(['TVMovieResponse',window.tvmovie]);
    		Answer_Food(); 			
    	} else {
    		alertify.log(errormsg,"error");
    	}
  	});  
}

function Answer_Food() {
	$('#AnswerFood').show();
	$('#Food').keyup(function(){
		$('#count_food').text("Characters left: " + (215-$(this).val().length))
	});

	$('#cont_food').on('click',function() {
  		var error = 0;
  		if($('#Food').val() == "") {
  			error = 1;
  			errormsg = 'Please enter text.';
  		}
  		if($('#Food').val() !== "" && $('#Food').val().length < 100) {
  			error = 1;
  			errormsg = 'Please write a bit more.';
			}
  		if($('#Food').val().length > 215) {
  			error = 1;
  			errormsg = 'You are over the text limit.';
  		}  		
  		if(error == 0) {
  			$('#AnswerFood').hide();
  			window.food = $('#Food').val();
  			jsPsych.data.get().push(['FoodResponse',window.food]);
    		Pre_Connect_Instr(); 			
    	} else {
    		alertify.log(errormsg,"error");
    	}
  	});  
}

function Pre_Connect_Instr() {
	$('#PreConnectInstr').show();
	$('#cont_preconnect').on('click',function() {
		$('#PreConnectInstr').hide();
		Connecting();
	});
}

function Connecting() {
	 $('#ConnectScreen').show();

	if (window.currConfed==0){
		window.time = 10000; //always 10 seconds on the first connection
	} else {
		window.time = Math.floor(Math.random()*5000)+1500; //between 1.5 seconds and 5 seconds
	}
  	setTimeout(function() {
  		$('#ConnectedtoPeople').show();
  		$('#ConnectScreen').hide();
  	}, time); 
  	$('#cont_connect').on('click',function() {
		$('#ConnectScreen').hide();
		$('#ConnectedtoPeople').hide();
  		motivation_rating_pre();  			
  	});	
}

function motivation_rating_pre() {
	$('#MotivationPre').show();
}

$('#Mot0').on('click',function() {
	window.motivationRatings.push(0);
	$('#MotivationPre').hide();
	PreRating();
})

$('#Mot1').on('click',function() {
	window.motivationRatings.push(1);
	$('#MotivationPre').hide();
	PreRating();
})

$('#Mot2').on('click',function() {
	window.motivationRatings.push(2);
	$('#MotivationPre').hide();
	PreRating();
})

$('#Mot3').on('click',function() {
	window.motivationRatings.push(3);
	$('#MotivationPre').hide();
	PreRating();
})

$('#Mot4').on('click',function() {
	window.motivationRatings.push(4);
	$('#MotivationPre').hide();
	PreRating();
})

function PreRating() {
	$('#pre_rating').show();
	$('#cont_response').on('click',function(){
		$('#pre_rating').hide();
		Give_Ratings_tvmovie();
	})
}

function Give_Ratings_tvmovie() {
	$('#GiveRatingsTvMovie').show();
	ShowRatingsTvMovie();
}

function ShowRatingsTvMovie() {
	$('.ViewMyUname').text(window.username);
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatar + ".png')");
	$('#leftanswer').text(window.tvmovie);
	if (window.conditions[window.currConfed] === 0){
		$('.usernamedemoratings').text(window.profiles.confeds_reward[window.currReward].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reward[window.currReward].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reward[window.currReward].response_movie);
	} else if (window.conditions[window.currConfed] === 1){
		$('.usernamedemoratings').text(window.profiles.confeds_ambig[window.currAmbig].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_ambig[window.currAmbig].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_ambig[window.currAmbig].response_movie);
	} else if (window.conditions[window.currConfed] === 2){
		$('.usernamedemoratings').text(window.profiles.confeds_reject[window.currReject].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reject[window.currReject].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reject[window.currReject].response_movie);
	}
}

$('#like_arrow_realtvratings').on('click',function () {
	window.fullClicks.push(1);
	$('#GiveRatingsTvMovie').hide();
	Give_Ratings_food();
})

$('#dislike_arrow_realtvratings').on('click',function (){
	window.fullClicks.push(0);
	$('#GiveRatingsTvMovie').hide();
	Give_Ratings_food();
})

function Give_Ratings_food() {
	$('#GiveRatingsFood').show();
	ShowRatingsFood();
}

function ShowRatingsFood() {
	$('.ViewMyUname').text(window.username);
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatar + ".png')");
	$('#rightanswer').text(window.food);
	if (window.conditions[window.currConfed] === 0){
		$('.usernamedemoratings').text(window.profiles.confeds_reward[window.currReward].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reward[window.currReward].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reward[window.currReward].response_food);
	} else if (window.conditions[window.currConfed] === 1){
		$('.usernamedemoratings').text(window.profiles.confeds_ambig[window.currAmbig].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_ambig[window.currAmbig].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_ambig[window.currAmbig].response_food);
	} else if (window.conditions[window.currConfed] === 2){
		$('.usernamedemoratings').text(window.profiles.confeds_reject[window.currReject].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reject[window.currReject].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reject[window.currReject].response_food);
	}
}

$('#like_arrow_realfoodratings').on('click',function () {
	window.fullClicks.push(1);
	$('#GiveRatingsFood').hide();
	Waiting();
})

$('#dislike_arrow_realfoodratings').on('click',function (){
	window.fullClicks.push(0);
	$('#GiveRatingsFood').hide();
	Waiting();
})

function Waiting() {
	$('#WaitScreen').show();
	
  	setTimeout(function() {
  		$('#WaitScreen').hide();
  		connect_feedback();
  	}, Math.floor(Math.random()*5000)+1500); //between 1.5 and 5 seconds
}

function connect_feedback() {
	$('#Cont_Feedback').show();
}

$('#cont_fb').on('click',function() {
	$('#Cont_Feedback').hide();
	Feedback_All();
})

function Feedback_All() {
	$('#Feedback').show();
	ShowRatingsTvMovie();
	if (window.conditions[window.currConfed]==0){
		$('#TvConfedLikeArrow').show();
	} else if (window.conditions[window.currConfed]==1){
		window.firstAmbResp = Math.round(Math.random()); //randomizes 0 or 1
		if (window.firstAmbResp==1){ //1 = like
			$('#TvConfedLikeArrow').show();
		} else if (window.firstAmbResp==0){ //0 = dislike
			$('#TvConfedDislikeArrow').show();
		}
	} else if (window.conditions[window.currConfed]==2){
		$('#TvConfedDislikeArrow').show();
	}

	ShowRatingsFood();
	if (window.conditions[window.currConfed]==0){
		window.currReward++;
		$('#FoodConfedLikeArrow').show();
	} else if (window.conditions[window.currConfed]==1){
		if (window.firstAmbResp==0){
			$('#FoodConfedLikeArrow').show();
		} else if (window.firstAmbResp==1){
			$('#FoodConfedDislikeArrow').show();
		}
		window.currAmbig++;
	} else if (window.conditions[window.currConfed]==2){
		window.currReject++;
		$('#FoodConfedDislikeArrow').show();
	}
}

$('#cont_Ratings').on('click',function() {
	$('#Feedback').hide();
	$('#TvConfedLikeArrow').hide();
	$('#TvConfedDislikeArrow').hide();
	$('#FoodConfedLikeArrow').hide();
	$('#FoodConfedDislikeArrow').hide();
	defeatist_rating_post();
})

function motivation_rating_post() {
	$('#MotivationPost').show();
}

$('#Mot0_2').on('click',function() {
	window.motivationRatings.push(0);
	$('#MotivationPost').hide();
	NextRound();
})

$('#Mot1_2').on('click',function() {
	window.motivationRatings.push(1);
	$('#MotivationPost').hide();
	NextRound();
})

$('#Mot2_2').on('click',function() {
	window.motivationRatings.push(2);
	$('#MotivationPost').hide();
	NextRound();
})

$('#Mot3_2').on('click',function() {
	window.motivationRatings.push(3);
	$('#MotivationPost').hide();
	NextRound();
})

$('#Mot4_2').on('click',function() {
	window.motivationRatings.push(4);
	$('#MotivationPost').hide();
	NextRound();
})

function defeatist_rating_post() {
	$('#DefeatistPost').show();
}

$('#Def0').on('click',function() {
	window.defeatistRatings.push(0);
	$('#DefeatistPost').hide();
	motivation_rating_post();
})

$('#Def1').on('click',function() {
	window.defeatistRatings.push(1);
	$('#DefeatistPost').hide();
	motivation_rating_post();
})

$('#Def2').on('click',function() {
	window.defeatistRatings.push(2);
	$('#DefeatistPost').hide();
	motivation_rating_post();
})

$('#Def3').on('click',function() {
	window.defeatistRatings.push(3);
	$('#DefeatistPost').hide();
	motivation_rating_post();
})

$('#Def4').on('click',function() {
	window.defeatistRatings.push(4);
	$('#DefeatistPost').hide();
	motivation_rating_post();
})

function NextRound() {
	if (window.currConfed === 14 || window.currConfed === window.totalConfeds-1) {
		NTintro();
	} else {
		window.currConfed++;
		window.firstAmbResp = 999;
		Connecting();
	}
}

function NTintro(){
	if (window.currConfed === 14) {
		$('#Halfway').show();
		$('#cont_half').on('click',function(){
			$('#Halfway').hide();
			NeedThreat();
		})
	} else if (window.currConfed === window.totalConfeds-1) {
		$('#AlmostDone').show();
		$('#cont_almost').on('click',function(){
			$('#AlmostDone').hide();
			NeedThreat();
		})
	}

}

function NeedThreat() {
	$('#NeedThreatQs').show();
	QuestionNum = 0;
	$('#NTQ').text(window.questionnaireQs.questions[QuestionNum].q)
}

$('#NT0').on('click',function() {
	window.needThreatAnswers.push(0);
	$('#NeedThreatQs').hide();	
	if(QuestionNum >= 23 && window.currConfed != window.totalConfeds-1) {
		window.currConfed++;
		Connecting();
	} else if (QuestionNum >= 23 && window.currConfed === window.totalConfeds-1) {
		Finished();
	} else {
		QuestionNum++;
		$('#NTQ').text(window.questionnaireQs.questions[QuestionNum].q)
		$('#NeedThreatQs').show();
	}
})

$('#NT1').on('click',function() {
	window.needThreatAnswers.push(1);
	$('#NeedThreatQs').hide();
	if(QuestionNum >= 23 && window.currConfed != window.totalConfeds-1) {
		window.currConfed++;
		Connecting();
	} else if (QuestionNum >= 23 && window.currConfed === window.totalConfeds-1) {
		Finished();
	} else {
		QuestionNum++;
		$('#NTQ').text(window.questionnaireQs.questions[QuestionNum].q)
		$('#NeedThreatQs').show();
	}
})

$('#NT2').on('click',function() {
	window.needThreatAnswers.push(2);
	$('#NeedThreatQs').hide();
	if(QuestionNum >= 23 && window.currConfed != window.totalConfeds-1) {
		window.currConfed++;
		Connecting();
	} else if (QuestionNum >= 23 && window.currConfed === window.totalConfeds-1) {
		Finished();
	} else {
		QuestionNum++;
		$('#NTQ').text(window.questionnaireQs.questions[QuestionNum].q)
		$('#NeedThreatQs').show();
	}
})

$('#NT3').on('click',function() {
	window.needThreatAnswers.push(3);
	$('#NeedThreatQs').hide();
	if(QuestionNum >= 23 && window.currConfed != window.totalConfeds-1) {
		window.currConfed++;
		Connecting();
	} else if (QuestionNum >= 23 && window.currConfed === window.totalConfeds-1) {
		Finished();
	} else {
		QuestionNum++;
		$('#NTQ').text(window.questionnaireQs.questions[QuestionNum].q)
		$('#NeedThreatQs').show();
	}
})

$('#NT4').on('click',function() {
	window.needThreatAnswers.push(4);
	$('#NeedThreatQs').hide();
	if(QuestionNum >= 23 && window.currConfed != window.totalConfeds-1) {
		window.currConfed++;
		Connecting();
	} else if (QuestionNum >= 23 && window.currConfed === window.totalConfeds-1) {
		Finished();
	} else {
		QuestionNum++;
		$('#NTQ').text(window.questionnaireQs.questions[QuestionNum].q)
		$('#NeedThreatQs').show();
	}
})

function Finished(){
	$('#Completed').show();
	jsPsych.data.get().push(['ParticipantRatings',window.fullClicks]);
	jsPsych.data.get().push(['MotivationRatings',window.motivationRatings]);
	jsPsych.data.get().push(['DefeatistRatings',window.defeatistRatings]);
	jsPsych.data.get().push(['NeedThreatAnswers',window.needThreatAnswers]);
	window.finishExperimentAndSave();
}

set_settings();

intro_init();


});