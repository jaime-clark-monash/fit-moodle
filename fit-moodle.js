function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

function ActivateFeedback() {
  if (document.getElementsByName("setmode").length < 1 || !document.getElementsByName("setmode")[0].checked) {
        var button = document.createElement("Button");
        button.innerHTML = "<div title='Any feedback about your unit's content?' class='needHBtn pulse needHBtn-bg'><strong><span class='fa-regular fa-thumbs-up needHBtn'></span></strong></div>";
        button.style = "bottom:0;right:0;position:absolute;border:none;background-color:transparent;"
        button.id = "feedbackButton";

        document.body.appendChild(button);
        document.body.appendChild(createElementFromHTML('<div id="feedbackPopup" class="popup"> <div class="popup-content"> <span class="close" onclick="closeFeedbackPopup()">&times;</span> <h2><i class="fa-regular fa-thumbs-up"></i> Any feedback about the content on this page?</h2> <hr> <div class="wrap"> <form name="feedbackForm"> <label class="statement" for="likert"> <i class="fa-solid fa-scale-unbalanced-flip"></i> How satisfied are you with content on this page?</label> <ul class="likert"> <li> <input type="radio" name="likert" value="5"> <label for="likert">Very satisfied</label> </li> <li> <input type="radio" name="likert" value="4"> <label for="likert">Somewhat satisfied</label> </li> <li> <input type="radio" name="likert" value="3"> <label for="likert">Neither satisfied nor dissatisfied</label> </li> <li> <input type="radio" name="likert" value="2"> <label for="likert">Somewhat dissatisfied</label> </li> <li> <input type="radio" name="likert" value="1"> <label for="likert">Very dissatisfied</label> </li> </ul> <label class="statement" for="feedbackText"><i class="fa-regular fa-comment-dots"></i> Is there any additional feedback you would like to provide about the content on this page?</label><br> <textarea style="width:100%" rows=5 name="feedbackText"></textarea> <hr> <div class="btn-group" role="group" aria-label="Basic example"> <button type="button" class="btn btn-outline-success" onclick="postFeedback()"><i class="fa-regular fa-paper-plane-top"></i> Submit</button> <button type="button" class="btn btn-outline-danger" onclick="closeFeedbackPopup()"><i class="fa-solid fa-xmark"></i> Cancel</button> </div> </form> </div> </div> </div>'));
        document.body.appendChild(createElementFromHTML('<div id="snackbar">Thanks for your feedback!</div>'));

        var feedbackButton = document.getElementById('feedbackButton');
        var feedbackPopup = document.getElementById('feedbackPopup');
    
        feedbackButton.addEventListener('click', function () {
            openFeedbackPopup();
        });
  }
}

