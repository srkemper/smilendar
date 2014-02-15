this["Smilendar"] = this["Smilendar"] || {};
this["Smilendar"]["Templates"] = this["Smilendar"]["Templates"] || {};

this["Smilendar"]["Templates"]["templates/eventItem.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"event-item\">\n  <a href=\"/calendar_event/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"event-time col-xs-3\">\n    <h6 class=\"start-time\">2:15 PM</h6>\n    <h6 class=\"end-time\">3:30 PM</h6>\n  </div>\n  <div class=\"col-xs-9 event-info\">\n    <h5 class=\"event-title\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h5>\n    <p class=\"event-brief\">";
  if (stack1 = helpers.comment) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.comment); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n    <div class=\"smile\">\n      <div class=\"dropdown\">\n        <button data-toggle=\"dropdown\" class=\"btn-xs smile-face mood-display\" id=\"";
  if (stack1 = helpers.mood) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.mood); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-identifier=\"";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0._id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">smile</button>\n        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n          <li id=\"happy\" class=\"smile-face mood-status\">Happy</li>\n          <li id=\"excited\" class=\"smile-face mood-status\">Excited</li>\n          <li id=\"sad\" class=\"smile-face mood-status\">Sad</li>\n          <li id=\"angry\" class=\"smile-face mood-status\">Angry</li>\n        </ul>\n      </div>\n    </div>\n  </div>\n  <div class=\"clearfix visible-xs\"></div>\n  </a>\n</div>";
  return buffer;
  });

this["Smilendar"]["Templates"]["templates/eventList.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = self.invokePartial(partials.eventItem, 'eventItem', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.eventList), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });