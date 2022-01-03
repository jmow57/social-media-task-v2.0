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
	window.settings.profilespercondition = 6;
	window.currConfed = 0;
	window.currRatings = 0;
	window.practiceClicks = [];
	window.fullClicks = [];
	window.currCondition = 0;
	window.motivationRatings = [];
	window.confedRatings = [[1,5],[2,4],[3,3],[3,3],[4,2],[5,1]];
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

//Present instructions #1
function intro_init(){
	$('#intro1').show();

	window.ptpID = findGetParameter('ptpID');
	window.session = findGetParameter('session');
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
  			jsPsych.data.get().push(['PracticeAvatar',window.avatarPrac]);
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
		Ratings_Practice();
	})
}

function Ratings_Practice(){
	$('#RatingsPractice').show();
	ShowRatingsProfilesPractice();
	//loop through window.settings.profilespercondition
	//make folders for practice images
	//see if you can just loop through the usernames/images for that one condition
}

function ShowRatingsProfilesPractice(){
	$('.usernamedemoratings').text(window.profiles.confeds_prac[window.currConfed].username);
	$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_prac[window.currConfed].avatar+ ")");
	$('.wkdanswerdemoratings').text(window.profiles.confeds_prac[window.currConfed].response_wkd);
}

function ContinueRatings () {
	if (window.currConfed >= window.settings.profilespercondition-1) {
		$('#RatingsPractice').hide();
		window.currConfed = 0;
		jsPsych.data.get().push(['PracticeRatings',window.practiceClicks]);
		TotalsPracInstr();
	} else {
		window.currConfed++;
		ShowRatingsProfilesPractice();
	}
}

$('#like_arrow_demoratings').on('click',function () {
	window.practiceClicks[window.currConfed] = 1;
	ContinueRatings();
})

$('#dislike_arrow_demoratings').on('click',function (){
	window.practiceClicks[window.currConfed] = 0;
	ContinueRatings();
})

function TotalsPracInstr() {
	$('#ViewingInstr').show();
	$('#cont_viewinstr').on('click',function() {
		$('#ViewingInstr').hide();
		ViewingDemo();
	})
}

function ViewingDemo() {
	$('#ViewingDemo').show();

	//Load images for all profile pics
	$('#ViewPropic1').css("background-image", "url(" + window.profiles.confeds_prac[0].avatar + ")");
	$('#ViewPropic2').css("background-image", "url(" + window.profiles.confeds_prac[1].avatar + ")");
	$('#ViewPropic3').css("background-image", "url(" + window.profiles.confeds_prac[2].avatar + ")");
	$('#ViewPropic4').css("background-image", "url(" + window.profiles.confeds_prac[3].avatar + ")");
	$('#ViewPropic5').css("background-image", "url(" + window.profiles.confeds_prac[4].avatar + ")");
	$('#ViewPropic6').css("background-image", "url(" + window.profiles.confeds_prac[5].avatar + ")");
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatarPrac + ".png')");

	//Load all usernames
	$('#ViewUname1').text(window.profiles.confeds_prac[0].username);
	$('#ViewUname2').text(window.profiles.confeds_prac[1].username);
	$('#ViewUname3').text(window.profiles.confeds_prac[2].username);
	$('#ViewUname4').text(window.profiles.confeds_prac[3].username);
	$('#ViewUname5').text(window.profiles.confeds_prac[4].username);
	$('#ViewUname6').text(window.profiles.confeds_prac[5].username);
	$('.ViewMyUname').text(window.usernamePrac);

	//Load all responses
	$('#ViewResp1').text(window.profiles.confeds_prac[0].response_wkd);
	$('#ViewResp2').text(window.profiles.confeds_prac[1].response_wkd);
	$('#ViewResp3').text(window.profiles.confeds_prac[2].response_wkd);
	$('#ViewResp4').text(window.profiles.confeds_prac[3].response_wkd);
	$('#ViewResp5').text(window.profiles.confeds_prac[4].response_wkd);
	$('#ViewResp6').text(window.profiles.confeds_prac[5].response_wkd);
	$('.ViewMyResp').text(window.weekend);

	$('#viewnext').on('click',function(){
		if (window.currRatings === 0) {
			$('#ViewLikeArrow1').show();
			$('#ViewLikeNum1').text(window.practiceClicks[0]);
			$('#ViewLikeNum1').show();
			$('#ViewDislikeArrow1').show();
			$('#ViewDislikeNum1').text(Math.abs(window.practiceClicks[0]-1));
			$('#ViewDislikeNum1').show();
			window.currRatings++;
		} else if (window.currRatings === 1) {
			$('#ViewLikeArrow2').show();
			$('#ViewLikeNum2').text(window.practiceClicks[1]);
			$('#ViewLikeNum2').show();
			$('#ViewDislikeArrow2').show();
			$('#ViewDislikeNum2').text(Math.abs(window.practiceClicks[1]-1));
			$('#ViewDislikeNum2').show();
			window.currRatings++;
		} else if (window.currRatings === 2) {
			$('#ViewLikeArrow3').show();
			$('#ViewLikeNum3').text(window.practiceClicks[2]);
			$('#ViewLikeNum3').show();
			$('#ViewDislikeArrow3').show();
			$('#ViewDislikeNum3').text(Math.abs(window.practiceClicks[2]-1));
			$('#ViewDislikeNum3').show();
			window.currRatings++;
		} else if (window.currRatings === 3) {
			$('#ViewLikeArrow4').show();
			$('#ViewLikeNum4').text(window.practiceClicks[3]);
			$('#ViewLikeNum4').show();
			$('#ViewDislikeArrow4').show();
			$('#ViewDislikeNum4').text(Math.abs(window.practiceClicks[3]-1));
			$('#ViewDislikeNum4').show();
			window.currRatings++;
		} else if (window.currRatings === 4) {
			$('#ViewLikeArrow5').show();
			$('#ViewLikeNum5').text(window.practiceClicks[4]);
			$('#ViewLikeNum5').show();
			$('#ViewDislikeArrow5').show();
			$('#ViewDislikeNum5').text(Math.abs(window.practiceClicks[4]-1));
			$('#ViewDislikeNum5').show();
			window.currRatings++;
		} else if (window.currRatings === 5) {
			$('#ViewLikeArrow6').show();
			$('#ViewLikeNum6').text(window.practiceClicks[5]);
			$('#ViewLikeNum6').show();
			$('#ViewDislikeArrow6').show();
			$('#ViewDislikeNum6').text(Math.abs(window.practiceClicks[5]-1));
			$('#ViewDislikeNum6').show();
			$('#ClickOnceMore').show();
			window.currRatings++;
		} else if (window.currRatings === 6) {
			$('#ViewMyLikeArrowPrac').show();
			$('#ViewMyLikesPrac').text('0');
			$('#ViewMyLikesPrac').show();
			$('#ViewMyDislikeArrowPrac').show();
			$('#ViewMyDislikesPrac').text('0');
			$('#ViewMyDislikesPrac').show();
			$('#MyRatings1').show();
			$('#ClickOnceMore').hide();
			window.currRatings++;
		}
	})

	$('#cont_viewbox').on('click',function(){
		if (window.currRatings > 6){
			$('#ViewingDemo').hide();
			window.currRatings = 0;
			Prac_completed_instr();	
		}
		
	})

}

