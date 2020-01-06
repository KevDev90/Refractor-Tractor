import './css/base.scss';
import './css/styles.scss';
import $ from 'jquery';
import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';


let hydrationData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData').then(function(response) {
  return response.json()
});
let activityData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData').then(function(response) {
  return response.json()
});
let sleepData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData').then(function(response) {
  return response.json()
});
let userData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData').then(function(response) {
  return response.json()
});
let combinedData = {
  "userData": {},
  "sleepData":{},
  "hydrationData":{},
  "activityData":{}
};

Promise.all([ userData, sleepData, hydrationData, activityData ]).then(function (values) {
  combinedData["userData"] = values[0].userData;
  combinedData["sleepData"] = values[1].sleepData;
  combinedData["hydrationData"] = values[2].hydrationData;
  combinedData["activityData"] = values[3].activityData;
  return combinedData;
}).then((result) => {
    doEverything(result);
  });

  function doEverything(result) {
    
    $(dropdownGoal).text(`DAILY STEP GOAL | ${newUser.dailyStepGoal}`);
    $(dropdownEmail).text(`EMAIL | ${newUser.email}`);
    $(dropdownName).text(newUser.name.toUpperCase());
    $(headerName).text(`${newUser.getFirstName()}'S `);

    $(hydrationUserOuncesToday).text(hydrationData.find(hydration => {
      return hydration.userID === newUser.id && hydration.date === todayDate;
    }).numOunces);

    $(hydrationFriendOuncesToday).text(userRepository.calculateAverageDailyWater(todayDate));

    $(hydrationInfoGlassesToday).text(hydrationData.find(hydration => {
      return hydration.userID === newUser.id && hydration.date === todayDate;
    }).numOunces / 8);

    $(sleepCalendarHoursAverageWeekly).text(newUser.calculateAverageHoursThisWeek(todayDate));
    $(sleepCalendarQualityAverageWeekly).text(newUser.calculateAverageQualityThisWeek(todayDate));

    $(sleepFriendLongestSleeper).text(userRepository.users.find(user => {
      return user.id === userRepository.getLongestSleepers(todayDate)
    }).getFirstName());

    $(sleepFriendWorstSleeper).text(userRepository.users.find(user => {
      return user.id === userRepository.getWorstSleepers(todayDate)
    }).getFirstName());

    $(sleepInfoHoursAverageAlltime).text(newUser.hoursSleptAverage);

    $(stepsInfoMilesWalkedToday).text(newUser.activityRecord.find(activity => {
      return (activity.date === todayDate && activity.userId === newUser.id)
    }).calculateMiles(userRepository));

    $(sleepInfoQualityAverageAlltime).text(newUser.sleepQualityAverage);

    $(sleepInfoQualityToday).text(sleepData.find(sleep => {
      return sleep.userID === newUser.id && sleep.date === todayDate;
    }).sleepQuality);

    $(sleepUserHoursToday).text(sleepData.find(sleep => {
      return sleep.userID === newUser.id && sleep.date === todayDate;
    }).hoursSlept);

    $(stairsCalendarFlightsAverageWeekly).text(newUser.calculateAverageFlightsThisWeek(todayDate));

    $(stairsCalendarStairsAverageWeekly).text((newUser.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

    $(stairsFriendFlightsAverageToday).text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));

    $(stairsInfoFlightsToday).text(activityData.find(activity => {
      return activity.userID === newUser.id && activity.date === todayDate;
    }).flightsOfStairs);

    $(stairsUserStairsToday).text(activityData.find(activity => {
      return activity.userID === newUser.id && activity.date === todayDate;
    }).flightsOfStairs * 12);

    $(stairsCalendarFlightsAverageWeekly).text(newUser.calculateAverageFlightsThisWeek(todayDate));

    $(stairsCalendarStairsAverageWeekly).text(newUser.calculateAverageFlightsThisWeek((todayDate) * 12).toFixed(0));

    $(stairsTrendingButton).on('click', function() {
      newUser.findTrendingStairsDays();
      trendingStairsPhraseContainer.html(`<p class='trend-line'>${newUser.trendingStairsDays[0]}</p>`);
    });

    $(stepsCalendarTotalActiveMinutesWeekly).text(newUser.calculateAverageMinutesActiveThisWeek(todayDate));

    $(stepsCalendarTotalStepsWeekly).text(newUser.calculateAverageStepsThisWeek(todayDate));

    $(stepsTrendingButton).on('click', function() {
      newUser.findTrendingStepDays();
      trendingStepsPhraseContainer.html(`<p class='trend-line'>${newUser.trendingStepDays[0]}</p>`);
    });

    $(stepsFriendActiveMinutesAverageToday).text(userRepository.calculateAverageMinutesActive(todayDate));

    $(stepsFriendAverageStepGoal).text(`${userRepository.calculateAverageStepGoal()}`);

    $(stepsFriendStepsAverageToday).text(userRepository.calculateAverageSteps(todayDate));

    $(stepsInfoActiveMinutesToday).text(activityData.find(activity => {
      return activity.userID === newUser.id && activity.date === todayDate;
    }).minutesActive);

    $(stepsUserStepsToday).text(activityData.find(activity => {
      return activity.userID === newUser.id && activity.date === todayDate;
    }).numSteps);

    newUser.findFriendsTotalStepsForWeek(userRepository.users, todayDate);

    newUser.friendsActivityRecords.forEach(friend => {
      $(dropdownFriendsStepsContainer).append(`<p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>`);
    });

    let friendsStepsParagraphsA = $('.friends-steps:eq( 0 )');
    let friendsStepsParagraphsB = $('.friends-steps:eq( 1 )');
    let friendsStepsParagraphsC = $('.friends-steps:eq( 3 )');

    $( friendsStepsParagraphsA ).addClass('green-text');
    $( friendsStepsParagraphsB ).addClass('yellow-text');
    $( friendsStepsParagraphsC ).addClass('red-text');
}

