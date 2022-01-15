$(function() { 
	document.body.style.background = "#F2FCFF";

	// function findGetParameter(parameterName) {
	//     var result = null,
	//         tmp = [];
	//     location.search
	//         .substr(1)
	//         .split("?")
	//         .forEach(function (item) {
	//           tmp = item.split("=");
	//           if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	//         });
	//     return result;
	// }

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
	window.pracConfedRatings = [1,0,1,0,1,0];
	window.confedRatings = [[1,5],[2,4],[3,3],[3,3],[4,2],[5,1]];
	window.conditions = [0,1,2,0,1,2,0,1,2,0,1,2]; //THIS NEEDS TO BE FIXED/RANDOMIZED/MADE TO REACH 30; 0=reward, 1=ambig, 2=reject
	window.currReward = 0;
	window.currAmbig = 0;
	window.currReject = 0;
	 //randomize waiting time between 6 and 8 seconds
	window.waitTimings = [Math.floor(Math.random()*8000)+6000,Math.floor(Math.random()*8000)+6000,Math.floor(Math.random()*8000)+6000,
						  Math.floor(Math.random()*8000)+6000,Math.floor(Math.random()*8000)+6000];
	 //randomize connecting time between 4 and 6 seconds
	window.connectTimings = [Math.floor(Math.random()*6000)+4000,Math.floor(Math.random()*6000)+4000,Math.floor(Math.random()*6000)+4000,
							 Math.floor(Math.random()*6000)+4000,Math.floor(Math.random()*6000)+4000];
	window.postRewardAnswers = [];
	window.postRejectAnswers = [];

	//COMMENT BELOW LINES OUT FOR TESTING OUTSIDE PAVLOVIA
	// window.finishExperimentAndSave = undefined;
	// jsPsych.init({timeline:[
	// 	{
	// 		type: "pavlovia",
	// 		command: "init"
	// 	},
	// 	{
	// 		type:'call-function',
	// 		async:true,
	// 		func:function(done){
// 	    		window.finishExperimentAndSave = done;
// 			}
// 		},
// 		{
// 			type: "pavlovia",
// 			command: "finish",
// 			participantId: window.ptpID
// 		}
// 	], display_element: 'jspsych-target'});

// }
}

//Present instructions #1
function intro_init(){
	$('#intro1').show();

	// window.ptpID = findGetParameter('ptpID');
	// window.session = findGetParameter('session');
	window.ptpID = '0000';
	window.session = '0000'; //temp until working in pavlovia
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

	//window.finishExperimentAndSave();
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
  			//jsPsych.data.get().push(['PracticeAvatar',window.avatarPrac]); //un-comment when running real task
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
    		Rating_Instr();  			
    	} else {
    		alertify.log(errormsg,"error");
    	}
  	});  
}

function Rating_Instr(){
	$('#RatingInstr').show();
	$('#cont_ratInst').on('click',function(){
		$('#RatingInstr').hide();
		Rating_Demo();
	})
}

function Rating_Demo(){
	$('#RatingDemo').show();
	$('#cont_ratDemo').on('click',function(){
		$('#RatingDemo').hide();
		Results_Demo();
	})
}


function Results_Demo(){
	$('#ResultsDemo').show();
	$('#cont_resDemo').on('click',function(){
		$('#ResultsDemo').hide();
		Ratings_Practice();
	})
}

function Ratings_Practice(){
	$('#RatingsPractice').show();
	$('.ViewMyUname').text(window.usernamePrac);
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatarPrac + ".png')");
	$('.MyAnswer').text(window.weekend);
	ShowRatingsProfilesPractice();
	//TO CHANGE: In loop, add screen right after each rating where you see the confederate's rating of your response
	//During this second (feedback) screen, might be helpful to add text explaining what the feedback means?
}

function ShowRatingsProfilesPractice(){
	$('.usernamedemoratings').text(window.profiles.confeds_prac[window.currConfed].username);
	$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_prac[window.currConfed].avatar+ ")");
	$('.wkdanswerdemoratings').text(window.profiles.confeds_prac[window.currConfed].response_wkd);
}

function ContinueRatings(){
	if (window.currConfed >= window.settings.profilespercondition-1) {
		$('#RatingsPractice').hide();
		window.currConfed = 0;
		//jsPsych.data.get().push(['PracticeRatings',window.practiceClicks]); //un-comment this when running real task
		Prac_complete_instr();
	} else {
		window.currConfed++; //this is working in round 2
		Ratings_Practice();
	}
}

function FeedbackPrac(){
	$('#FeedbackPractice').show();
	if (window.pracConfedRatings[window.currConfed]==1){
		$('.like_arrow').show();
	}
	if (window.pracConfedRatings[window.currConfed]==0){
		$('.dislike_arrow').show();
	}
}

$('#cont_pracRatings').on('click',function() {
	$('#FeedbackPractice').hide();
	$('#pracConfedLikeArrow').hide();
	$('#pracConfedDislikeArrow').hide();
	ContinueRatings();
})

$('#like_arrow_demoratings').on('click',function () {
	window.practiceClicks[window.currConfed] = 1;
	$('#RatingsPractice').hide();
	FeedbackPrac();
})

$('#dislike_arrow_demoratings').on('click',function (){
	window.practiceClicks[window.currConfed] = 0;
	$('#RatingsPractice').hide();
	FeedbackPrac();
})

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

  	setTimeout(function() {
  		$('#ConnectedtoPeople').show();
  		$('#ConnectScreen').hide();
  	}, 2000); //original should be set to 8000 - NEEDS TO BE CHANGED TO REFLECT 30 PTPS
  		//Should replace this ^ with just randomizing on the spot
		//was window.connectTimings[window.currConfed]
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
  	}, 2000); //return to window.waitTimings[window.currCondition] after testing
}

function connect_feedback() {
	$('#Cont_Feedback').show();
	$('#cont_fb').on('click',function() {
		$('#Cont_Feedback').hide();
		FeedbackTvMovie();
	})
}

function FeedbackTvMovie() {
	$('#Feedback_TvMovie').show();
	ShowRatingsTvMovie();
	if (window.conditions[window.currConfed]==0){
		$('#TvConfedLikeArrow').show();
	} else if (window.conditions[window.currConfed]==1){
		//??? how to determine whether like or dislike?
	} else if (window.conditions[window.currConfed]==2){
		$('#TvConfedDislikeArrow').show();
	}
}

$('#cont_tvRatings').on('click',function() {
	$('#Feedback_TvMovie').hide();
	$('#TvConfedLikeArrow').hide();
	$('#TvConfedDislikeArrow').hide();
	FeedbackFood();
})

function FeedbackFood() {
	$('#Feedback_Food').show();
	ShowRatingsFood();
	if (window.conditions[window.currConfed]==0){
		window.currReward++;
		$('#FoodConfedLikeArrow').show();
	} else if (window.conditions[window.currConfed]==1){
		window.currAmbig++;
		//??? how to determine whether like or dislike?
	} else if (window.conditions[window.currConfed]==2){
		window.currReject++;
		$('#FoodConfedDislikeArrow').show();
	}
}

$('#cont_foodRatings').on('click',function() {
	$('#Feedback_Food').hide();
	$('#FoodConfedLikeArrow').hide();
	$('#FoodConfedDislikeArrow').hide();
	motivation_rating_post();
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

function NextRound() {
	if (window.currConfed === window.totalConfeds-1) {
		$('#Completed').show();
	} else {
		window.currConfed++;
		Connecting();
	}
}

set_settings();

//intro_init();

//enter_username();


Connecting();

});