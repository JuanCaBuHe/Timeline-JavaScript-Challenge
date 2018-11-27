/*

Juan Camilo Bustamante Hernandez
https://www.linkedin.com/in/juankbh/
https://github.com/juan-kbh

27.10.2018

Created based on a timeline javascript challenge.
Script to run a 10-period match and add scored goals to the timeline.
No overtime between periods, only on the last one.

*/

// Global variables
let matchStarted = false;
let fullTimeInSeconds, homeTeam, awayTeam;
let timeline = document.getElementsByClassName("timeline")[0];
let homeBoard = document.getElementById("homeBoard");
let homeTimetable = document.getElementById("timetableHome");
let awayBoard = document.getElementById("awayBoard");
let awayTimetable = document.getElementById("timetableAway");
let homeGoals = 0;
let awayGoals = 0;
let homeOverTimeGoals = 0;
let awayOverTimeGoals = 0;
let fullWindowTimetablePopUp = document.getElementById("fullWindowTimetablePopUp");

// Function to start a new match
function startNewMatch (lengthOfPeriodInSeconds = 0, homeTeamName = '', awayTeamName = '') {
    // Check if a match is happening
    if (!matchStarted) {
        if (lengthOfPeriodInSeconds <= 0){
            console.log(`
            Please enter a valid lenght for periods.
            `);
        } else {
            // Remove previous match goals
            document.querySelectorAll('.goal').forEach(
                (goal) => {
                    goal.classList.add('fadeOut');
                    setTimeout(function(){
                        timeline.removeChild(goal);
                    }, 1200)
                }
            );
            // Remove previous match timetable goals
            document.querySelectorAll('.timetableGoal').forEach(
                (goal) => {
                    goal.parentElement.removeChild(goal);
                }
            );
            closeTimetable();
            matchStarted = true;
            fullTimeInSeconds = lengthOfPeriodInSeconds * 10;
            homeTeam = homeTeamName;
            awayTeam = awayTeamName;
            homeGoals = 0;
            awayGoals = 0;
            homeOverTimeGoals = 0;
            awayOverTimeGoals = 0;
            document.getElementById("homeName").innerText = homeTeam;
            document.getElementById("timetableHomeName").innerText = homeTeam;
            homeBoard.innerText = homeGoals;
            document.getElementById("awayName").innerText = awayTeam;
            document.getElementById("timetableAwayName").innerText = awayTeam;
            awayBoard.innerText = awayGoals;
        }
    } else {
        console.log(`
        Please end the current match before starting a new one
        `);
    }
}

// Function to add a new goal
function addGoal (timeInSeconds = 0, scoringTeam = '', scoringPlayer = '') {
    // Check if a match has started
    if (matchStarted) {
        let team = scoringTeam.toLowerCase();
        // Check if the team is valid
        if (team == 'home' || team == 'away') {
            // Check if goal was scored in overtime
            let overTimeGoal = timeInSeconds >= fullTimeInSeconds;
            // Translation is calculated in vw units, being that the 100% of the timeline is 80vw
            let translation = overTimeGoal ? 80 : (timeInSeconds * 8000) / (fullTimeInSeconds * 100);
            // HTML elements for timeline and timetable
            var timelineGoal = document.createElement('div');
            var timetableGoal = document.createElement('span');
            timetableGoal.classList.add('timetableGoal');
            // Add the class that correspond to the team
            timelineGoal.classList.add('goal', team);
            // Set attribute used for tooltip
            timelineGoal.setAttribute('goal', `${ (timeInSeconds > fullTimeInSeconds) ? '100+' + (timeInSeconds - fullTimeInSeconds) : timeInSeconds }' ${scoringPlayer}`);
            // Set timetable goal text
            timetableGoal.innerText = `${ (timeInSeconds > fullTimeInSeconds) ? '100+' + (timeInSeconds - fullTimeInSeconds) : timeInSeconds }' ${scoringPlayer}`
            // Update the score board and if goal is overtime we calculate the translation on Y axis and add the overtime goal to the corresponding team
            let yTranslate = 0;
            if (team == 'home') {
                homeGoals++;
                homeBoard.innerText = homeGoals;
                if (overTimeGoal) {
                    yTranslate = homeOverTimeGoals * -25;
                    homeOverTimeGoals++;
                }
            } else if (team == 'away') {
                awayGoals++;
                awayBoard.innerText = awayGoals;
                if (overTimeGoal) {
                    yTranslate = awayOverTimeGoals * 25;
                    awayOverTimeGoals++;
                }
            }
            // Goal added to the timeline
            timeline.appendChild(timelineGoal);
            console.log(`
            ${timeInSeconds}: ${scoringPlayer}, goal by ${team} team
            `);
            // Translation is added after 100 miliseconds to trigger the CSS transition
            setTimeout(function(){
                timelineGoal.style.transform = `translate(${translation}vw, ${yTranslate}px)`;
            }, 100)
            // Goal added to the timetable
            team == 'home' ? homeTimetable.appendChild(timetableGoal) : awayTimetable.appendChild(timetableGoal);
        } else {
            console.log(`
            Please enter a valid team
            `);
        }
        
    } else {
        console.log(`
        Please start a new match
        `);
    }
}

