var usr = window.top.g_ck;
if(usr != sessionStorage.getItem('who')){
  sessionStorage.setItem('who',usr);
  sessionStorage.setItem('code','');
  sessionStorage.setItem('validToken','');
}
document.getElementById('dial-call-btn').style.pointerEvents = 'none';
var isValidToken = sessionStorage.getItem('validToken') || "true";
var dialPhone = $j("#dial_phone").val() || '';
var showLogin = $j("#show_login").val() || '0';
var MAX_ALLOWED_TAB = 4;
var LOGOUT_URL = 'https://login.intermedia.net/user/Account/logout';
var UNITE_USER_HOLD = 'unite-user-elevate-hold.svg';
var UNITE_USER_UNHOLD ='unite-user-elevate.svg';
var UNKNOWN_CONTACT = 'external-contact-elevate-56.svg';
var KNOWN_CONTACT = 'contact-big-elevate.svg';
var initCall = x_401039_elevate.CallUtil;
var showSignIn = sessionStorage.getItem('code');
var lift = false;
var toggleContact = true;
var contactElement = 0;
var endCall = false;
var locked = false;


if(!window.top.InterMedia && !showSignIn){
  loadLoginPage();
}
else{
  if(isValidToken == "false")
    showErrorScreen("4");
  else{
    var deviceSelected = sessionStorage.getItem('deviceSelected');
    if (deviceSelected == "1") {
      showSection('showDialpad');
    }
    initCall.callback = updateDeviceList;
    //initCall.commandHandler = interMediaListner;
    //initCall.startSubscription();
    startSubscription();
    initCall.tAnimation = setInterval(handsetAnimation, 500);
  }
}


var dialed = {};
var activeCall = {};
var activeTab = '';
var connectedCall = {};
var finishedCalls = {};
var timeoutId;
var addedPlus = false;
var t;
var errorLogPrefix = "[InterMedia Error]";
var callError = false;
var toggleHeight = "556px";
var errorNumbers = {};
setInterval(contactAnimation,250);
window.onmessage = function (e) {
  sessionStorage.setItem('validToken',false);
  switch(e.data.event.toLowerCase()){
    case "authevent": sessionStorage.setItem('code',e.data.code);
      sessionStorage.setItem('authState',e.data.sessionState);
      hideLoginControls();
      var tokenDetails = x_401039_elevate.IntermediaTokenScript;
      tokenDetails.callback = storeToken;
      tokenDetails.getToken();
      break;
  }
};

function startSubscription(){
  try{
    initCall.commandHandler = interMediaListner;
    initCall.startSubscription();
  }
  catch(ex){
    jslog(errorLogPrefix + " startSubscription: " + ex.message);
  }
}

function contactAnimation(){
  var elements = ['.outgoingC3','.outgoingC2'];
  if(toggleContact){

    //$j.each(elements,function(idx, element){
    //setTimeout(function(){
    $j(elements[contactElement]).css('display','none');
    //},500);
    //});
    ++contactElement;
    if(contactElement == elements.length ){
      toggleContact = false;
      contactElement = 0;
    }
  }
  else{
    //$j.each(elements,function(idx, element){
    //setTimeout(function(){
    $j(elements[contactElement]).css('display','inline-block');
    //},500);
    //});
    ++contactElement;
    if(contactElement == elements.length ){
      contactElement = 0;
      toggleContact = true;
    }
  }
}

function hideLoginControls(){
  $j(".signIN").css('visibility','hidden');
  $j(".Welcome-to-Intermedi").hide();
  $j(".A-powerful-communica").hide();
  $j(".Directing-you-to-you").show();
}

function showLoginControls(){
  $j(".signIN").css('visibility','visible');
  $j(".Welcome-to-Intermedi").show();
  $j(".A-powerful-communica").show();
  $j(".Directing-you-to-you").hide();
}

function enableSettingSave(){
  try{
    $j("#btnSettingSave").removeAttr("disabled");
    $j("#btnSettingSave").removeClass("disabledSetting");
    $j("#btnSettingSave").addClass("btnSave");
    $j(".Button-label").removeClass("disabledText");
  }
  catch(ex){
    jslog(errorLogPrefix + " enableSettingSave: " + ex.message);
  }
}