function Prac_completed_instr() {
	$('#PracContinueInstr').show();
	$('#cont_praccontinstr').on('click',function(){
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
  	}, window.connectTimings[window.currCondition]); //original should be set to 8000
	
  	$('#cont_connect').on('click',function() {
		$('#ConnectScreen').hide();
		$('#ConnectedtoPeople').hide();
  		motivation_rating_pre();  			
  	});	
}

var currPositionPre = $('#PreVertLineMove').position().left;

$('#moveLeft').on('mousedown',function() {
	timeoutRunning = true;
	timeout=setInterval(function(){
		if (currPositionPre > -350){
			$('#PreVertLineMove').animate({left:"-=5px"},50);
			currPositionPre -= 5;
		}
	},50);
})

$('#moveLeft').on('mouseup',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#moveLeft').on('mouseout',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#moveRight').on('mousedown',function() {
	timeout2Running = true;
	timeout2=setInterval(function() {
		if (currPositionPre < 350){
			$('#PreVertLineMove').animate({left:"+=5px"},50);
			currPositionPre += 5;
		}
	},50);
});

$('#moveRight').on('mouseup',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#moveRight').on('mouseout',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#confirmMot').on('click',function(){
	window.motivationRatings.push([$('#PreVertLineMove').position().left]);
	$('#confirmMot').hide();
	$('#cont_mot').show();
	$('#PreVertLineMove').addClass('confirmed');
	$('#moveLeft').hide();
	$('#moveRight').hide();
});


function motivation_rating_pre() {
	$('#MotivationRatings').show();
	$('#moveLeft').show();
	$('#moveRight').show();
	$('#confirmMot').show();
	$('#cont_mot').hide();
	$('#PreVertLineMove').removeClass('confirmed');
	$('#PreVertLineMove').css({left:"0px"});
	var timeout;
	var timeout2;
	currPositionPre = $('#PreVertLineMove').position().left;

	$('#cont_mot').on('click',function(){
		$('#MotivationRatings').hide();
		Question1Reminder();
	});
}

function Question1Reminder() {
	$('#Q1Reminder').show();
	$('#UnameReminder').text(window.username);
	$('#Resp1Reminder').text(window.tvmovie);
	$('#AvatarReminder').css("background-image", "url(avatars/" + window.avatar + ".png)");

	$('#cont_reminder1').on('click',function(){
		$('#Q1Reminder').hide();
		Give_Ratings_tvmovie();
	})
}