// Function to end the current match
function endMatch () {
    if (matchStarted) {
        matchStarted = false;
    }
}

// Event to open timetable
document.getElementById("fullWindowTimetableTrigger").addEventListener("click", function () {
    fullWindowTimetablePopUp.style.display = "block";
    // Opacity is added after 100 miliseconds to trigger the CSS transition
    setTimeout(function(){
        fullWindowTimetablePopUp.style.opacity = 1;
    }, 100)
}, false);

// Function to close timetable
function closeTimetable () {
    fullWindowTimetablePopUp.style.opacity = 0;
    // Display is changed after 1000 miliseconds to trigger the CSS transition
    setTimeout(function(){
        fullWindowTimetablePopUp.style.display = "none";
    }, 1000)
}

// Events to close timetable
fullWindowTimetablePopUp.addEventListener("click", closeTimetable, false);
document.getElementById("fullWindowTimetablePopUpCloseButton").addEventListener("click", closeTimetable, false);

// Stop click propagation on timetable
document.getElementsByTagName("timetable")[0].addEventListener("click", function (e) { e.stopPropagation(), false})

// Function to run a test match
function testMatch () {

    endMatch();

    closeTimetable();

    startNewMatch(10, 'Chelsea', 'Real Madrid');

    setTimeout(function(){
        addGoal(5, 'away', 'Bale');
    }, 500)
    setTimeout(function(){
        addGoal(12, 'home', 'Hazard');
    }, 1200)
    setTimeout(function(){
        addGoal(13, 'away', 'Asensio');
    }, 1300)
    setTimeout(function(){
        addGoal(25, 'home', 'Pedro');
    }, 2500)
    setTimeout(function(){
        addGoal(35, 'away', 'Asensio');
    }, 3500)
    setTimeout(function(){
        addGoal(42, 'away', 'Benzema');
    }, 4200)
    setTimeout(function(){
        addGoal(51, 'away', 'Ramos');
    }, 5100)
    setTimeout(function(){
        addGoal(55, 'home', 'Pedro');
    }, 5500)
    setTimeout(function(){
        addGoal(60, 'home', 'Morata');
    }, 6000)
    setTimeout(function(){
        addGoal(65, 'away', 'Kroos');
    }, 6500)
    setTimeout(function(){
        addGoal(69, 'home', 'Willian');
    }, 6900)
    setTimeout(function(){
        addGoal(79, 'home', 'Morata');
    }, 7900)
    setTimeout(function(){
        addGoal(81, 'home', 'Hazard');
    }, 8100)
    setTimeout(function(){
        addGoal(82, 'away', 'Bale');
    }, 8200)
    setTimeout(function(){
        addGoal(93, 'away', 'Vinicius');
    }, 9300)
    setTimeout(function(){
        addGoal(100, 'home', 'Morata');
    }, 10000)
    setTimeout(function(){
        addGoal(103, 'away', 'Bale');
    }, 10300)
    setTimeout(function(){
        addGoal(105, 'away', 'Vinicius');    
    }, 10500)

    setTimeout(function(){
        endMatch();
    }, 12000)

};

// Run test match on load
testMatch();