function getActiveCallDetails(){
  return getCallObject(activeTab);
}
function getPhoneDialFormat(phone){
  try{
    phone = phone.replace(/[^(\d|\+|\*|\#)]/g,'');
    phone = phone.replace(/[(\(|\)]/g,'');
    return phone;
  } catch (ex) {
    jslog(errorLogPrefix + " getPhoneDialFormat: " + ex.message);
    return phone;
  }
}

function storeToken(tokenDetails){
  try{
    if(tokenDetails)
      isValidToken = true;
    else
      isValidToken = false;
    if(isValidToken){
      var top = getTopWindow().window.document.querySelector('head');
      if (!window.top.InterMedia)
        $j('<link href="5fc461a9dbcc08102dca924bdb9619fc.cssdbx" rel="stylesheet" type="text/css"></link>').appendTo(top);
      var v = $j('#login_url').attr('value');
      window.top.InterMedia = tokenDetails || 'failed';
      showLogin = "0";
      ScriptLoader.getScripts('x_401039_elevate.CallUtil.jsdbx?v='+v,showDialpad);
    }
    else{
      showErrorScreen("4");
    }
  } catch (ex) {
    jslog(errorLogPrefix + " storeToken: " + ex.message);
  }
}

function showDialpad(){
  try{
    sessionStorage.setItem('validToken',isValidToken);
    var interMediaFrame = window.top.$j("#phonePopUp");
    if(showLogin != "1"){
      //interMediaFrame.attr('src',interMediaFrame.attr('src'));
      initCall.callback = updateDeviceList;
      initCall.commandHandler = interMediaListner;
      initCall.startSubscription();
      initCall.tAnimation = setInterval(handsetAnimation, 500);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " showDialpad: " + ex.message);
  }
}

function loadLoginPage(overrideLoginParam){
  try{
    //authUrl = sessionStorage.getItem('authUrl');
    if(!overrideLoginParam){
      if(sessionStorage.getItem('code'))
        overrideLoginParam= true;
    }
    //window.top.InterMedia = sessionStorage.getItem('iMedia');
    if (!window.top.InterMedia && (showLogin != "1" || overrideLoginParam)) {
      ScriptLoader.getScripts('x_401039_elevate.IntermediaTokenScript.jsdbx?v=2',showLoginPopup);
    }
    else{
      showDialpad();
    }
  } catch (ex) {
    jslog(errorLogPrefix + " loadLoginPage: " + ex.message);
  }
}

function showLoginPopup(){
  try{
    initCall.getInterMediaLoginLink(loadLoginLink);
  } catch (ex) {
    jslog(errorLogPrefix + " showLoginPopup: " + ex.message);
  }
}

function loadLoginLink(authUrl){
  try{
    window.open(
      authUrl, "InterMedia");//"height=350,width=400,modal=yes,alwaysRaised=yes,top=150,left=500");
  } catch (ex) {
    jslog(errorLogPrefix + " loadLoginLink: " + ex.message);
  }
}

$j('#dialPad').on('keydown', function (event) {
  var code = parseInt(event.which);
  if(code ==8){
    $j("#dialPad").change();
  }
});

//Dialpad key input & copy paste allowed
$j('#dialPad').on('paste', function (event) {
  //@"^[0-9*#+]+$"
  if (event.originalEvent.clipboardData.getData('Text').match(/[^(\d|\+|\*|\#)]/)) {
    //   if (event.originalEvent.clipboardData.getData('Text').match(/[0-9*#+]/)) {
    event.preventDefault();
  }
  $j("#dialPad").change();
});

$j("#dialPad").on("keypress",function(event){
  var code = parseInt(event.which);
  if((code >= 48 && code <=57) || code == 35 || code == 42 || code == 43 ){
    $j("#dialPad").change();
    return true;
  }
  $j("#dialPad").change();
  return false;
});

$j("#dialPad").change(function(){
  setTimeout(validateCallButton,1000);
});



var logLevel = 'Yes';
logLevel = logLevel.toLowerCase();
if (logLevel === "yes") {
  $j('#saveLogBtn').text("CLOSE");
  //$j('#afterClose').css("left", "115px");
  $j("#commentData").attr("onblur", "saveLog(true)");
}

// Function to check if user has admin rights. If yes enable create new user link, disable otherwise
function checkRole(objCall) {
  try {
    if(objCall){
      updateTabDetails(objCall);
      if (objCall.isUserAdmin != "true") {
        //$j("#showIncident").css('visibility', 'hidden');
        $j("#newUser").addClass("disabled");
        $j("#newUser").removeAttr("href");
      } else {
        var phone = objCall.phoneNumber == objCall.callID ? "" : objCall.phoneNumber;
        phone = objCall.getPhoneFormat(phone);
        var userURL = "/sys_user.do?sysparm_nostack=true&sys_id=-1&sysparm_query=phone=" + phone;
        $j("#newUser").attr("href", "javascript:showPage('" + userURL + "');//");
        $j("#newUser").removeClass("disabled");
      }
    }
  } catch (ex) {
    jslog(errorLogPrefix + " checkRole: " + ex.message);
  }
}

//Function to log user out of intermedia
function logOut(doNotRemovePopup) {
  try {
    x_401039_elevate.CallUtil.endInterMediaSession();
    showLoginControls();
    window.top.InterMedia = "";
    sessionStorage.setItem('iMedia', "");
    sessionStorage.setItem('validToken','');
    sessionStorage.setItem('code','');
    window.top.calls = {};
    setTimeout(function() {
      var logOutFrm = window.top.$j("#logOutFrm");
      if(logOutFrm.length < 1)
        logOutFrm = window.top.$j("<iframe>");
      logOutFrm.attr('id', 'logOutFrm');
      logOutFrm.attr('src', LOGOUT_URL);
      logOutFrm.hide();
      window.top.$j('body').append(logOutFrm);
      if(!doNotRemovePopup){
        //window.top.$j('#popUpContent').hide();
        //window.$j('#popUpContent').hide();
        //window.top.$j("#logOutFrm").remove();
        showSection('welcome');
      }
      x_401039_elevate.CallUtil.endSubscription();
      sessionStorage.setItem('deviceSelected', '');
      sessionStorage.setItem('validToken','');
    }, 0);
  } catch (ex) {
    jslog(errorLogPrefix + " logOut: " + ex.message);
  }

}

//Cleanup activity to clear global level variables.
function doCleanUp() {
  try {
    for (var key in finishedCalls) {
      delete window.top.calls[key];
    }
  } catch (ex) {
    jslog(errorLogPrefix + " doCleanUp: " + ex.message);
  }
}

//Listener of SignalR actions. Based on eventtype it constructs User view runtime.
function interMediaListner(msg, switchView) {
  try {
    callError = false;
    if (msg && msg.eventType) {
      doCleanUp();
      switchView = switchView || false;
      var direction = msg.callDirection;
      var event = msg.eventType.toLowerCase();
      var callType = msg.callType;
      var phoneNumber = msg.caller ? msg.caller.phoneNumber : '';
      var displayName = msg.caller ? msg.caller.displayName : '';
      var callID = msg.callId;
      if (!window.top.calls) {
        window.top.calls = {};
      }
      if (phoneNumber == 'anonymous')
        phoneNumber = msg.callId;
      var objCall = window.top.calls[phoneNumber];
      if (!objCall)
        objCall = window.top.calls[callID];
      var objProgress = $j('#progressText');
      var objProgressInternal = $j("#progressTextInternal");
      $j('.watch').show();
      var calls = Object.keys(window.top.calls).length;
      var updateComment = !switchView;
      switchView = activeTab == callID || (calls == 1 && objCall && objCall.callID == callID) || calls == 0;
      $j('.watch').removeClass("hold");
      $j('#progressText').removeClass("hold-text");
      if(objCall){
        checkRole(objCall);
        objCall.callDirection = objCall.callDirection || direction;
        if(calls == 1 && !switchView){
          updateCommentsInObject(objCall.callID);
        }
        // 				showHideIncident(objCall);
        // 				autosearchInc(objCall.callerID);
      }
      switch (event) {
        case 'dialed':
          if (!objCall)
            objCall = window.top.calls[callID];
          if (objCall)
            showOutGoingScreen(objCall.callID, '', '', true, objCall);
          break;
        case 'connecting':
        case 'calling':
          loadIncomingCall(msg, switchView);
          if (!objCall)
            objCall = window.top.calls[callID];
          objCall.callDirection  = objCall.callDirection || direction;
          objCall.status = 'connecting';
          objCall.roleCheckcallback = checkRole;
          objCall.checkUserRole();
          if (switchView) {
            removeOnHold();
            activeTab = callID;
            if (objCall.callDirection != 'incoming') {
              objCall.getUserListByNumber(phoneNumber, populateUserInfo);
              connectedCall[callID] = 1;
              showActiveCall(callID, callType, direction, calls, switchView);
              objProgress.html('Calling...');
              objProgressInternal.html('Calling...');
            } else {
              showIncomingScreen(phoneNumber, callType, 'incoming', callID, calls, switchView);
            }
          }
          window.top.$j("#popUpContent").show(0);
          break;
        case 'connected':
        case 'callestablished':
          loadIncomingCall(msg, switchView);
          if (!objCall){
            objCall = window.top.calls[callID];
            objCall.callDirection  = objCall.callDirection || direction;
            objCall.roleCheckcallback = checkRole;
            objCall.checkUserRole();
          }
          if(updateComment || ((!activeTab || activeTab == objCall.callID) && !switchView)){
            updateCommentsInObject(objCall.callID);
          }
          $j('#commentData').val(objCall.comments || '');
          activeTab = callID;
          clearAnimation(objCall);
          removeOnHold();
          objCall.status = "connected";
          showActiveCall(callID, callType, direction);
          objProgress.html('');
          objProgressInternal.html('');
          startTimer(callID);
          if(!objCall.callTime)
            objCall.showUserProfilePopup(showProfilePopup);
          break;
        case 'disconnected':
        case 'callfinished':
          if (objCall) {
            objCall.status = 'disconnected';
            if (objCall.t)
              stopwatch(callID);
            callType = objCall.callType;
          }
          if(activeTab == callID){
            clearAnimation(objCall);
            removeOnHold();
            if (switchView) {
              activeTab = "";
              if (callType != "internal" ) {
                showActiveCall(callID, callType, direction);
                activeTab = callID;
              }
            }
          }
          disconnectCall(phoneNumber, true, callType, direction, callID);
          break;
        case 'on hold':
        case 'callheld':
          if (objCall) {
            objCall.status = "on hold";
            if (switchView) {
              $j('#activeCall').addClass('onHold');
              $j('.Multiline-upd-Unite-user').addClass('onHold');
              $j('#uniteUser').attr('src', UNITE_USER_HOLD);
              //$j('#unhold').attr('src', UNITE_CALL_UNHOLD);
              objProgress.html('On hold');
              objProgressInternal.html('On hold');
              $j('.watch').addClass("hold");
              $j('#progressText').addClass("hold-text");
              //activeTab = callID;
              showActiveCall(callID, callType, direction);
            }
          }
          break;
        case 'callunheld':
          removeOnHold();
          if (objCall) {
            if (objCall.callType == "internal") {
              $j('.Multiline-upd-Unite-user').removeClass('onHold');
              $j('#uniteUser').attr('src', UNITE_USER_UNHOLD);
            }
            objCall.status = "connected";
            activeCall = objCall;
            showActiveCall(callID, callType, direction);
            objProgress.html('');
            objProgressInternal.html('');
          }
          break;
        case 'peerchanged':
          $j('#activeCall').removeClass('onHold');
          break;

      }

    } else {
      if (msg.resultModel && msg.resultModel.code == 2) {
        if(!endCall){
          callError = true;
          errorNumbers[dialed.phoneNumber] = 1;
          disconnectCall(dialed.phoneNumber, true, dialed.callType, dialed.direction, dialed.callID);
        }
        refreshView(activeTab);
        //finishedCalls[(dialed.phoneNumber] = dialed.phoneNumber;
        showHideContact();
        //throw new Error("Call could not be completed. Error respone received from server.");
      }
    }
    showTabs();
  } catch (ex) {
    jslog(errorLogPrefix + " interMediaListner: " + ex.message);
  } finally {
    //jslog(' >>>>>>>> inside Intermedia lisner =' + JSON.stringify(msg));
  }
}

// Update user view when call is unheld.
function removeOnHold() {
  try {
    $j('#activeCall').removeClass('onHold');
    $j('.Multiline-upd-Unite-user').removeClass('onHold');
    $j('#uniteUser').attr('src', UNITE_USER_UNHOLD);
    var objProgress = $j('#progressText');
    objProgress.html("");
    var objProgressInternal= $j('#progressTextInternal');
    objProgressInternal.html('');
  } catch (ex) {
    jslog(errorLogPrefix + " removeOnHold: " + ex.message);
  }
}

// Update call library object with user entered input. This will help in restoring comments
// on tabs during tab switching.
function updateCommentsInObject(callID) {
  try {
    /*if (!callID) {
      callID = $j("#btnDisconnect").attr('data-id');
    }*/
    var objCall = getCallObject(callID);
    if (objCall) {
      var cmntText = $j('#commentData');
      objCall.comments = cmntText.val();
    }
  } catch (ex) {
    jslog(errorLogPrefix + " updateCommentsInObject: " + ex.message);
  }
}

function showHideIncident(callDetails){
  try{
    if(!callDetails.callerID || callDetails.callerID == callDetails.phoneNumber){
      //$j("#showIncident").hide(); //css('visibility', 'hidden');
      $j("#incidentListUser").hide();
    }
    else{
      $j("#showIncident").hide(); //.css('visibility', 'visible');
      $j("#incidentListUser").show();
    }
  }
  catch(ex){
    jslog(errorLogPrefix + " updateCommentsInObject: " + ex.message);
  }
}
// Refresh user view on tab switch. Based on which tab is clicked, view is refreshed as per the call
//object associated with that tab.
function refreshView(callID) {
  try {
    updateCommentsInObject(activeTab);
    clearContent();
    //hideReferenceFields();
    if(activeTab != callID){
      updateCommentsInObject(activeTab);
    }
    activeTab = callID;
    var objCall = getCallObject(callID);
    if (objCall) {
      var msg = {};
      msg.eventType = objCall.status;
      msg.callDirection = objCall.callDirection;
      msg.callType = objCall.callType;
      msg.caller = {};
      msg.caller.phoneNumber = objCall.phoneNumber;
      msg.caller.displayName = objCall.callerName;
      msg.callId = objCall.callID;
      interMediaListner(msg, true);
      $j('#commentData').val(objCall.comments || '');
    }
  } catch (ex) {
    jslog(errorLogPrefix + " refreshView: " + ex.message);
  }

}

function adjustMultiTabView(addClass){
  try{
    /*
    var classFields = {
      "contactDetails" : "multi-contact",
      "active-end-btn" : "multi-end",
      "watch" : "multi-watch",
      "Rectangle-Copy" : "multi-rectangle",
      "outgoing-logo-container" : "multi-incoming-contact",
      "internal-container" : "multi-internal-container",
    };
    var idFields = {
      "afterClose" : "multi-after-close",
      "incoming_logo" : "multi-incoming-logo",
      "showUnknown" : "multi-incoming-contact",
      "showKnown" : "multi-incoming-contact",
      "outgoingS2Comp" : "multi-incoming-contact",

    };*/
    var multiFields = {
      ".contactDetails" : "multi-contact",
      ".outgoing-logo-container" : "multi-incoming-contact",
      ".internal-container" : "multi-internal-container",
      ".active-end-btn" : "multi-end",
      ".watch" : "multi-watch",
      ".Rectangle-Copy" : "multi-rectangle",
      ".internalName" : "multi-internal-contact",
      ".internalTitle" : "multi-internal-contact",
      "#afterClose" : "multi-after-close",
      "#incoming_logo" : "multi-incoming-logo",
      "#showUnknown" : "multi-incoming-contact",
      "#showKnown" : "multi-incoming-contact",
      /*"#outgoingS2Comp" : "multi-incoming-contact",*/
      "#progressText" : "multi-watch",

    };
    if(addClass){
      /*
      $j.each(Object.keys(classFields), function(idx,target){
        $j("."+target).addClass(classFields[target]);
      });
      $j.each(Object.keys(idFields), function(idx,target){
        $j("#"+target).addClass(idFields[target]);
      });*/
      $j(".hold").removeClass("hold");
      $j(".hold-text").removeClass("hold-text");
      $j.each(Object.keys(multiFields), function(idx,target){
        $j(target).addClass(multiFields[target]);
      });
    }
    else{
      /*
      $j.each(Object.keys(classFields), function(idx,target){
        $j("."+classFields[target]).removeClass(classFields[target]);
      });
      $j.each(Object.keys(idFields), function(idx,target){
        $j("#"+target).removeClass(idFields[target]);
      });*/
      $j.each(Object.keys(multiFields), function(idx,target){
        $j(target).removeClass(multiFields[target]);
      });
    }
  }
  catch(ex){
    jslog(errorLogPrefix + " adjustMultiTabView: " + ex.message);
  }

}

// Repaint user view to add/remove tabs
function showTabs(callID) {
  try {
    updateCommentsInObject(activeTab);
    doCleanUp();
    activeTab = callID || activeTab;

    var calls = 0;
    for (var id in window.top.calls) {
      if (window.top.calls[id].callID) {
        if (errorNumbers[window.top.calls[id].phoneNumber] == 1) {
          delete window.top.calls[id];
        } else
          ++calls;
      }
    }
    if (calls <= MAX_ALLOWED_TAB) {
      var tabs = $j("#multiTab");
      $j("#placeNewCall").show();
      $j("#placeNewCallInternal").show();
      for (var key in finishedCalls) {
        $j("#tab_" + key).remove();
        delete finishedCalls[key];
      }
      var popup = window.top.$j("#phonePopUp");
      if (calls > 1) {
        $j('.contactDetails').addClass('shiftContactLeft');
        $j('.contactLogo').hide();
        var cnt = 0;
        var width = 100 / calls;
        for (var id in window.top.calls) {
          var objCall = window.top.calls[id];
          if (objCall.callID) {
            var childTab = $j("#tab_" + id);
            if (childTab.length > 0) {
              childTab.attr('style', 'width:' + width + '%;');
              if (activeTab == id) {
                childTab.removeClass('inactiveTab');
                childTab.addClass('activeTab');
              } else {
                childTab.removeClass('activeTab');
                childTab.addClass('inactiveTab');
              }
              setTabsForCall(objCall, childTab);
            } else if ($j("#tab_" + id).length == 0) {
              cnt += width;
              childTab = $j('<div>');
              childTab.attr('id', 'tab_' + id);
              childTab.addClass('call-tab');
              childTab.attr('style', 'width:' + width + '%;');
              childTab.attr('onClick', 'refreshView("' + id + '")');
              if (activeTab == id) {
                childTab.addClass('activeTab');
              } else {
                childTab.addClass('inactiveTab');
              }
              var imgSrc = UNKNOWN_CONTACT;
              if (objCall.callType.toLowerCase() == "internal" || objCall.callerID)
                imgSrc = KNOWN_CONTACT;
              var container = $j('<div class="container multi-tab-2">');
              $j('<div class="tabC2"> </div>').appendTo(container);
              $j('<div class="tabC3"></div>').appendTo(container);
              $j('<div class="tabC4"></div>').appendTo(container);
              $j('<img id="img_'+id+'" src="' + imgSrc + '" class="tabContact"/>').appendTo(container);
              //if(calls < 3){
              $j('<span class="tabSpan" id="tabTitle_' + id + '"></span>').appendTo(container);
              //}
              container.appendTo(childTab);

              //childTab.html(childTab.html() + " " + objCall.callerName);
              childTab.appendTo(tabs);
              //toggleHeight = '616px';
              //popup.css("height", toggleHeight);
              //popup.attr('height','580px');
              updateTabDetails(objCall);
              tabs.show();
              setTabsForCall(objCall, childTab);
            }
          }
        }
        if (calls > 2) {
          $j(".tabSpan").hide();
          $j(".container").removeClass("multi-tab-2");
        } else{
          $j(".tabSpan").show();
          $j(".container").addClass("multi-tab-2");
        }
      } else {
        $j('.contactDetails').removeClass('shiftContactLeft');
        $j('.contactLogo').show();
        tabs.hide();
        toggleHeight = '556px';
        //popup.attr('height','520px');
        popup.css("height", toggleHeight);
      }
      if(calls >=4){
        $j("#placeNewCall").hide();
        $j("#placeNewCallInternal").hide();
      }
      if(calls > 1){
        adjustMultiTabView(true);
      }
      else{
        adjustMultiTabView(false);
      }
    }
  } catch (ex) {
    jslog(errorLogPrefix + " showTabs: " + ex.message);
  }
}

// Change tab background based on associated call object status
function setTabsForCall(objCall, childTab) {
  try {
    switch (objCall.status) {
      case 'dialed':
        setTabClass(childTab, 'incomingTab');
        break;
      case 'calling':
      case "connecting":
        if (objCall.callDirection != "outgoing") {
          if(activeTab != objCall.callID)
            setTabClass(childTab, 'incoming-inactive-tab');
          else{
            setTabClass(childTab, 'incomingTab');
          }
        } else {
          if(activeTab == objCall.callID){
            setTabClass(childTab, 'connected');
          }
          else{
            setTabClass(childTab,'active-inactive');
          }
        }
        break;
      case "on hold":
        if(activeTab == objCall.callID){
          setTabClass(childTab, 'activeTabHold');
        }
        else{
          setTabClass(childTab, 'inactiveTabHold');
        }
        break;
      case "disconnected":
      case "completed":
      case "connected":
        //if(activeTab == objCall.callID){
        //setOtherTabInActive();
        if(activeTab == objCall.callID){
          setTabClass(childTab, 'connected');
        }
        else{
          setTabClass(childTab,'active-inactive');
        }
        //}
        break;
    }
    /*var imgSrc = UNKNOWN_CONTACT;
    if (objCall.callType.toLowerCase() == "internal" || objCall.callerID)
      imgSrc = KNOWN_CONTACT;
    $j("#img_"+objCall.callID).attr('src',imgSrc);*/
  } catch (ex) {
    jslog(errorLogPrefix + " setTabsForCall: " + ex.message);
  }
}

function setOtherTabInActive(){
  try{
    $j.each($j(".connected"),function(idx,element){
      setTabClass($j(element),'inactiveTab');
    });
  }
  catch (ex) {
    jslog(errorLogPrefix + " setOtherTabInActive: " + ex.message);
  }
}
// Based on input css style, apply it to thetab object passed as input
function setTabClass(tab, tabStyle) {
  try {
    var styles = ['incomingTab', 'connected', 'onHold', 'inactiveTabHold','activeTabHold','inactiveTab','incoming-inactive-tab','active-inactive'];
    styles.forEach(function(style, idx) {
      tab.removeClass(style);
    });
    tab.addClass(tabStyle);
  } catch (ex) {
    jslog(errorLogPrefix + " setTabClass: " + ex.message);
  }
}

//When there is any kind of error from API during plugin load, update user view with appropriate error screen
function showErrorScreen(responseCode) {
  try {
    logOut(true);
    var src = "";
    switch (responseCode) {
      case "5":
        src = "x_401039_elevate_errorOffline.do";
        break;
      case "4":
        src = "x_401039_elevate_errorUnauthorise.do";
        break;
      default:
        src = "x_401039_elevate_errorGeneric.do";
        break;
    }
    src += "?sysparm_nostack=true";
    $j('#errorFrame').attr('src', src);
    showSection("error");
  } catch (ex) {
    jslog(errorLogPrefix + " checkValidResponse: " + ex.message);
  }
}

function dialNumber(phone){
  try{
    var calls = Object.keys(window.top.calls).length || 0;
    if(calls < MAX_ALLOWED_TAB){
      phone = phone || dialPhone;
      phone = getPhoneDialFormat(phone);
      $j('#dialPad').val(phone);
      $j("#dialPad").change();
      intiateCall();
      dialPhone='';
    }
    else{
      g_form.addErrorMessage("Intermedia maximum allowed call limit reached already.");
    }
  }
  catch(ex){

  }
}

// Pull all available device list from Intermedia server and update in plugin
function updateDeviceList(devices) {
  try {
    if(!window.top.calls){
      window.top.calls = {};
    }
    isValidToken = sessionStorage.getItem('validToken') || false;
    if(isValidToken == "true"){
      $j(".signIN").css('visibility','hidden');
    }
    else{
      $j(".signIN").css('visibility','visible');
    }
    var responseCode = devices.responseCode.toString().substr(0, 1);
    var deviceList = devices.deviceList;
    var deviceSelected = sessionStorage.getItem('deviceSelected');
    if (responseCode != "2") {
      sessionStorage.setItem('iMedia', "");
      return showErrorScreen(responseCode);
    }
    window.top.interMediaDevices = deviceList;
    if (deviceSelected == "1") {
      if(dialPhone){
        dialNumber();
      }
      else{
        showSection('showDialpad');
      }
    } else if (deviceList.length > 0) {
      showSection('select_the_device');
    } else {
      showSection('select_device_no_device');
    }
    if (deviceList.length == 1) {
      setPreference('InterMedia.SelectedDevice', deviceList[0].id);
      sessionStorage.setItem('deviceSelected', '1');
    }
    $j("#select_device").empty();
    $j("#select_user_device").empty();
    deviceList.forEach(function(value, idx) {
      var desc = value.name + "(" + value.id + ")";
      var o = new Option(desc, value.id);
      /// jquerify the DOM object 'o' so we can use the html method

      $j(o).html(desc);
      $j(o).addClass('showCursor');
      $j("#select_device").append(o);
      var o1 = new Option(desc, value.id);
      $j(o1).html(desc);
      $j(o1).addClass('showCursor');
      $j("#select_user_device").append(o1);
    });
    var selectedDevice = getPreference('InterMedia.SelectedDevice');
    if (selectedDevice) {
      $j("#select_device").val(selectedDevice);
      $j("#select_user_device").val(selectedDevice);
    } else {
      setPreference('InterMedia.SelectedDevice', deviceList[0].id);
      sessionStorage.setItem('deviceSelected', '1');
    }
  } catch (ex) {
    jslog(errorLogPrefix + " updateDeviceList: " + ex.message);
  }
}

//Device selection method. Once user clicks on save on device selection screen, this is used to store selection.
function selectUserDevice(isShowDialPad) {
  try {
    var deviceID = "";

    if (isShowDialPad) {
      deviceID = $j("#select_user_device").val();
      setPreference('InterMedia.SelectedDevice', deviceID);
      if(dialPhone){
        dialNumber();
      }
      else{
        showSection("showDialpad");
      }
    } else {
      deviceID = $j("#select_device").val();
      setPreference('InterMedia.SelectedDevice', deviceID);
      $j("#btnSettingSave").attr("disabled","disabled");
      $j("#btnSettingSave").addClass("disabledSetting");
      $j(".Button-label").addClass("disabledText");
      $j("#btnSettingSave").removeClass("btnSave");
      //$j("#saveMsg").text("Device Saved successfully");
    }
    sessionStorage.setItem('deviceSelected', '1');
  } catch (ex) {
    $j("#saveMsg").text("Error in saving device");
    jslog(errorLogPrefix + " selectUserDevice: " + ex.message);
  }
}

// Plugin popup close event handler
function removePopup() {
  try {
    window.top.$j('#popUpContent').hide();
    window.$j('#popUpContent').hide();
    togglePopup();
  } catch (ex) {
    jslog(errorLogPrefix + " removePopup: " + ex.message);
  }
}

// Plugin popup toggle action
function togglePopup() {
  try {
    var dv = window.top.$j("#popUpContent");
    var slideHeight = dv.attr("data-toggle") === "1" ? "30px" : toggleHeight;
    dv.attr("data-toggle", dv.attr("data-toggle") === "1" ? "0" : "1");
    if (dv.attr("data-toggle") === "1") {
      $j("#placeNewCallInternal").show();
    } else {
      $j("#placeNewCallInternal").hide();
    }
    window.top.$j("#phonePopUp").css("height", slideHeight);
  } catch (ex) {
    jslog(errorLogPrefix + " togglePopup: " + ex.message);
  }
}

// Show/Display current active call strip on dialpad while initiating multiple calls with place new call link
function showHideContact() {
  try {
    doCleanUp();
    var showContact = $j("#showContact");
    var calls = Object.keys(window.top.calls).length;
    if (calls > 0) { //&& showContact.style.display === "none") {
      showContact.show();
    } else {
      showContact.hide();
    }
  } catch (ex) {
    jslog(errorLogPrefix + " showHideContact: " + ex.message);
  }
}

// Dialpad setting view
function showSettingsFromDialpad() {
  try {
    var dialpad = document.getElementById("showDialpad");
    var setting = document.getElementById("showSettingsFromDialpadID");
    setting.style.display = "block";
    dialpad.style.display = "none";
  } catch (ex) {
    jslog(errorLogPrefix + " showSettingsFromDialpad: " + ex.message);
  }

}

//Switch back to dialpad view from setting
function showDialpadFromSettings() {
  try {
    var dialpad = document.getElementById("showDialpad");
    var setting = document.getElementById("showSettingsFromDialpadID");
    setting.style.display = "none";
    dialpad.style.display = "block";
  } catch (ex) {
    jslog(errorLogPrefix + " showDialpadFromSettings: " + ex.message);
  }
}

//Disable call button untill atleast 3 digits
function disableCallButton() {
  try {
    $j(".call-btn").addClass('disable');
  } catch (ex) {
    jslog(errorLogPrefix + " disableCallButton: " + ex.message);
  }
}

// Clear UI content to ensure no previous values persist on view
function clearContent() {
  try {
    endCall = false;
    //		var element = document.getElementById("dialPad");
    //		var number = element.innerHTML;
    var number = $j( "#dialPad" ).val();
    if (window.top.calls)
      delete window.top.calls[number];
    //		element.classList.add("place-new-call");

    //$j( "#dialPad" ).addClass("place-new-call");
    $j("#dialed-name").text('');
    $j("#dialPad").change();
    disableCallButton();
    //	document.getElementById("dialPad").innerHTML = 'Place new call';
    $j( "#dialPad" ).val('');
    document.getElementById('dial-call-btn').style.pointerEvents = 'none';
    $j('#incoming_name').html('');
    $j('#incoming_desig').html('');
    $j('#incoming_comp').html('');
    $j('.watch').text('');
    $j('#timerValue').text('');
    $j('#internalTimer').text("");
    //$j("#incidentName").text("");
    //$j("#incomingcallerName").text("");
    //$j("#commentData").val('');
    initCall.comments = '';
  } catch (ex) {
    jslog(errorLogPrefix + " clearContent: " + ex.message);
  }
}

// Ability to add + sign on dialpad scree when user press & hold it for 1 sec.
function checkLongHold() {
  try {
    timeoutId = setTimeout(addPlus, 1000);
  } catch (ex) {
    jslog(errorLogPrefix + " checkLongHold: " + ex.message);
  }
}

// Add + sign on dialpad
function addPlus() {
  try {
    process(-1);
    addedPlus = true;
  } catch (ex) {
    jslog(errorLogPrefix + " addPlus: " + ex.message);
  }
}

// Clear longhold timer set during press and hold
function clearLongHold() {
  try {
    clearTimeout(timeoutId);
  } catch (ex) {
    jslog(errorLogPrefix + " clearLongHold: " + ex.message);
  }
}

// Dialpad number click handler
function process(i) {
  try {
    if (addedPlus) {
      addedPlus = false;
      return;
    }
    if ($j( "#dialPad" ).val() == 'Place new call') {
      //$j( "#dialPad" ).addClass("place-new-call");
      $j( "#dialPad" ).val('');
    }
    var resultList = i == -1 ? '+' : i.toString();
    var input = $j( "#dialPad" );
    input.val( input.val() + resultList );
    validateCallButton();
  } catch (ex) {
    jslog(errorLogPrefix + " process: " + ex.message);
  }

}

function validateCallButton(){
  try{
    var checkNumber = $j( "#dialPad" ).val();
    if (checkNumber.toString().length >= 1) {
      document.getElementById('dial-call-btn').style.pointerEvents = 'auto';
    }
    var phoneNumLength = 3;
    if (checkNumber.length < phoneNumLength) {
      disableCallButton();
    } else if (checkNumber.length >= phoneNumLength) {
      $j(".call-btn").removeClass('disable');
    }
  }
  catch(ex){
    jslog(errorLogPrefix + " validateCallButton: " + ex.message);
  }
}
//show user profile in main window
function showUser(id) {
  try {
    window.top.$j("#gsft_main").attr('src', 'sys_user.do?sysparm_nostack=true&sys_id=' + id);
    return false;
  } catch (ex) {
    jslog(errorLogPrefix + " showUser: " + ex.message);
  }
}

// If caller details are available in service now, create its name a profile link on user view
function getUserLink(obj, callerID, callerName) {
  try {
    obj.html("");
    var linkUrl = "/sys_user.do?sysparm_nostack=true&sys_id=" + callerID;
    var link = $j("<a>");
    link.attr("id", "userLink");
    link.attr("href", "javascript:showPage('" + linkUrl + "')")
    link.css("color",obj.css("color"));
    link.text(callerName);
    obj.append(link);
    return link;
  } catch (ex) {
    jslog(errorLogPrefix + " getUserLink: " + ex.message);
  }
}

// If company details are available in service now, create its name a profile link on company view
function getCompanyLink(obj, callDetails) {
  try {
    obj.html("");
    var link = $j("<a>");
    link.attr("id", "userLink");
    link.attr("href", "javascript:showPage('" + callDetails.companyLink + "')")
    link.css("color",obj.css("color"));
    link.text(callDetails.company);
    obj.append(link);
    return link;
  } catch (ex) {
    jslog(errorLogPrefix + " getCompanyLink: " + ex.message);
  }
}

function setUserDetails(callDetails){
  try{
    if(callDetails){
      $j("#outgoingS2Name1").removeClass("unknown-number");
      var userLink = callDetails.callerID ? callDetails.callerName :  initCall.getPhoneDisplayFormat(callDetails.phoneNumber);
      if (callDetails.callerID) {
        getUserLink($j("#outgoingS2Name"), callDetails.callerID, callDetails.callerName);
        getUserLink($j("#outgoingS2Name1"), callDetails.callerID, callDetails.callerName);
        getUserLink($j("#incoming_name"), callDetails.callerID, callDetails.callerName);
        getUserLink($j("#outgoingInternalName"), callDetails.callerID, callDetails.callerName);
        $j('#showKnown').show(0);
        $j('#showUnknown').hide(0);
      } else if(callDetails.company && callDetails.users.length > 0){
        getCompanyLink($j("#outgoingS2Name"), callDetails);
        getCompanyLink($j("#outgoingS2Name1"), callDetails);
        getCompanyLink($j("#incoming_name"), callDetails);
        getCompanyLink($j("#outgoingInternalName"), callDetails);
        $j('#showKnown').show(0);
        $j('#showUnknown').hide(0);
      }else{
        $j("#outgoingS2Name1").addClass("unknown-number");
        $j("#outgoingS2Name1").text(userLink);
        $j("#outgoingS2Name").text(userLink);
        $j("#incoming_name").text(callDetails.callerName);
        $j("#outgoingInternalName").text(callDetails.callerName);
      }
    }
  }
  catch(ex){
    jslog(errorLogPrefix + " setUserDetails: " + ex.message);
  }
}

function processKnownUnknown(callDetails){
  try{
    if(callDetails.callerID){
      $j("#outgoingS2Comp").show();
      $j("#outgoingS2Desig1").show();
      $j(".Contact_Big_calling").attr("src",KNOWN_CONTACT);
      $j(".external_contact_56_incoming_call").attr("src",KNOWN_CONTACT);
    }
    else{
      $j("#outgoingS2Comp").hide();
      $j("#outgoingS2Desig1").hide();
      $j(".Contact_Big_calling").attr("src",UNKNOWN_CONTACT);
      $j(".external_contact_56_incoming_call").attr("src",UNKNOWN_CONTACT);
    }
  }
  catch(ex){
    jslog(errorLogPrefix + " hideKnownAccountDetails: " + ex.message);
  }
}

function setCompanyDetails(callDetails){
  try{
    if(callDetails){ //&& callDetails.callerID){
      var unknownStr = "";
      //if(callDetails.callType != "internal" && !callDetails.callerID)
      //	unknownStr ="Unknown account";
      if(callDetails.companyLink && callDetails.callType != "internal"){
        getCompanyLink($j("#outgoingS2Comp"),callDetails);
        getCompanyLink($j("#outgoingS2Desig1"),callDetails);
        //	getCompanyLink($j("#incoming_desig"),callDetails);
        getCompanyLink($j("#incoming_comp"),callDetails);
        //getCompanyLink($j("#outgoingInternalDesig"),callDetails);
      }
      else{
        $j("#outgoingS2Comp").text(callDetails.company || unknownStr);
        $j("#outgoingS2Desig1").text(callDetails.company || unknownStr);
        if(callDetails.callType == "internal")
          $j("#incoming_desig").text(callDetails.phoneNumber);
        else{
          $j("#incoming_comp").text(callDetails.company || unknownStr);
        }
        //$j("#outgoingInternalDesig").text(callDetails.company || unknownStr);
      }
    }
    else{
      $j("#outgoingS2Comp").text("");
      $j("#outgoingS2Desig1").text("");
      $j("#incoming_desig").text("");
      //$j("#outgoingInternalDesig").text("");
    }

  }
  catch(ex){
    jslog(errorLogPrefix + " setCompanyDetails: " + ex.message);
  }
}

function setInternalTitle(callDetails){
  try {
    if(callDetails.title){
      $j("#outgoingInternalDesig").text(callDetails.title || '');
      $j("#outgoingInternalExt").show();
    }
    else{
      $j("#outgoingInternalDesig").text(callDetails.phoneNumber || '');
      $j("#outgoingInternalExt").hide();
    }
  }
  catch(ex){
    jslog(errorLogPrefix + " setInternalTitle: " + ex.message);
  }
}

// refresh user information data in all views.
function populateUserInfo(callDetails) {
  try {
    if (callDetails && (!activeTab || activeTab == callDetails.callID || (!callDetails.callID && callDetails.callDirection == "outgoing"))) {
      //$j(".call-btn").removeClass('disable');
      var unknownStr = "";
      if(callDetails.callType != "internal" && !callDetails.callerID && callDetails.users.length < 1){
        unknownStr ="Unknown account";
      }
      $j("#outgoingS2Desig").text(callDetails.title || unknownStr);
      $j("#outgoingS2Comp1").text(callDetails.title || unknownStr);
      setUserDetails(callDetails);
      setCompanyDetails(callDetails);
      processKnownUnknown(callDetails);
      //	$j("#incoming_comp").text(callDetails.title || '');
      $j("#incoming_desig").text(callDetails.title || '');
      $j("#outgoingInternalDesig").text(callDetails.title || '');
      $j("#outgoingInternalExt").text(callDetails.phoneNumber);
      gel('sys_display.user_name').value = callDetails.callerName || '';
      $j("#incomingcallerName").text("");
      setInternalTitle(callDetails);
      if(callDetails.callerID){
        $j("#incomingcallerName").text(callDetails.callerName || '');
        gel("display_hidden.user_name").value = callDetails.callerID;
        gel("sys_display.user_name").value = callDetails.callerName || '';
        gel("user_name").value = callDetails.callerID || '';
        updateIncLookup(callDetails.callerID);
      }
      if (!window.top.calls) {
        window.top.calls = {};
      }
      var callID = callDetails.callID;
      if (!callID) {
        callID = callDetails.phoneNumber;
      }
      if (!window.top.calls[callID]) {
        window.top.calls[callID] = {};
        Object.assign(window.top.calls[callID], callDetails);
      }
      showHideIncident(callDetails);
      autosearchInc(callDetails.callerID);
      var userLink = callDetails.callerName;
      if(!callDetails.callerID && callDetails.callType != "internal"){
        userLink = initCall.getPhoneDisplayFormat(callDetails.callerName);
      }
      userLink = userLink || callDetails.company;
      $j("#tabTitle_" + callID).text(userLink);
      //updateTabDetails(callDetails);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " populateUserInfo: " + ex.message);
  }
}

// Popup profile page. This method is called when configuration setting of open profile on incoming is ON
function showProfilePopup(userID) {
  try {
    if (userID)
      window.open("/sys_user.do?sysparm_nostack=true&sys_id=" + userID);
  } catch (ex) {
    jslog(errorLogPrefix + " showProfilePopup: " + ex.message);
  }
}

// Get call object from an array of active calls
function getCallObject(phoneNumber) {
  try {
    //	phoneNumber = phoneNumber || $j('#dialPad').html();
    phoneNumber = phoneNumber ||  $j( "#dialPad" ).val();
    return window.top.calls[phoneNumber];
  } catch (ex) {
    jslog(errorLogPrefix + " getCallObject: " + ex.message);
  }
}

// Switch sections of view as per tab click or call status changes.
function showSection(sectionName) {
  try {
    //showTabs();
    var sections = ['welcome','showDialpad', 'DialpadSettings', 'incomingCall', 'outgoingCall', 'activeCall', 'select_device_no_device', 'select_the_device', 'internalCall', 'error','showSettingsFromDialpadID'];
    sections.forEach(function(section, idx) {
      $j('#' + section).hide();
    });
    $j('#' + sectionName).show(0);
  } catch (ex) {
    jslog(errorLogPrefix + " showSection: " + ex.message);
  }
}

// Initiate call object on incoming call
function loadIncomingCall(msg, switchView) {
  try {
    var event = msg.eventType.toLowerCase();
    var direction = msg.callDirection;
    var callType = msg.callType;
    var phoneNumber = msg.caller ? msg.caller.phoneNumber : '';
    var displayName = msg.caller ? msg.caller.displayName : '';
    var callID = msg? msg.callId : '';
    var objCall = getCallObject(callID);
    if (!objCall && !finishedCalls[callID]) {
      doCleanUp();
      //objCall = x_401039_elevate.CallUtil.initialize(callID,'',displayName,phoneNumber,callType);
      objCall = {};
      Object.assign(objCall, x_401039_elevate.CallUtil);
      objCall.status = event;
      objCall.callDirection = direction;
      objCall.callType = callType;
      objCall.userInfoCallback = updateTabDetails;
      objCall.company = "";
      objCall.title = "";
      objCall.initialize(callID, '', displayName, phoneNumber, callType);
      window.top.calls[callID] = {};
      window.top.calls[callID] = objCall;
      //populateUserInfo(objCall);
      //Object.assign(window.top.calls[callID],objCall);
      //objCall = window.top.calls[callID];
    }
    if (callType == "internal") {
      objCall.callerName = displayName;
    } else {
      objCall.callerName = objCall.callerID ? objCall.callerName : phoneNumber;
    }

  } catch (ex) {
    jslog(errorLogPrefix + " loadIncomingCall: " + ex.message);
  }
}

// Update tab title when user remapping is done on active screen
function updateTabDetails(callDetails) {
  try {
    window.top.calls[callDetails.callID] = callDetails;
    var tabTile = callDetails.callerName;
    tabTile = tabTile || callDetails.phoneNumber;
    if(!callDetails.callerID && callDetails.callType != "internal"){
      tabTile = initCall.getPhoneDisplayFormat(tabTile);
    }
    $j("#tabTitle_" + callDetails.callID).text(tabTile || callDetails.company);
    if(callDetails.callType == "internal"){
      var parent = $j("#img_"+callDetails.callID).parent();
      $j("#img_"+callDetails.callID).remove();
      $j("<div class='tab-internal'>"+setLogoInitial(callDetails)+"</div>").appendTo(parent);
    }
    else if(callDetails.callerID){
      $j("#img_"+callDetails.callID).attr('src',KNOWN_CONTACT);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " updateTabDetails: " + ex.message);
  }
}

function refreshIncidentInfo(incID,num){
  try{
    setTimeout(function(){
      gel('incident_list').value = incID;
      gel('sys_display.incident_list').value = num;
      incidentChange();
    },1000);
  }	catch(ex){
    jslog(errorLogPrefix + " refreshIncidentInfo: " + ex.message);

  }
}

function resetIncidents(callDetails){
  try{
    callDetails.relatedTo = '';
    callDetails.incidents = [];
    updateIncident(callDetails);
  }	catch(ex){
    jslog(errorLogPrefix + " resetIncidents: " + ex.message);

  }
}

function refreshUserInfo(){
  try{
    setTimeout(function(){
      var objCall = getCallObject(activeTab);
      resetIncidents(objCall);
      objCall.getUserListByNumber(objCall.phoneNumber, populateUserInfo);
    },1000);
  }	catch(ex){
    jslog(errorLogPrefix + " refreshUserInfo: " + ex.message);

  }
}

// Incoming call view
function showIncomingScreen(phoneNumber, callType, callDirection, callId, callCount, switchView) {
  try {
    var objCall = getCallObject(callId);
    if (callCount < 1 || switchView) {
      showSection('incomingCall');
      var callerName = objCall.callerName.toLowerCase();
      var formatedNum = "Caller " + initCall.getPhoneDisplayFormat(phoneNumber);
      $j('#phone').html(callerName == 'anonymous' ? 'anonymous' : formatedNum);
      if (phoneNumber == 'anonymous')
        phoneNumber = callId;
      $j("#btnDisconnect").attr('data-id', callId);
      //if (callerName != 'anonymous' && callerName != 'unknown' && callerName && callerName.length > 0) {
      if(objCall.callerID || objCall.users.length > 0 || objCall.callType == "internal"){
        //objCall.title = objCall.title;
        $j('#incoming_name').html(objCall.callerName);
        if(objCall.callType == "internal"){
          $j('#incoming_desig').html(objCall.phoneNumber);
        }
        else{
          $j('#incoming_desig').html(objCall.title);
        }
        $j('#incoming_comp').html(objCall.company);
        $j('#showKnown').show(0);
        $j('#showUnknown').hide(0);
      } else {
        $j('#showKnown').hide(0);
        $j('#showUnknown').show(0);
      }

      objCall.callDirection = callDirection;
      if (callType !== 'undefined')
        objCall.callType = callType;
      if(callType != "internal")
        objCall.getUserListByNumber(phoneNumber, populateUserInfo);
      objCall.answerCall();
      window.top.$j("#popUpContent").show(0);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " showIncomingScreen: " + ex.message);
  }
}

//Outgoing call view
function showOutGoingScreen(phoneNumber, callType, callDirection, refreshUser, callDetails) {
  try {
    $j('#progressText').html("Calling...");
    if (refreshUser) {
      populateUserInfo(callDetails);
    }
    showSection('outgoingCall');
    locked = false;
  } catch (ex) {
    jslog(errorLogPrefix + " showOutGoingScreen: " + ex.message);
  }
}

function setLogoInitial(callDetails){
  var initials ="";
  try{
    var names = callDetails.callerName.split(" ");
    var cnt = 0;
    $j.each(names, function(idx,name){
      if(cnt < 2)
        initials += name.substr(0,1);
      ++cnt;
    });
    return initials;
  }catch(ex){
    jslog(errorLogPrefix + " setLogoInitial: " + ex.message);
    return initials;
  }
}

// Active call view
function showActiveCall(callID, callType, callDirection) {
  try {
    var objCall = getCallObject(callID);
    if (objCall) {
      //populateUserInfo(objCall);
      if (callType !== 'undefined')
        objCall.callType = callType;
      if (callDirection !== 'undefined')
        objCall.callDirection = callDirection;
      activeCall = objCall;
      populateUserInfo(objCall);
      updateIncident(objCall);
      var related = gel('incident_list');
      related.placeholder = "Related to";
      $j("#callProgress").show(0);
      $j("#afterClose").hide(0);
      if (objCall.callType == "internal") {
        $j(".internal-logo-circle").text(setLogoInitial(objCall));
        showSection('internalCall');
      } else {
        $j('#commentData').val(objCall.comments || '');
        showSection('activeCall');
      }
      objCall.answerCall();
      $j("#btnDisconnect").attr('data-id', callID);
      var status = objCall.status;
      if(objCall.callDirection == "outgoing" && (status == "connecting" || status == "calling") || objCall.callDirection != "outgoing" && (status == "connected" || status == "callestablished")){
        showSearchUser();
        showIncidentListUser();
      }
      showHideIncident(objCall);
      autosearchInc(objCall.callerID);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " showActiveCall: " + ex.message);
  }
}

function showIncidentPopup(id){
  try{
    if(id != -1)
      window.open('/incident.do?sysparm_nostack=true&sys_id=' + id);
  }
  catch(ex){
    jslog(errorLogPrefix + " showPopup: " + ex.message);
  }
}

// Pull list of all associated incidents
function populateIncidentList(callDetails) {
  try {
    var incSelect = $j("#incidents");
    /*var incList = callDetails.incidents;
    incList.forEach(function(value, idx) {
      var o = new Option(value.short_description, value.id);
      /// jquerify the DOM object 'o' so we can use the html method
      $j(o).html(value.short_description);
      $j(o).addClass('showCursor');
      incSelect.append(o);
    });*/
    $j('#openIncident').attr('href', 'javascript:showIncidentPopup('+incSelect.val()+')');//'/incident.do?sysparm_nostack=true&sys_id=' + incSelect.val());
  } catch (ex) {
    jslog(errorLogPrefix + " populateIncidentList: " + ex.message);
  }
}

// Update call object with the call id received from API call during outgoing call
function updateCallID(callDetails) {
  try {
    if (callDetails.callID && !callError) {
      //$j(".call-btn").removeClass('disable');
      window.top.calls[callDetails.callID] = callDetails;
      delete window.top.calls[callDetails.phoneNumber];
      showTabs(callDetails.callID);
      if (errorNumbers[callDetails.phoneNumber] !== 1) {
        showOutGoingScreen(callDetails.phoneNumber);
        $j("#btnDisconnect").attr('data-id', callDetails.callID);
      }
    } else {
      callError = false;
      delete window.top.calls[callDetails.phoneNumber];
    }

  } catch (ex) {
    jslog(errorLogPrefix + " updateCallID: " + ex.message);
  }
}

// Initiate outgoing call.
function sendCallCommand(callDetails) {
  try {
    callError = false;
    callDetails.callDirection = "outgoing";
    var objCall = getCallObject(callDetails.phoneNumber);
    populateUserInfo(callDetails);
    dialed = objCall;
    if (objCall) {
      objCall.callDirection = "outgoing";
      objCall.status = "calling";
      /*if(objCall.isListnerError()){
        objCall.commandHandler = interMediaListner;
        objCall.callback = updateCallID;
        objCall.startSubscription();
      }
      else{*/
      objCall.placeCall(Object.keys(window.top.calls).length, updateCallID);
      //}
    }
  } catch (ex) {
    jslog(errorLogPrefix + " sendCallCommand: " + ex.message);
  }
}

// Dial call event handler
function intiateCall() {
  try {
    if(!locked){
      locked = true;
      if (!window.top.calls)
        window.top.calls = {};
      doCleanUp();
      var checkNumber = $j( "#dialPad" ).val();
      delete errorNumbers[checkNumber];
      var call = {};
      Object.assign(call, x_401039_elevate.CallUtil);
      call.initialize();
      window.top.calls[checkNumber] = call;
      call.getUserListByNumber(checkNumber.toString(), sendCallCommand);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " intiateCall: " + ex.message);
  }

}

// Clear call pickup animation timer
function clearAnimation(callDetails) {
  try {
    if (callDetails && callDetails.tAnimation) {
      clearInterval(callDetails.tAnimation);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " clearAnimation: " + ex.message);
  }
}

//Call pickup animation
function handsetAnimation(callDetails) {
  try {
    var element = $j('.Group');
    //element.css('position', 'absolute');
    //var top = element.css('top');
    if (lift) {
      element.animate({ top: '-36px', left: '-50px' },1200);
      lift = false;
      //element.css('top', '-36px');
    } else {
      element.animate({ top: '-7.5px', left: '-20px' },1200);
      lift = true;
      //element.css('top', '-7.5px');
    }
  } catch (ex) {
    jslog(errorLogPrefix + " intiateCall: " + ex.message);
  }
}

//Callback function after call disconnection API call
function afterCallDisconnect(callDetails) {
  try {
    /*if (!callDetails.callTime || callDetails.callType == "internal") {
      finishedCalls[callDetails.callID] = callDetails.callID;
      delete window.top.calls[callDetails.phoneNumber];
      delete window.top.calls[callDetails.callID];
    }*/
    var skipNextView = false;
    if(!callDetails.callTime && callDetails.callDirection == "outgoing"){// && connectedCall[callDetails.callID]){
      skipNextView = true;
    }
    if ((!callDetails.callTime && !skipNextView) || callDetails.callType != "external"){
      finishedCalls[callDetails.callID] = callDetails.callID;
      delete window.top.calls[callDetails.phoneNumber];
      delete window.top.calls[callDetails.callID];
      getNextTab();
    }
    showTabs();
  } catch (ex) {
    jslog(errorLogPrefix + " afterCallDisconnect: " + ex.message);
  }
}

// Disconnect call event handler
function disconnectCall(phoneNumber, skipAPICall, callType, callDirection, callID) {
  try {
    $j('#activeCall').removeClass('onHold');
    if (!callID && !callError) {
      callID = $j("#btnDisconnect").attr('data-id');
      updateCommentsInObject(callID);
    }
    var activeCallID = $j("#btnDisconnect").attr('data-id');
    clearContent();
    endCall = true;
    var objCall = getCallObject(callID);
    if (!objCall && !callError) {
      return getNextTab();
    }
    //if (activeTab && activeTab == callID && !objCall.callTime)
    //	activeTab = '';
    skipAPICall = skipAPICall || false;
    if (objCall) {
      if (!skipAPICall) {
        objCall.disconnectCallback = afterCallDisconnect;
        objCall.callDirection = callDirection || objCall.callDirection;
        objCall.disconnectCall();
        objCall.status = 'disconnected';
      } else {
        afterCallDisconnect(objCall);
      }

    }
    if (!callError && objCall && activeCallID == objCall.callID && objCall.status == "disconnected" && objCall.callType != "internal") {
      $j("#afterClose").show(0);
      $j('#progressText').html("Call ended");
      $j("#callProgress").hide(0);
    }

  } catch (ex) {
    jslog(errorLogPrefix + " disconnectCall: " + ex.message);
  }
}
//Refresh call duration
function refreshTimer() {
  try {
    var objCall;
    if (activeTab) {
      objCall = getCallObject(activeTab);

    } else {
      var callID = $j("#btnDisconnect").attr('data-id');
      objCall = getCallObject(callID);
    }
    if (objCall) {
      $j('.watch').text(objCall.callTime);
      $j('#timerValue').text(objCall.callTime);
      $j('#internalTimer').text(objCall.callTime);
    }
  } catch (ex) {
    jslog(errorLogPrefix + " refreshTimer: " + ex.message);
  }
}

//active call JS start
function startTimer(callID) {
  try {
    var objCall = getCallObject(callID);
    if (objCall) {

      if (!objCall.t) {
        objCall.seconds = 0;
        objCall.minutes = 0;
        objCall.hours = 0;
        objCall.t = setInterval(add, 1000);
      }
    }

    function add() {
      objCall.seconds++;
      if (objCall.seconds >= 60) {
        objCall.seconds = 0;
        objCall.minutes++;
        if (objCall.minutes >= 60) {
          objCall.minutes = 0;
          objCall.hours++;
        }
      }
      objCall.callTime = (objCall.minutes ? (objCall.minutes > 9 ? objCall.minutes : "0" + objCall.minutes) : "00") + ":" + (objCall.seconds > 9 ? objCall.seconds : "0" + objCall.seconds);
      refreshTimer();
    }
  } catch (ex) {
    jslog(errorLogPrefix + " startTimer: " + ex.message);
  }
}
/* Stop button */
function stopwatch(callID) {
  try {
    var objCall = getCallObject(callID);
    clearInterval(objCall.t);
  } catch (ex) {
    jslog(errorLogPrefix + " stopwatch: " + ex.message);
  }
}

//Place new call event handler
function initiateMultiCall() {
  try {
    $j("#showContact").hide();
    var callList = Object.keys(window.top.calls);
    showSection('showDialpad');
    if (callList.length < 2)
      $j("#showContact").show();
    if (activeCall) {
      $j("#multiIcon").show();
      $j(".multi-single").remove();
      if(callList.length == 1){
        if(activeCall.callType == "internal"){
          var parent = $j("#multiIcon").parent();
          $j("#multiIcon").hide();
          $j("<div class='tab-internal multi-single'>"+setLogoInitial(activeCall)+"</div>").appendTo(parent);
        }
      }
      $j("#multi1Username").text(activeCall.callerName);
      if (activeCall.status == "on hold") {
        $j("#showContact").addClass('onHold');
      } else {
        $j("#showContact").removeClass('onHold');
      }
    }
  } catch (ex) {
    jslog(errorLogPrefix + " initiateMultiCall: " + ex.message);
  }
}
//Active call user search handler
function showSearchUser() {
  try {
    $j("#searchUser").show(); //.css('display', 'block');
    $j("#showUser").hide(); //css('display', 'none');

  } catch (ex) {
    jslog(errorLogPrefix + " showSearchUser: " + ex.message);
  }
}
//active call incident search handler
function showIncidentListUser() {
  try {
    $j("#incidentListUser").show(); //css('display', 'block');
    $j("#showIncident").hide();//css('display', 'none');
  } catch (ex) {
    jslog(errorLogPrefix + " showIncidentListUser: " + ex.message);
  }
}

function hideReferenceFields(){
  try {
    $j("#incidentListUser").hide(); //css('display', 'block');
    $j("#showIncident").show();//css('display', 'none');
    $j("#searchUser").hide(); //.css('display', 'block');
    $j("#showUser").show(); //css('display', 'none');
  } catch (ex) {
    jslog(errorLogPrefix + " hideReferenceFields: " + ex.message);
  }
}

//Active call on user change handler
function doMyOnChange() {
  try {
    //$j("#searchUser").hide();//.css('display', 'none');
    //$j("#showUser").show();//.css('display', 'block');
    var selectedUser = $('sys_display.user_name').value;
    var callerID = gel('user_name').value;
    $j("#incomingcallerName").text(selectedUser || 'Unknown');
    updateIncLookup(callerID);
    var callID = $j("#btnDisconnect").attr('data-id');
    var objCall = getCallObject(callID);
    resetIncidents(objCall);
    objCall.getUserListByID(callerID, populateUserInfo);
    saveLog(true);
    showIncidentListUser();
    showHideIncident(objCall);
    $j("#incidentName").text('');
    gel('sys_display.incident_list').value = '';
    /*Auto search completer*/
    autosearchInc(callerID);
  } catch (ex) {
    jslog(errorLogPrefix + " doMyOnChange: " + ex.message);
  }
}
function autosearchInc(callerID){
  var x = gel('sys_display.incident_list');
  x.onfocus();
  jslog(x.ac);
  //	x.ac.referenceSelect('', '');
  x.ac.setRefQual("caller_id=" + callerID);
  x.ac.cacheClear();
}

//active callon incident change handler
function updateIncident(objCall) {
  try {
    if (objCall.incidents && objCall.incidents.length > 0) {
      var info =  objCall.incidents[0];
      $j("#incidentName").text(info.short_description);
      gel("display_hidden.incident_list").value =info.id;
      gel("incident_list").value =info.id;
      gel("sys_display.incident_list").value = info.number;
      $j("#callLog").attr("href", "javascript:showIncidentPopup('" +  gel('incident_list').value + "');");
    }
    else{
      $j("#incidentName").text('');
      gel("display_hidden.incident_list").value = '';
      gel("incident_list").value = '';
      gel("sys_display.incident_list").value = '';
      $j("#callLog").attr("href", "javascript:showIncidentPopup('-1');");
    }
  } catch (ex) {
    jslog(errorLogPrefix + " updateIncident: " + ex.message);
  }
}

//active callon incident change handler
function incidentChange() {
  try {
    if (!activeTab)
      activeTab = $j("#btnDisconnect").attr('data-id');
    var callDetails = getCallObject(activeTab);
    if(callDetails){
      callDetails.getIncidentDetails(gel('incident_list').value, updateIncident);
    }
    //x_401039_elevate.CallUtil.getIncidentDetails(gel('incident_list').value, updateIncident);
    //$j("#incidentListUser").hide();//.css('display', 'none');
    //$j("#showIncident").show();//.css('display', 'block');
    var selectedINC = $('sys_display.incident_list').value;
    //$j("#incidentName").text(selectedINC || 'Unknown');
    //var url = "/incident.do?sysparm_nostack=true&sys_id=" + gel('incident_list').value;
    $j("#callLog").attr("href", "javascript:showIncidentPopup('" +  gel('incident_list').value + "');");
    saveLog(true);
  } catch (ex) {
    jslog(errorLogPrefix + " incidentChange: " + ex.message);
  }
}

//update open log link and incident reference lookup condition on user change
function updateIncLookup(callerID) {
  try {
    var IncLookUp = gel('lookup.incident_list');
    IncLookUp.setAttribute('onclick', "mousePositionSave(event); reflistOpen( 'incident_list', 'not', 'incident', '', 'false','QUERY:active=true','caller_id=" + callerID + "','')");
    var incURL = "/incident.do?sysparm_nostack=true&sys_id=-1" + "&sysparm_query=caller_id=" + callerID;
    $j("#newIncident").attr("href", "javascript:showPage('" + incURL + "');//");

  } catch (ex) {
    jslog(errorLogPrefix + " updateIncLookup: " + ex.message);
  }
}

//Update main window view as per input URI
function showPage(url) {
  try {
    window.top.$j("#gsft_main").attr('src', url);
    return false;
  } catch (ex) {
    jslog(errorLogPrefix + " showPage: " + ex.message);
  }
}
//Save log handler
function saveLog(overRideLogLevel) {
  try {
    var selectedUser = gel('user_name').value;
    var incidentNo = gel('incident_list').value;
    var comments = $j('#commentData').val();
    var phoneNumber = $j("#btnDisconnect").attr('data-id');
    var objCall = window.top.calls[phoneNumber];
    if(objCall){
      objCall.commentsChanged = false;
      if(objCall.comments != comments){
        objCall.comments = comments;
        objCall.commentsChanged = true;
      }
      if (objCall && (logLevel === "no" || overRideLogLevel) && objCall.callType != "internal") {
        objCall.saveCall(comments, incidentNo);
      }
    }
    if (!overRideLogLevel) {
      activeTab = "";
      delete window.top.calls[phoneNumber];
      finishedCalls[phoneNumber] = phoneNumber;
      $j("#afterClose").hide(0);
      clearContent();
      getNextTab();
      showTabs();
    }
    delete connectedCall[phoneNumber];
  } catch (ex) {
    jslog(errorLogPrefix + " saveLog: " + ex.message);
  }
}

// Get next available tab
function getNextTab() {
  try {
    var callList = Object.keys(window.top.calls);
    if (callList.length > 0) {
      var tabID = '';
      if (activeTab && activeTab.length > 0 && callList[activeTab])
        tabID = activeTab;
      else {
        activeTab = tabID = callList[0];
      }
      refreshView(tabID);
    } else {
      showHideContact();
      $j('#commentData').val("");
      showSection('showDialpad');
    }
    doCleanUp();
    if (callList.length.length < 2) {
      var tabs = $j("#multiTab");
      tabs.hide();
    }
  } catch (ex) {
    jslog(errorLogPrefix + " getNextTab: " + ex.message);
  }
}