function Give_Ratings_tvmovie() {
	$('#GiveRatingsTvMovie').show();
	ShowRatingsProfiles1();
}

function ShowRatingsProfiles1(){
	if (window.currCondition === 0){
		$('.usernamedemoratings').text(window.profiles.confeds_reward1[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reward1[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reward1[window.currConfed].response_movie);
	}
	if (window.currCondition === 1){
		$('.usernamedemoratings').text(window.profiles.confeds_ambig1[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_ambig1[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_ambig1[window.currConfed].response_movie);
	}
	if (window.currCondition === 2){
		$('.usernamedemoratings').text(window.profiles.confeds_reject1[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reject1[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reject1[window.currConfed].response_movie);
	}
	if (window.currCondition === 3) {
		$('.usernamedemoratings').text(window.profiles.confeds_ambig2[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_ambig2[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_ambig2[window.currConfed].response_movie);
	}
	if (window.currCondition === 4) {
		$('.usernamedemoratings').text(window.profiles.confeds_reject2[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reject2[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reject2[window.currConfed].response_movie);
	}
}

function LoopThroughRatings1() {
	if (window.currConfed >= window.settings.profilespercondition-1) {
		$('#GiveRatingsTvMovie').hide();
		window.currConfed = 0;
		jsPsych.data.get().push(['Ratings_Cond' + window.currCondition + '_Q1',window.fullClicks]);
		window.fullClicks = [];
		Waiting();
	} else {
		window.currConfed++;
		ShowRatingsProfiles1();
	}
}

$('#like_arrow_ratings1').on('click',function (){
	window.fullClicks.push(1);
	LoopThroughRatings1();
});

$('#dislike_arrow_ratings1').on('click',function (){
	window.fullClicks.push(0);
	LoopThroughRatings1();
});

function Waiting(){
	 $('#WaitScreen').show();
	
  	setTimeout(function() {
  		$('#WaitScreen').hide();
  		ViewingRatings();
  	}, window.waitTimings[window.currCondition]); //original at 8000
}

function shuffleRatings(){
	var j, x, i;
    for (i = window.confedRatings.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = window.confedRatings[i];
        window.confedRatings[i] = window.confedRatings[j];
        window.confedRatings[j] = x;
    }
}

//Load ratings and arrows one by one until all are visible
$('#tvviewnext').on('click',function(){
  	if (window.currRatings === 0) {
  		$('#ViewtvLikeArrow1').show();
  		$('#ViewtvLikeNum1').text(window.confedRatings[0][0]);
  		$('#ViewtvLikeNum1').show();
  		$('#ViewtvDislikeArrow1').show();
  		$('#ViewtvDislikeNum1').text(window.confedRatings[0][1]);
		$('#ViewtvDislikeNum1').show();
  		window.currRatings++;
 	} else if (window.currRatings === 1) {
		$('#ViewtvLikeArrow2').show();
		$('#ViewtvLikeNum2').text(window.confedRatings[1][0]);
		$('#ViewtvLikeNum2').show();
		$('#ViewtvDislikeArrow2').show();
		$('#ViewtvDislikeNum2').text(window.confedRatings[1][1]);
		$('#ViewtvDislikeNum2').show();
		window.currRatings++;
	} else if (window.currRatings === 2) {
		$('#ViewtvLikeArrow3').show();
		$('#ViewtvLikeNum3').text(window.confedRatings[2][0]);
		$('#ViewtvLikeNum3').show();
		$('#ViewtvDislikeArrow3').show();
		$('#ViewtvDislikeNum3').text(window.confedRatings[2][1]);
		$('#ViewtvDislikeNum3').show();
		window.currRatings++;
	} else if (window.currRatings === 3) {
		$('#ViewtvLikeArrow4').show();
		$('#ViewtvLikeNum4').text(window.confedRatings[3][0]);
		$('#ViewtvLikeNum4').show();
		$('#ViewtvDislikeArrow4').show();
		$('#ViewtvDislikeNum4').text(window.confedRatings[3][1]);
		$('#ViewtvDislikeNum4').show();
		window.currRatings++;
	} else if (window.currRatings === 4) {
		$('#ViewtvLikeArrow5').show();
		$('#ViewtvLikeNum5').text(window.confedRatings[4][0]);
		$('#ViewtvLikeNum5').show();
		$('#ViewtvDislikeArrow5').show();
		$('#ViewtvDislikeNum5').text(window.confedRatings[4][1]);
		$('#ViewtvDislikeNum5').show();
		window.currRatings++;
	} else if (window.currRatings === 5) {
		$('#ViewtvLikeArrow6').show();
		$('#ViewtvLikeNum6').text(window.confedRatings[5][0]);
		$('#ViewtvLikeNum6').show();
		$('#ViewtvDislikeArrow6').show();
		$('#ViewtvDislikeNum6').text(window.confedRatings[5][1]);
		$('#ViewtvDislikeNum6').show();
		window.currRatings++;
	} else if (window.currRatings === 6) {
		$('#ViewMytvLikeArrowPrac').show();
		$('#ViewMytvLikesPrac').text(window.curr_ptp_likes);
		$('#ViewMytvLikesPrac').show();
		$('#ViewMytvDislikeArrowPrac').show();
		$('#ViewMytvDislikesPrac').text(window.curr_ptp_dislikes);
		$('#ViewMytvDislikesPrac').show();
		$('#MyRatings2').show();
		window.currRatings++;
	}
});

function ViewingRatings(){
	var confeds_profiles;
	var ptp_likes;
	var ptp_dislikes;
	$('#RatingsView').show();

	//Hide all ratings and numbers at the beginning
	$('#ViewtvLikeArrow1').hide();
	$('#ViewtvLikeNum1').hide();
	$('#ViewtvDislikeArrow1').hide();
	$('#ViewtvDislikeNum1').hide();
	$('#ViewtvLikeArrow2').hide();
	$('#ViewtvLikeNum2').hide();
	$('#ViewtvDislikeArrow2').hide();
	$('#ViewtvDislikeNum2').hide();
	$('#ViewtvLikeArrow3').hide();
	$('#ViewtvLikeNum3').hide();
	$('#ViewtvDislikeArrow3').hide();
	$('#ViewtvDislikeNum3').hide();
	$('#ViewtvLikeArrow4').hide();
	$('#ViewtvLikeNum4').hide();
	$('#ViewtvDislikeArrow4').hide();
	$('#ViewtvDislikeNum4').hide();
	$('#ViewtvLikeArrow5').hide();
	$('#ViewtvLikeNum5').hide();
	$('#ViewtvDislikeArrow5').hide();
	$('#ViewtvDislikeNum5').hide();
	$('#ViewtvLikeArrow6').hide();
	$('#ViewtvLikeNum6').hide();
	$('#ViewtvDislikeArrow6').hide();
	$('#ViewtvDislikeNum6').hide();
	$('#ViewMytvLikeArrowPrac').hide();
	$('#ViewMytvLikesPrac').hide();
	$('#ViewMytvDislikeArrowPrac').hide();
	$('#ViewMytvDislikesPrac').hide();
	$('#MyRatings2').hide();

	//Shuffle the order of the confederate ratings
	shuffleRatings();
	jsPsych.data.get().push(['ConfedRatings_Cond' + window.currCondition + '_Q1',window.confedRatings])
	window.confedRatings = [[1,5],[2,4],[3,3],[3,3],[4,2],[5,1]];


	//Set info based on condition
	if (window.currCondition === 0) {
		confeds_profiles = window.profiles.confeds_reward1;
		window.curr_ptp_likes = '5';
		window.curr_ptp_dislikes = '1';
	} else if (window.currCondition === 1) {
		confeds_profiles = window.profiles.confeds_ambig1;
		window.curr_ptp_likes = '3';
		window.curr_ptp_dislikes = '3';
	} else if (window.currCondition === 2) {
		confeds_profiles = window.profiles.confeds_reject1;
		window.curr_ptp_likes = '1';
		window.curr_ptp_dislikes = '5';
	} else if (window.currCondition === 3) {
		confeds_profiles = window.profiles.confeds_ambig2;
		window.curr_ptp_likes = '3';
		window.curr_ptp_dislikes = '3';
	} else if (window.currCondition === 4) {
		confeds_profiles = window.profiles.confeds_reject2;
		window.curr_ptp_likes = '0';
		window.curr_ptp_dislikes = '6';
	}

	//Load images for all profile pics
	$('#ViewtvPropic1').css("background-image", "url(" + confeds_profiles[0].avatar + ")");
	$('#ViewtvPropic2').css("background-image", "url(" + confeds_profiles[1].avatar + ")");
	$('#ViewtvPropic3').css("background-image", "url(" + confeds_profiles[2].avatar + ")");
	$('#ViewtvPropic4').css("background-image", "url(" + confeds_profiles[3].avatar + ")");
	$('#ViewtvPropic5').css("background-image", "url(" + confeds_profiles[4].avatar + ")");
	$('#ViewtvPropic6').css("background-image", "url(" + confeds_profiles[5].avatar + ")");
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatar + ".png')");

	//Load all usernames
	$('#ViewtvUname1').text(confeds_profiles[0].username);
	$('#ViewtvUname2').text(confeds_profiles[1].username);
	$('#ViewtvUname3').text(confeds_profiles[2].username);
	$('#ViewtvUname4').text(confeds_profiles[3].username);
	$('#ViewtvUname5').text(confeds_profiles[4].username);
	$('#ViewtvUname6').text(confeds_profiles[5].username);
	$('.ViewMyUname').text(window.username);

	//Load all responses
	$('#ViewtvResp1').text(confeds_profiles[0].response_movie);
	$('#ViewtvResp2').text(confeds_profiles[1].response_movie);
	$('#ViewtvResp3').text(confeds_profiles[2].response_movie);
	$('#ViewtvResp4').text(confeds_profiles[3].response_movie);
	$('#ViewtvResp5').text(confeds_profiles[4].response_movie);
	$('#ViewtvResp6').text(confeds_profiles[5].response_movie);
	$('.ViewMyResp').text(window.tvmovie);

	$('#cont_tvviewbox').on('click',function(){
		if (window.currRatings > 6){
			$('#RatingsView').hide();
			window.currRatings = 0;
			Question2Reminder();	
		}
		
	})

}

function Question2Reminder(){
	$('#Q2Reminder').show();
	$('#Uname2Reminder').text(window.username);
	$('#Resp2Reminder').text(window.food);
	$('#Avatar2Reminder').css("background-image", "url(avatars/" + window.avatar + ".png)");

	$('#cont_reminder2').on('click',function(){
		$('#Q2Reminder').hide();
		Give_Ratings_Food();
	});
}
//When repeating conditions, function should take an argument of which condition you are on
//which will tell the function where to look for profile info
//Just make sure to store the button responses in the correct locations.
function Give_Ratings_Food(){
	$('#GiveRatingsFood').show();
	ShowRatingsProfiles2();
}

function ShowRatingsProfiles2(){
	if (window.currCondition === 0){
		$('.usernamedemoratings').text(window.profiles.confeds_reward1[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reward1[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reward1[window.currConfed].response_food);
	}
	if (window.currCondition === 1){
		$('.usernamedemoratings').text(window.profiles.confeds_ambig1[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_ambig1[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_ambig1[window.currConfed].response_food);
	}
	if (window.currCondition === 2){
		$('.usernamedemoratings').text(window.profiles.confeds_reject1[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reject1[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reject1[window.currConfed].response_food);
	}
	if (window.currCondition === 3) {
		$('.usernamedemoratings').text(window.profiles.confeds_ambig2[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_ambig2[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_ambig2[window.currConfed].response_food);
	}
	if (window.currCondition === 4) {
		$('.usernamedemoratings').text(window.profiles.confeds_reject2[window.currConfed].username);
		$('.propicdemoratings').css("background-image", "url(" + window.profiles.confeds_reject2[window.currConfed].avatar+ ")");
		$('.wkdanswerdemoratings').text(window.profiles.confeds_reject2[window.currConfed].response_food);
	}
}

function LoopThroughRatings2(){
	if (window.currConfed >= window.settings.profilespercondition-1) {
		$('#GiveRatingsFood').hide();
		window.currConfed = 0;
		jsPsych.data.get().push(['Ratings_Cond' + window.currCondition + '_Q2',window.fullClicks])
		window.fullClicks = [];
		Waiting2();
	} else {
		window.currConfed++;
		ShowRatingsProfiles2();
	}
}


$('#like_arrow_ratings2').on('click',function (){
	window.fullClicks.push(1);
	LoopThroughRatings2();
});

$('#dislike_arrow_ratings2').on('click',function (){
	window.fullClicks.push(0);
	LoopThroughRatings2();
});

function Waiting2(){
	$('#WaitScreen').show();
	
  	setTimeout(function() {
  		$('#WaitScreen').hide();
  		ViewingRatings2();
  	}, window.waitTimings[window.currCondition]); //original set to 8000
}

$('#foodviewnext').on('click',function(){
  	if (window.currRatings === 0) {
  		$('#ViewfoodLikeArrow1').show();
  		$('#ViewfoodLikeNum1').text(window.confedRatings[0][0]);
  		$('#ViewfoodLikeNum1').show();
  		$('#ViewfoodDislikeArrow1').show();
  		$('#ViewfoodDislikeNum1').text(window.confedRatings[0][1]);
		$('#ViewfoodDislikeNum1').show();
  		window.currRatings++;
 	} else if (window.currRatings === 1) {
		$('#ViewfoodLikeArrow2').show();
		$('#ViewfoodLikeNum2').text(window.confedRatings[1][0]);
		$('#ViewfoodLikeNum2').show();
		$('#ViewfoodDislikeArrow2').show();
		$('#ViewfoodDislikeNum2').text(window.confedRatings[1][1]);
		$('#ViewfoodDislikeNum2').show();
		window.currRatings++;
	} else if (window.currRatings === 2) {
		$('#ViewfoodLikeArrow3').show();
		$('#ViewfoodLikeNum3').text(window.confedRatings[2][0]);
		$('#ViewfoodLikeNum3').show();
		$('#ViewfoodDislikeArrow3').show();
		$('#ViewfoodDislikeNum3').text(window.confedRatings[2][1]);
		$('#ViewfoodDislikeNum3').show();
		window.currRatings++;
	} else if (window.currRatings === 3) {
		$('#ViewfoodLikeArrow4').show();
		$('#ViewfoodLikeNum4').text(window.confedRatings[3][0]);
		$('#ViewfoodLikeNum4').show();
		$('#ViewfoodDislikeArrow4').show();
		$('#ViewfoodDislikeNum4').text(window.confedRatings[3][1]);
		$('#ViewfoodDislikeNum4').show();
		window.currRatings++;
	} else if (window.currRatings === 4) {
		$('#ViewfoodLikeArrow5').show();
		$('#ViewfoodLikeNum5').text(window.confedRatings[4][0]);
		$('#ViewfoodLikeNum5').show();
		$('#ViewfoodDislikeArrow5').show();
		$('#ViewfoodDislikeNum5').text(window.confedRatings[4][1]);
		$('#ViewfoodDislikeNum5').show();
		window.currRatings++;
	} else if (window.currRatings === 5) {
		$('#ViewfoodLikeArrow6').show();
		$('#ViewfoodLikeNum6').text(window.confedRatings[5][0]);
		$('#ViewfoodLikeNum6').show();
		$('#ViewfoodDislikeArrow6').show();
		$('#ViewfoodDislikeNum6').text(window.confedRatings[5][1]);
		$('#ViewfoodDislikeNum6').show();
		window.currRatings++;
	} else if (window.currRatings === 6) {
		$('#ViewMyfoodLikeArrowPrac').show();
		$('#ViewMyfoodLikesPrac').text(window.curr_ptp_likes);
		$('#ViewMyfoodLikesPrac').show();
		$('#ViewMyfoodDislikeArrowPrac').show();
		$('#ViewMyfoodDislikesPrac').text(window.curr_ptp_dislikes);
		$('#ViewMyfoodDislikesPrac').show();
		$('#MyRatings3').show();
		window.currRatings++;
	}
});

function ViewingRatings2(){
	$('#RatingsView2').show();
	
	//Hide all elements that will show up after clicks
	$('#ViewfoodLikeArrow1').hide();
	$('#ViewfoodLikeNum1').hide();
	$('#ViewfoodDislikeArrow1').hide();
	$('#ViewfoodDislikeNum1').hide();
	$('#ViewfoodLikeArrow2').hide();
	$('#ViewfoodLikeNum2').hide();
	$('#ViewfoodDislikeArrow2').hide();
	$('#ViewfoodDislikeNum2').hide();
	$('#ViewfoodLikeArrow3').hide();
	$('#ViewfoodLikeNum3').hide();
	$('#ViewfoodDislikeArrow3').hide();
	$('#ViewfoodDislikeNum3').hide();
	$('#ViewfoodLikeArrow4').hide();
	$('#ViewfoodLikeNum4').hide();
	$('#ViewfoodDislikeArrow4').hide();
	$('#ViewfoodDislikeNum4').hide();
	$('#ViewfoodLikeArrow5').hide();
	$('#ViewfoodLikeNum5').hide();
	$('#ViewfoodDislikeArrow5').hide();
	$('#ViewfoodDislikeNum5').hide();
	$('#ViewfoodLikeArrow6').hide();
	$('#ViewfoodLikeNum6').hide();
	$('#ViewfoodDislikeArrow6').hide();
	$('#ViewfoodDislikeNum6').hide();
	$('#ViewMyfoodLikeArrowPrac').hide();
	$('#ViewMyfoodLikesPrac').hide();
	$('#ViewMyfoodDislikeArrowPrac').hide();
	$('#ViewMyfoodDislikesPrac').hide();
	$('#MyRatings3').hide();

	//Shuffle confederate ratings
	shuffleRatings();
	jsPsych.data.get().push(['ConfedRatings_Cond' + window.currCondition + '_Q2',window.confedRatings]);
	window.confedRatings = [[1,5],[2,4],[3,3],[3,3],[4,2],[5,1]];

	//Set stuff based on condition
	if (window.currCondition === 0) {
		confeds_profiles = window.profiles.confeds_reward1;
		window.curr_ptp_likes = '4';
		window.curr_ptp_dislikes = '2';
	} else if (window.currCondition === 1) {
		confeds_profiles = window.profiles.confeds_ambig1;
		window.curr_ptp_likes = '3';
		window.curr_ptp_dislikes = '3';
	} else if (window.currCondition === 2) {
		confeds_profiles = window.profiles.confeds_reject1;
		window.curr_ptp_likes = '0';
		window.curr_ptp_dislikes = '6';
	} else if (window.currCondition === 3) {
		confeds_profiles = window.profiles.confeds_ambig2;
		window.curr_ptp_likes = '3';
		window.curr_ptp_dislikes = '3';
	} else if (window.currCondition === 4) {
		confeds_profiles = window.profiles.confeds_reject2;
		window.curr_ptp_likes = '1';
		window.curr_ptp_dislikes = '5';
	}

	//Load images for all profile pics
	$('#ViewfoodPropic1').css("background-image", "url(" + confeds_profiles[0].avatar + ")");
	$('#ViewfoodPropic2').css("background-image", "url(" + confeds_profiles[1].avatar + ")");
	$('#ViewfoodPropic3').css("background-image", "url(" + confeds_profiles[2].avatar + ")");
	$('#ViewfoodPropic4').css("background-image", "url(" + confeds_profiles[3].avatar + ")");
	$('#ViewfoodPropic5').css("background-image", "url(" + confeds_profiles[4].avatar + ")");
	$('#ViewfoodPropic6').css("background-image", "url(" + confeds_profiles[5].avatar + ")");
	$('.ViewMyPropic').css("background-image", "url('avatars/" + window.avatar + ".png')");

	//Load all usernames
	$('#ViewfoodUname1').text(confeds_profiles[0].username);
	$('#ViewfoodUname2').text(confeds_profiles[1].username);
	$('#ViewfoodUname3').text(confeds_profiles[2].username);
	$('#ViewfoodUname4').text(confeds_profiles[3].username);
	$('#ViewfoodUname5').text(confeds_profiles[4].username);
	$('#ViewfoodUname6').text(confeds_profiles[5].username);
	$('.ViewMyUname').text(window.username);

	//Load all responses
	$('#ViewfoodResp1').text(confeds_profiles[0].response_food);
	$('#ViewfoodResp2').text(confeds_profiles[1].response_food);
	$('#ViewfoodResp3').text(confeds_profiles[2].response_food);
	$('#ViewfoodResp4').text(confeds_profiles[3].response_food);
	$('#ViewfoodResp5').text(confeds_profiles[4].response_food);
	$('#ViewfoodResp6').text(confeds_profiles[5].response_food);
	$('.ViewMyResp').text(window.food);

	$('#cont_foodviewbox').on('click',function(){
		if (window.currRatings > 6){
			$('#RatingsView2').hide();
			window.currRatings = 0;
			motivation_rating_post();	
		}
		
	})
}

currPositionPost = $('#PostVertLineMove').position().left;

$('#PostmoveLeft').on('mousedown',function() {
	timeoutRunning = true;
	timeout=setInterval(function(){
		if (currPositionPost > -350){
			$('#PostVertLineMove').animate({left:"-=5px"},50);
			currPositionPost -= 5;
		}
	},50);
});

$('#PostmoveLeft').on('mouseup',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#PostmoveLeft').on('mouseout',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#PostmoveRight').on('mousedown',function() {
	timeout2Running = true;
	timeout2=setInterval(function() {
		if (currPositionPost < 350){
			$('#PostVertLineMove').animate({left:"+=5px"},50);
			currPositionPost += 5;
		}
	},50);
});

$('#PostmoveRight').on('mouseup',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#PostmoveRight').on('mouseout',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#PostconfirmMot').on('click',function(){
	window.motivationRatings[0].push($('#PostVertLineMove').position().left);
	jsPsych.data.get().push(['MotivationRatings_Cond' + window.currCondition,window.motivationRatings])
	window.motivationRatings = [];
	$('#PostconfirmMot').hide();
	$('#Postcont_mot').show();
	$('#PostVertLineMove').addClass('confirmed');
	$('#PostmoveLeft').hide();
	$('#PostmoveRight').hide();
});

function motivation_rating_post(){
	var timeout
	var timeout2
	$('#MotivationRatingsPost').show();
	$('#PostmoveLeft').show();
	$('#PostmoveRight').show();
	$('#PostconfirmMot').show();
	$('#Postcont_mot').hide();
	$('#PostVertLineMove').removeClass('confirmed');
	$('#PostVertLineMove').css({left:"0px"});
	currPositionPost = $('#PostVertLineMove').position().left;

	$('#Postcont_mot').on('click',function(){
		$('#MotivationRatingsPost').hide();
		CompletedCondition();
	});
}

$('#cont_complete').on('click', function(){
	$('#Completed_Round').hide();
	if (window.currCondition >= 4){
		TaskCompleted();
	}

	if (window.currCondition === 0) {
		PostRewardQuestionnaire();
	}

	if (window.currCondition === 2) {
		PostRejectQuestionnaire();
	}

	if (window.currCondition === 1 || window.currCondition === 3){
		window.currCondition++;
		Connecting();
	}
});

function CompletedCondition(){
	$('#Completed_Round').show();
}


currPositionQ = $('#qVertLineMove').position().left;

$('#qmoveLeft').on('mousedown',function() {
	timeoutRunning = true;
	timeout=setInterval(function(){
		if (currPositionQ > -350){
			$('#qVertLineMove').animate({left:"-=5px"},50);
			currPositionQ -= 5;
		}
	},50);
});

$('#qmoveLeft').on('mouseup',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#qmoveLeft').on('mouseout',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#qmoveRight').on('mousedown',function() {
	timeout2Running = true;
	timeout2=setInterval(function() {
		if (currPositionQ < 350){
			$('#qVertLineMove').animate({left:"+=5px"},50);
			currPositionQ += 5;
		}
	},50);
});

$('#qmoveRight').on('mouseup',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#qmoveRight').on('mouseout',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#qconfirmMot').on('click',function(){
	window.postRewardAnswers.push($('#qVertLineMove').position().left);
	$('#qconfirmMot').hide();
	$('#qcont_mot').show();
	$('#qVertLineMove').addClass('confirmed');
	$('#qmoveLeft').hide();
	$('#qmoveRight').hide();
	$('#qcont_mot').show();
});

$('#qcont_mot').on('click', function(){
	if (QuestionNum >= 23) {
		$('#PostRewardQs').hide();
		window.currCondition++;
		jsPsych.data.get().push(['PostRewardQuestionnaires',window.postRewardAnswers]);
		QuestionnairesCompleted();
	}

	QuestionNum++;
	$('#postQuestions').text(window.questionnaireQs.questions[QuestionNum].q);
	$('#postQuestions').show();
	$('#qmoveLeft').show();
	$('#qmoveRight').show();
	$('#qconfirmMot').show();
	$('#qcont_mot').hide();
	$('#qVertLineMove').removeClass('confirmed');
	$('#qVertLineMove').css({left:"0px"});
	currPositionQ = $('#qVertLineMove').position().left;

});

function PostRewardQuestionnaire() {
	$('#PostRewardQs').show();
	$('#qmoveLeft').show();
	$('#qmoveRight').show();
	$('#qconfirmMot').show();
	$('#qcont_mot').hide();
	$('#qVertLineMove').removeClass('confirmed');
	$('#qVertLineMove').css({left:"0px"});

	currPositionQ = $('#qVertLineMove').position().left;
	QuestionNum = 0;
	$('#postQuestions').text(window.questionnaireQs.questions[QuestionNum].q);
	$('#postQuestions').show();
}

currPositionQ2 = $('#q2VertLineMove').position().left;

$('#q2moveLeft').on('mousedown',function() {
	timeoutRunning = true;
	timeout=setInterval(function(){
		if (currPositionQ2 > -350){
			$('#q2VertLineMove').animate({left:"-=5px"},50);
			currPositionQ2 -= 5;
		}
	},50);
});

$('#q2moveLeft').on('mouseup',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#q2moveLeft').on('mouseout',function() {
	if (timeoutRunning){
		clearInterval(timeout);
		timeoutRunning = false;
	}
});

$('#q2moveRight').on('mousedown',function() {
	timeout2Running = true;
	timeout2=setInterval(function() {
		if (currPositionQ2 < 350){
			$('#q2VertLineMove').animate({left:"+=5px"},50);
			currPositionQ2 += 5;
		}
	},50);
});

$('#q2moveRight').on('mouseup',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#q2moveRight').on('mouseout',function(){
	if (timeout2Running){
		clearInterval(timeout2);
		timeout2Running = false;
	}
});

$('#q2confirmMot').on('click',function(){
	window.postRejectAnswers.push($('#q2VertLineMove').position().left);
	$('#q2confirmMot').hide();
	$('#q2cont_mot').show();
	$('#q2VertLineMove').addClass('confirmed');
	$('#q2moveLeft').hide();
	$('#q2moveRight').hide();
	$('#q2cont_mot').show();
});

$('#q2cont_mot').on('click', function(){
	if (QuestionNum2 >= 23) {
		$('#PostRejectQs').hide();
		window.currCondition++;
		jsPsych.data.get().push(['PostRejectionQuestionnaires',window.postRejectAnswers]);
		QuestionnairesCompleted();
	}

	QuestionNum2++;
	$('#postQuestions2').text(window.questionnaireQs.questions[QuestionNum2].q);
	$('#postQuestions2').show();
	$('#q2moveLeft').show();
	$('#q2moveRight').show();
	$('#q2confirmMot').show();
	$('#q2cont_mot').hide();
	$('#q2VertLineMove').removeClass('confirmed');
	$('#q2VertLineMove').css({left:"0px"});
	currPositionQ2 = $('#q2VertLineMove').position().left;

});

function PostRejectQuestionnaire() {
	$('#PostRejectQs').show();
	$('#q2moveLeft').show();
	$('#q2moveRight').show();
	$('#q2confirmMot').show();
	$('#q2cont_mot').hide();
	$('#q2VertLineMove').removeClass('confirmed');
	$('#q2VertLineMove').css({left:"0px"});

	currPositionQ2 = $('#q2VertLineMove').position().left;
	QuestionNum2 = 0;
	$('#postQuestions2').text(window.questionnaireQs.questions[QuestionNum2].q);
	$('#postQuestions2').show();
}

function QuestionnairesCompleted() {
	$('#QsCompleted').show();
	$('#cont_qcomp').on('click',function(){
		$('#QsCompleted').hide();
		Connecting();
	})
}

function TaskCompleted(){
	$('#ThankYou').show();

	window.finishExperimentAndSave();
}


set_settings();

intro_init();

//enter_username();


});