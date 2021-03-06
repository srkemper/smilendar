{{#each eventlist.events}}
		<div class="event-item">
			<a href="/calendar_event/{{id}}">
			<div class="event-time col-xs-3">
				<h6 class="start-time">2:15 PM</h6>
				<h6 class="end-time">3:30 PM</h6>
			</div>
			<div class="col-xs-9 event-info">
				<h5 class="event-title">{{name}}</h5>
				<p class="event-brief">{{comment}}</p>
				<div class="smile">
					<div class="dropdown">
						<button data-toggle="dropdown" class="btn-xs smile-face mood-display" id="{{mood}}" data-identifier="{{_id}}">smile</button>
						<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
					    <li id="happy" class="smile-face mood-status">Happy</li>
					    <li id="excited" class="smile-face mood-status">Excited</li>
					    <li id="sad" class="smile-face mood-status">Sad</li>
					    <li id="angry" class="smile-face mood-status">Angry</li>
					  </ul>
					</div>
				</div>
			</div>
			<div class="clearfix visible-xs"></div>
			</a>
		</div>
{{/each}}