function ActivateHelp() {
  if (document.getElementsByName("setmode").length > 0 && document.getElementsByName("setmode")[0].checked) {
    var button = document.createElement("Button");
    button.innerHTML = "<div title='Need help with Moodle?' class='needHBtn pulse needHBtn-bg'><strong><span class='fa fa-question needHBtn'></span></strong></div>";
    button.style = "bottom:0;right:0;position:absolute;border:none;background-color:transparent;"
    button.id = "helpButton"

    document.body.appendChild(button);
    document.body.appendChild(createElementFromHTML('<div id="helpPopup" class="popup"> <div class="popup-content"> <span class="close" onclick="closePopup()">&times;</span> <h2><i class="fa-solid fa-truck-medical"></i> Need Help?</h2> <hr> <form class=\'form-inline my-2 my-lg-0\'> <div class=\'input-group\'> <input id=\'SearchEngineText\' class=\'form-control mr-sm-2\' type=\'search\' placeholder=\'Search TeachHQ Articles\' aria-label=\'Search\'><button id="searchEngineButton" class="btn btn-outline-secondary" type="button" onclick="SearchEngine(\'https://www.monash.edu/learning-teaching/teachhq/search?query=\')"><i class="fa-solid fa-magnifying-glass"></i> Search</button></div> </form> <hr> <strong><i class="fa-solid fa-newspaper"></i> Suggested Articles</strong><br> <p id=\'suggestedArticles\'> <a href=\'https://www.monash.edu/learning-teaching/TeachHQ/moodle/digital-learning-uplift/new-moodle-template\' target=\'_blank\'>New Monash Moodle template</a> </p> <hr> <strong><i class="fa-solid fa-video"></i> Suggested Videos</strong><br> <p id=\'suggestedVideos\'> <a href=\'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d\' target=\'_blank\'>New Monash Moodle template</a> </p> <hr> <p><strong>Still need help?</strong> <a href=\'https://infotech-monash.atlassian.net/servicedesk/customer/portal/59/group/155/create/189\' target=\'_blank\'>Raise a request with EDiQ</a>.</p> </div> </div>'));

    var helpButton = document.getElementById('helpButton');
    var helpPopup = document.getElementById('helpPopup');

    // Event listener for the help button
    helpButton.addEventListener('click', function () {
        openPopup();
    });

    var input = document.getElementById("SearchEngineText");

    // Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("searchEngineButton").click();
        }
    });

    window.addEventListener('load', function () {
      var title = "NA";
      var subtitle = "NA";
      var othertitle = "NA"
      try {
        title = document.getElementsByTagName('h1')[1].innerText.trim();
      } catch { };
      try {
        subtitle = document.getElementsByTagName('h2')[0].innerText.trim();
        if(subtitle == "Need Help?")
        {
            subtitle = document.getElementsByTagName('h2')[1].innerText.trim();
        }
      } catch { };
      try {
        othertitle = document.getElementsByTagName('h3')[1].innerText.trim();
      } catch { };
      var url = window.location.href

      Context(title, subtitle, othertitle, url);
    });
  }
}

function ActivateRestrictions() {
  window.addEventListener('load', function () {
    var allowed_users = [
        "rajib.uddin@monash.edu",
        "jaime.clark@monash.edu",
        "emma.yench@monash.edu",
        "ross.mcqueen@monash.edu",
        "phillip.abramson@monash.edu",
        "matt.chen@monash.edu"
    ];
    if ($.inArray($(".myprofileitem a").eq(1).text().toLowerCase(), allowed_users) < 0) {
      let element = document.evaluate("//ul[@class='nav more-nav nav-tabs']/li[@data-key='editsettings']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      element.singleNodeValue.remove();
      if ($(location).attr('href').includes('https: //learning.monash.edu/course/edit.php?id=')) {
        $('input').prop('disabled', true);
        $('select').prop('disabled', true);
        $('textarea').prop('disabled', true);
      }
    }
  });
}

function openPopup() {
  helpPopup.style.display = 'block';
}

function closePopup() {
  helpPopup.style.display = 'none';
}

function SearchEngine(rootAddress) {
  searchTerm = $('#SearchEngineText').val();
  address = rootAddress + searchTerm;
  window.open(address);
  $('#SearchEngineText').val('');
}

function CreateHref(location, link, text) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(text);
    a.appendChild(linkText);
    a.title = text;
    a.href = link;
    a.target = '_blank';
    var br = document.createElement("br");
    document.getElementById(location).appendChild(br);
    document.getElementById(location).appendChild(a);
}