let user;
let newuser = new User(userData);
let userRepository;
let todayDate = "2019/09/22";
let dailyOz = $('.daily-oz');
let dropdownEmail = $('#dropdown-email');
let dropdownFriendsStepsContainer = $('#dropdown-friends-steps-container');
let dropdownGoal = $('#dropdown-goal');
let dropdownName = $('#dropdown-name');
let headerName = $('#header-name');
let hydrationCalendarCard = $('#hydration-calendar-card');
let hydrationFriendOuncesToday = $('#hydration-friend-ounces-today');
let hydrationFriendsCard = $('#hydration-friends-card');
let hydrationInfoCard = $('#hydration-info-card');
let hydrationInfoGlassesToday = $('#hydration-info-glasses-today');
let hydrationMainCard = $('#hydration-main-card');
let hydrationUserOuncesToday = $('#hydration-user-ounces-today');
let mainPage = $('main');
let profileButton = $('#profile-button');
let sleepCalendarCard = $('#sleep-calendar-card');
let sleepCalendarHoursAverageWeekly = $('#sleep-calendar-hours-average-weekly');
let sleepCalendarQualityAverageWeekly = $('#sleep-calendar-quality-average-weekly');
let sleepFriendLongestSleeper = $('#sleep-friend-longest-sleeper');
let sleepFriendsCard = $('#sleep-friends-card');
let sleepFriendWorstSleeper = $('#sleep-friend-worst-sleeper');
let sleepInfoCard = $('#sleep-info-card');
let sleepInfoHoursAverageAlltime = $('#sleep-info-hours-average-alltime');
let sleepInfoQualityAverageAlltime = $('#sleep-info-quality-average-alltime');
let sleepInfoQualityToday = $('#sleep-info-quality-today');
let sleepMainCard = $('#sleep-main-card');
let sleepUserHoursToday = $('#sleep-user-hours-today');
let sortedHydrationData;
let stairsCalendarCard = $('#stairs-calendar-card');
let stairsCalendarFlightsAverageWeekly = $('#stairs-calendar-flights-average-weekly');
let stairsCalendarStairsAverageWeekly = $('#stairs-calendar-stairs-average-weekly');
let stepsMainCard = $('#steps-main-card');
let stepsInfoCard = $('#steps-info-card');
let stepsFriendsCard = $('#steps-friends-card');
let stepsTrendingCard = $('#steps-trending-card');
let stepsCalendarCard = $('#steps-calendar-card');
let stairsFriendFlightsAverageToday = $('#stairs-friend-flights-average-today');
let stairsFriendsCard = $('#stairs-friends-card');
let stairsInfoCard = $('#stairs-info-card');
let stairsInfoFlightsToday = $('#stairs-info-flights-today');
let stairsMainCard = $('#stairs-main-card');
let stairsTrendingButton = $('.stairs-trending-button');
let stairsTrendingCard = $('#stairs-trending-card');
let stairsUserStairsToday = $('#stairs-user-stairs-today');
let stepsCalendarTotalActiveMinutesWeekly = $('#steps-calendar-total-active-minutes-weekly');
let stepsCalendarTotalStepsWeekly = $('#steps-calendar-total-steps-weekly');
let stepsFriendAverageStepGoal = $('#steps-friend-average-step-goal');
let stepsInfoActiveMinutesToday = $('#steps-info-active-minutes-today');
let stepsInfoMilesWalkedToday = $('#steps-info-miles-walked-today');
let stepsFriendActiveMinutesAverageToday = $('#steps-friend-active-minutes-average-today');
let stepsFriendStepsAverageToday = $('#steps-friend-steps-average-today');
let stepsTrendingButton = $('.steps-trending-button');
let stepsUserStepsToday = $('#steps-user-steps-today');
let trendingStepsPhraseContainer = $('.trending-steps-phrase-container');
let trendingStairsPhraseContainer = $('.trending-stairs-phrase-container');
let userInfoDropdown = $('#user-info-dropdown');

