(function () {
  "use strict";

  // Settings and HTML are created once when this script is loaded.
  const config = {
    allowedEmails: new Set([
      "rajib.uddin@monash.edu",
      "jaime.clark@monash.edu",
      "emma.yench@monash.edu",
      "ross.mcqueen@monash.edu",
      "phillip.abramson@monash.edu",
      "matt.chen@monash.edu",
      "heath.graham@monash.edu",
      "stephanie.luo@monash.edu",
      "bill.mezzetti@monash.edu",
      "chris.starbuck1@monash.edu"
    ]),

    pagePatterns: {
      courseSettings: "learning.monash.edu/course/edit.php?id=",
      courseManagement: [
        "https://learning.monash.edu/backup/",
        "https://learning.monash.edu/course/reset.php?id="
      ],
      enrolment: [
        "https://learning.monash.edu/user/index.php?id=",
        "https://learning.monash.edu/local/userenrols/import.php?id="
      ]
    },

    selectors: {
      profileLinks: ".myprofileitem a",
      settingsTab: 'ul.nav.more-nav.nav-tabs > li[data-key="editsettings"]',
      formControls: "input, select, textarea",
      pageContent: "#page-content",
      specialHeader: "#id_specialheader",
      specialContainer: "#id_specialheadercontainer",
      editModeSwitch: ".editmode-switch-form",
      userNotifications: "#user-notifications"
    },

    profileEmailLinkIndex: 1,
    expandedClass: "show",
    highlightClass: "flashing-border",
    highlightDurationMs: 8000
  };

  // Static templates require no array joins or string concatenation.
  const notices = {
    courseManagement: `
      <div id="monash-ai-statement-block">
        <div class="side-border"></div>
        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
        <div class="alert-content">
          <p>Please contact <a href="mailto:FIT.EDiQ@monash.edu">EDiQ team</a> for assistance with importing, back-up, and cloning of units and/or content.</p>
        </div>
      </div>
    `,

    staffEnrolment: `
      <div class="container-fluid p-l-1">
        <div class="row">
          <div class="col-auto alert alert-danger">
            <i aria-hidden="true" class="fa-solid fa-exclamation-triangle fa-2x"></i>
          </div>
          <div class="col w-100 alert alert-danger p-2 align-middle rounded-right">
            <div><strong>Enrolling Users into Staff Roles</strong></div>
            <div>
              <p>Any user enrolled with a non-staff account (i.e. PhD and student accounts) and given any role aside from <strong>student</strong> or <strong>guest</strong> will be removed automatically <strong>on a daily basis</strong>. If you notice that added accounts disappear from the Moodle site, this is the reason.</p>
              <p>All role assignments must comply with the <a href="https://www.monash.edu/learning-teaching/teachhq/moodle/moodle-setup/how-to/manually-assign-roles/_nocache" target="_blank"><span class="text-primary">rules</span></a> for assigning roles. If you are unsure if the user is a staff member or not please contact the <a href="https://infotech-monash.atlassian.net/servicedesk/customer/portal/71/group/178/create/285" target="_blank"> <span class="text-primary">Academic Workforce team</span></a>.</p>
            </div>
          </div>
        </div>
      </div>
    `,

    specialConsideration: `
      <div class="container-fluid p-l-1">
        <div class="row">
          <div class="col-auto alert alert-danger">
            <i aria-hidden="true" class="fa fa-exclamation-triangle fa-2x"></i>
          </div>
          <div class="col w-100 alert alert-danger p-2 align-middle rounded-right">
            <div><strong>Check Extension & Special Consideration Settings</strong></div>
            <div>The default setting for all assessment is to grant special consideration and extensions unless these settings are adjusted <a href="https://www.monash.edu/learning-teaching/teachhq/Assessment/extensions-and-special-consideration/complex-arrangements" target="_blank">(<span class="text-primary">How-to</span>)</a>. It is the responsibility of the teaching team to ensure that complex arrangements are maintained in these settings for correct special consideration and extension granting.</div>
          </div>
        </div>
      </div>
    `
  };

  let initialised = false;
  let waitingForLoad = false;

  /** Returns a normalised email from the profile menu. */
  function getCurrentEmail() {
    const profileLinks = document.querySelectorAll(config.selectors.profileLinks);
    const emailLink = profileLinks[config.profileEmailLinkIndex];

    return (emailLink?.textContent ?? "").trim().toLowerCase();
  }

  function matchesPage(url, patterns) {
    return patterns.some(pattern => url.includes(pattern));
  }

  /** Applies each restriction independently of whether the settings tab exists. */
  function restrictCourseManagement(url) {
    document.querySelector(config.selectors.settingsTab)?.remove();

    if (url.includes(config.pagePatterns.courseSettings)) {
      document.querySelectorAll(config.selectors.formControls).forEach(control => {
        control.disabled = true;
      });
    }

    if (matchesPage(url, config.pagePatterns.courseManagement)) {
      const content = document.querySelector(config.selectors.pageContent);

      if (content) {
        content.innerHTML = notices.courseManagement;
      }
    }
  }

  /** Inserts the assessment notice and highlights the settings section. */
  function showSpecialConsiderationNotice() {
    const header = document.querySelector(config.selectors.specialHeader);

    if (header) {
      const notice = document.createElement("div");
      notice.innerHTML = notices.specialConsideration;

      // Insert before the third element child, or append if there are fewer.
      header.insertBefore(notice, header.children[2] ?? null);
    }

    const container = document.querySelector(config.selectors.specialContainer);
    if (!container) return;

    container.classList.add(config.expandedClass, config.highlightClass);

    window.setTimeout(() => {
      container.classList.remove(config.highlightClass);
    }, config.highlightDurationMs);
  }

  /** Shows the role warning when staff enrolment controls are available. */
  function showStaffEnrolmentNotice(url) {
    if (!matchesPage(url, config.pagePatterns.enrolment)) return;
    if (!document.querySelector(config.selectors.editModeSwitch)) return;

    const notifications = document.querySelector(config.selectors.userNotifications);
    if (!notifications) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = notices.staffEnrolment;

    // Select the element so template indentation is not treated as the notice.
    notifications.appendChild(wrapper.firstElementChild);
  }

  /** Reports unexpected failures while allowing other page features to run. */
  function runSafely(label, action) {
    try {
      action();
    } catch (error) {
      console.error(`[ActivateRestrictions] ${label}`, error);
    }
  }

  function initialise() {
    if (initialised) return;

    initialised = true;
    waitingForLoad = false;

    const url = window.location.href;

    runSafely("Course restrictions", () => {
      if (!config.allowedEmails.has(getCurrentEmail())) {
        restrictCourseManagement(url);
      }
    });

    // Both notices also apply to people on the allowlist.
    runSafely("Special consideration notice", showSpecialConsiderationNotice);

    runSafely("Staff enrolment notice", () => {
      showStaffEnrolmentNotice(url);
    });
  }

  /** Initialises once per page, whether called before or after page load. */
  function ActivateRestrictions() {
    if (initialised || waitingForLoad) return;

    if (document.readyState === "complete") {
      initialise();
    } else {
      waitingForLoad = true;
      window.addEventListener("load", initialise, { once: true });
    }
  }

  // Expose only the public entry point; helpers and settings remain private.
  window.ActivateRestrictions = ActivateRestrictions;
})();