function Context(title, subtitle, othertitle, url) {
    if(title == "Unit dashboard")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=8fe03c67-c103-4de8-8fe7-b0bd0026b448', 'Unit Dashboard section');
    }
    else if(title == "Unit information")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=5afbba83-8e77-481d-beba-b0ca00546e72', 'Unit Information section');
    }
    else if(title == "Schedule")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=e9807fde-bce0-41ef-8e02-b0c9018b48de', 'Schedule section');
    }
    else if(title == "Learning")
    {
        //todo
    }
    else if(title == "Assessments")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=2fc1af4f-b168-46d5-9a7e-b0d2001d4f68', 'Assessments section');
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=b0e939dd-03d2-4e50-98d6-b0db017c7873', 'Creating Quizzes and Question Banks');
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=f208f0df-d874-4e79-bec1-b0d200581309', 'Creating an assignment activity');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/assignment/how-to/assignments#tabs__3290221-01', 'Create a Moodle assignment activity');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/quiz/how-to/add-and-customise-a-quiz#tabs__3288424-01', 'Add and customise a Quiz');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/Assessment/eassessment/how-to/create-an-eassessment-grade-sync-activity', 'Create an eAssessment Grade Sync activity');
    }
    else if(title == "Forums")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=71b42313-b9fa-44bf-b4d9-b0c70050dd05', 'Forums section');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/forum/how-to/add-a-forum#tabs__3299059-01', 'Add a Forum');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/forum/how-to/use-a-forum-as-an-assessment#tabs__3299124-01', 'Use a forum as an assessment');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/forum/how-to/set-up-grading#tabs__3299130-01', 'Set up forum grading');
    }
    else if(title == "Support")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=71b42313-b9fa-44bf-b4d9-b0c70050dd05', 'Support section');
    }
    else if(title == "Additional information and resources")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=67e757f3-7b74-4f73-8aff-b0ca0181095c', 'Additional Information and Resources section');
    }
    else if(title == "Getting started")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=abac84b7-533d-49b9-a2e1-b0ca017a78aa', 'Getting Started section');
    }
    else if(title == "Staff resources")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=657de210-0bf9-4bcf-8426-b0c90019fb2b', 'Staff Resources section');
    }
    else if(title == "During the break")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=657de210-0bf9-4bcf-8426-b0c90019fb2b', 'During the Break section');
    }
    else if(subtitle == "Grader report")
    {
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/grader-report#tabs__3298162-01', 'Using Grader report');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/import-and-export-grades#tabs__3298205-01', 'Import and export grades');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/bulk-insert-or-override-grades#tabs__3298208-01', 'Bulk insert or override grades');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/bulk-insert-or-override-grades#tabs__3298208-01', 'Manage results');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/submit-results#tabs__3298239-01', 'Submit results');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/amend-results#tabs__3298244-01', 'Amend results');
    }
    else if(subtitle == "Gradebook setup")
    {
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/set-up-moodle-gradebook#tabs__3320493-01', 'Set up Moodle Gradebook');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/apply-hurdles-in-gradebook#tabs__3298078-01', 'Apply Hurdles in Gradebook');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/bulk-insert-or-override-grades#tabs__3298208-01', 'Manage results');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/submit-results#tabs__3298239-01', 'Submit results');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/gradebook/how-to/amend-results#tabs__3298244-01', 'Amend results');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/Assessment/eassessment/how-to/create-an-eassessment-grade-sync-activity', 'Create an eAssessment Grade Sync activity');
    }
    else if(subtitle == "Enrolled users")
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=847b7602-03e2-4212-a0cb-b0c2001bab71', 'Enrolling academics');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/moodle-setup/how-to/manually-assign-roles#tabs__3318429-01', 'Manually assign roles');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/moodle-setup/how-to/set-groups-and-groupings-in-moodle#tabs__3254627-01', 'Create groups and groupings in Moodle');
    }
    else if(subtitle.includes("Assignment"))
    {
        //Assignment settings
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=f208f0df-d874-4e79-bec1-b0d200581309', 'Creating an assignment activity');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/assignment/how-to/assignments#tabs__3290221-01', 'Create a Moodle assignment activity');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/assignment/how-to/extensions-and-resubmissions#tabs__3290258-01', 'Set up extensions and resubmissions');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/turnitin/how-to/create-an-integrated-turnitin-assignment#tabs__3290168-01', 'Customise Turnitin assignment settings');
    }
    else if(subtitle.includes("eAssessment"))
    {
        //eAssessment gradesync settings
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/Assessment/eassessment/how-to/create-an-eassessment-grade-sync-activity', 'Create an eAssessment Grade Sync activity');
    }
    else if(subtitle.includes("Quiz"))
    {
        //Quiz settings
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=b0e939dd-03d2-4e50-98d6-b0db017c7873', 'Creating Quizzes and Question Banks');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/quiz/how-to/add-and-customise-a-quiz#tabs__3288424-01', 'Add and customise a Quiz');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/quiz/how-to/add-quiz-questions#tabs__3288692-01', 'Add Quiz questions');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/quiz/how-to/allow-extensions-and-reattempts#tabs__3289402-01', 'Enable extensions and allow quiz reattempts');
    }
    else if(subtitle.includes("Forum"))
    {
        //Forum settings
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=71b42313-b9fa-44bf-b4d9-b0c70050dd05', 'Forums section');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/forum/how-to/add-a-forum#tabs__3299059-02', 'Add a Forum');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/forum/how-to/use-a-forum-as-an-assessment#tabs__3299124-02', 'Use a forum as an assessment');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/forum/how-to/set-up-grading#tabs__3299130-02', 'Set up forum grading');
    }
    else if(subtitle.includes("Manage unit preview"))
    {
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/moodle-setup/how-to/moodle-unit-preview#tabs__3436127-01', 'Set up the Moodle Unit Preview');
        //Unit preview settings
    }
    else if(subtitle.includes("Groupings"))
    {
        //Groupings page
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/moodle-setup/how-to/set-groups-and-groupings-in-moodle#tabs__3254627-01', 'Create groups and groupings in Moodle');
    }
    else if(subtitle.includes("Reports"))
    {
        //Reports page
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/moodle-setup/how-to/view-moodle-reports#tabs__3321687-01', 'View Moodle reports');
    }
    else if(subtitle.includes("Question bank"))
    {
        //Question bank page
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/quiz/how-to/add-quiz-questions#tabs__3288692-01', 'Add Quiz questions');
    }
    else if(othertitle.match("[A-Za-z]+ [0-9]+"))
    {
        CreateHref('suggestedVideos', 'https://monash.au.panopto.com/Panopto/Pages/Viewer.aspx?pid=06e95a9b-0f54-467c-ac72-b0bd0032957d&id=0b09d191-912a-4146-b524-b0c900444817', 'Weekly Content sections');
    }
    else if(othertitle.includes("Groups"))
    {
        //Groups page
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/moodle-setup/how-to/set-groups-and-groupings-in-moodle#tabs__3254627-01', 'Create groups and groupings in Moodle');
        CreateHref('suggestedArticles', 'https://www.monash.edu/learning-teaching/TeachHQ/moodle/activities-and-resources/activities/group-self-selection#tabs__3316261-01', 'Group self-selection');
    }
}

function openFeedbackPopup() {
  feedbackPopup.style.display = 'block';
}

function closeFeedbackPopup() {
  feedbackPopup.style.display = 'none';
}

function postFeedback() {
  const selectedScale = document.querySelector('input[name="likert"]:checked').value;
  const currentUrl = window.location.href;
  const text = document.getElementsByName("feedbackText")[0].value;
  const pageTitle = document.title;
  fetch("https://script.google.com/macros/s/AKfycbySqPGQECIZUG3Rbs7SLN3QOLvXXySoRgwHKaXQh-c6XrN3bp9ZJNEhpvlKlTIV1E0/exec", {
      redirect: "follow",
      method: "POST",
      body: JSON.stringify({
          Title: pageTitle,
          Link: currentUrl,
          Score: selectedScale,
          Feedback: text
      }),
      headers: {
          "Content-Type": "text/plain;charset=utf-8",
      },
  });
  closeFeedbackPopup();
  var frm = document.getElementsByName("feedbackForm")[0];
  frm.reset(); 
  var x = document.getElementById("snackbar");

  x.className = "show";

  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  return false;
}