$(mainPage).on('click', showInfo);
$(profileButton).on('click', showDropdown);
$(stairsTrendingButton).on('click', updateTrendingStairsDays());
$(stepsTrendingButton).on('click', updateTrendingStepDays());

function flipCard(cardToHide, cardToShow) {
  $(cardToHide).addClass('hide');
 $(cardToShow).removeClass('hide');
}

function showDropdown() {
  $(userInfoDropdown).toggle('hide');
}

function showInfo() {
  if (event.target.classList.contains('steps-info-button')) {
    flipCard(stepsMainCard, stepsInfoCard);
  }
  if (event.target.classList.contains('steps-friends-button')) {
    flipCard(stepsMainCard, stepsFriendsCard);
  }
  if (event.target.classList.contains('steps-trending-button')) {
    flipCard(stepsMainCard, stepsTrendingCard);
  }
  if (event.target.classList.contains('steps-calendar-button')) {
    flipCard(stepsMainCard, stepsCalendarCard);
  }
  if (event.target.classList.contains('hydration-info-button')) {
    flipCard(hydrationMainCard, hydrationInfoCard);
  }
  if (event.target.classList.contains('hydration-friends-button')) {
    flipCard(hydrationMainCard, hydrationFriendsCard);
  }
  if (event.target.classList.contains('hydration-calendar-button')) {
    flipCard(hydrationMainCard, hydrationCalendarCard);
  }
  if (event.target.classList.contains('stairs-info-button')) {
    flipCard(stairsMainCard, stairsInfoCard);
  }
  if (event.target.classList.contains('stairs-friends-button')) {
    flipCard(stairsMainCard, stairsFriendsCard);
  }
  if (event.target.classList.contains('stairs-trending-button')) {
    flipCard(stairsMainCard, stairsTrendingCard);
  }
  if (event.target.classList.contains('stairs-calendar-button')) {
    flipCard(stairsMainCard, stairsCalendarCard);
  }
  if (event.target.classList.contains('sleep-info-button')) {
    flipCard(sleepMainCard, sleepInfoCard);
  }
  if (event.target.classList.contains('sleep-friends-button')) {
    flipCard(sleepMainCard, sleepFriendsCard);
  }
  if (event.target.classList.contains('sleep-calendar-button')) {
    flipCard(sleepMainCard, sleepCalendarCard);
  }
  if (event.target.classList.contains('steps-go-back-button')) {
    flipCard(event.target.parentNode, stepsMainCard);
  }
  if (event.target.classList.contains('hydration-go-back-button')) {
    flipCard(event.target.parentNode, hydrationMainCard);
  }
  if (event.target.classList.contains('stairs-go-back-button')) {
    flipCard(event.target.parentNode, stairsMainCard);
  }
  if (event.target.classList.contains('sleep-go-back-button')) {
    flipCard(event.target.parentNode, sleepMainCard);
  }
}

function updateTrendingStairsDays() {
  newUser.findTrendingStairsDays();
  $(trendingStairsPhraseContainer).html(`<p class='trend-line'>${newUser.trendingStairsDays[0]}</p>`);
}

function updateTrendingStepDays() {
  newUser.findTrendingStepDays();
  $(trendingStepsPhraseContainer).html(`<p class='trend-line'>${newUser.trendingStepDays[0]}</p>`);
}

for (var i = 0; i < dailyOz.length; i++) {
  $(dailyOz[i]).text(newUser.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0]));
}
