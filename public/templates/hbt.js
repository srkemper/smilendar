this["Smilendar"] = this["Smilendar"] || {};
this["Smilendar"]["Templates"] = this["Smilendar"]["Templates"] || {};

this["Smilendar"]["Templates"]["templates/eventItem.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "\n<div class=\"event-item isMoodEvent\">\n";
  }

function program3(depth0,data) {
  
  
  return "\n<div class=\"event-item\">\n";
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isMood), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <a class=\"go-to-event\" href=\"/calendar_event/";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0._id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"event-time col-xs-3\">\n    <h6 class=\"start-time\">";
  if (stack1 = helpers.starttime) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.starttime); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h6>\n    <h6 class=\"end-time\">";
  if (stack1 = helpers.endtime) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.endtime); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h6>\n    \n    \n  </div>\n  <div class=\"col-xs-9 event-info\">\n    <h5 class=\"event-title\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h5>\n    <p class=\"event-brief comment-in-dayview\">";
  if (stack1 = helpers.comment) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.comment); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n    <div class=\"smile\">\n      \n      <div class=\"dropdown closed\">\n        <button data-toggle=\"dropdown\" class=\"btn-xs smile-face mood-display\" id=\"";
  if (stack1 = helpers.moodString) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.moodString); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-identifier=\"";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0._id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">smile</button>\n        <div class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n          <ul class=\"mood-list\">\n            <li id=\"excited\" attr=\"2\" class=\"smile-face mood-status\">Happy</li>\n            <li id=\"happy\" attr=\"1\" class=\"smile-face mood-status\">Excited</li>\n            <li id=\"soso\" attr=\"0\" class=\"smile-face mood-status\">Soso</li>\n            <li id=\"sad\" attr=\"-1\" class=\"smile-face mood-status\">Sad</li>\n            <li id=\"angry\" attr=\"-2\" class=\"smile-face mood-status\">Angry</li>\n            <div class=\"clearfix\"></div>\n          </ul>\n\n\n          <div class=\"input-group\">\n            <input type=\"text\" class=\"form-control comment-input\" placeholder=\"Comment here!\" value=\"";
  if (stack1 = helpers.comment) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.comment); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            <span class=\"input-group-btn\">\n              <button class=\"btn btn-default Go-button\" type=\"button\">Done</button>\n            </span>\n          </div>\n\n\n\n\n          \n\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"clearfix visible-xs\"></div>\n  </a>\n</div>";
  return buffer;
  });

this["Smilendar"]["Templates"]["templates/eventList.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n<div class=\"empty-state col-xs-12\">\n  <h5 class=\"\">Looks like you don't have any events today.</h5>\n  <p class=\"\">Tap \"Check In\" to record how you feel now, then you can start tracking your mood.</p>\n  <p>&#8595</p>\n</div>\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = self.invokePartial(partials.eventItem, 'eventItem', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  stack1 = helpers.unless.call(depth0, (depth0 && depth0.eventList), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.eventList), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

this["Smilendar"]["Templates"]["templates/monthDay.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"cal-row-fluid weekday-num\">\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.weekDays), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"cal-cell1\">\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.date), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <a class=\"stay\" href=\"../";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.url); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        <div class=\"smile-face\" id=\"";
  if (stack1 = helpers.aveMood) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.aveMood); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n        <div class=\"day-order\">";
  if (stack1 = helpers.date) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.date); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"day-event-identifier\" style=\"height: ";
  if (stack1 = helpers.totalEvents) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.totalEvents); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "px\"></div>\n      </a>\n      ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.weeks), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["Smilendar"]["Templates"]["templates/monthNav.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <li class=\"previous\"><a class=\"\" href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.pUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.pMonth)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <li class=\"next\"><a class=\"\" href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.nUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.nMonth)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n  ";
  return buffer;
  }

  buffer += "<div class=\"this-month\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.month)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n<ul class=\"pager\">\n  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.pUrl), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.nav)),stack1 == null || stack1 === false ? stack1 : stack1.nUrl), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>";
  return buffer;
  });