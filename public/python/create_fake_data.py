import json
import datetime
import code
from random import choice

name = "name"
start = "start"
end = "end"
loc = "location"
comment = "comment"
mood = "mood"
note = "note"
user = "user"

userNames = ['Sean','Zayne','Jim']

moodChoices = [-2, -1, 0, 1, 2]

year = 2014
month = 1
day = 6 	# monday
numWeeks = 10

today = datetime.datetime.today()

oneday = datetime.timedelta(days=1)
oneweek = datetime.timedelta(days=7)

sad_comments = ["Well, I feel very tired at this time", 
"tired", "so many things going on", "will this ever end??", "", "I can't believe this happened. I feel shitty"]
happy_comments = ["wow this is awesome, I'm learning so much!", 
"so exciting!","", "", "can't wait to do it again!", "", "this is a nice thing that happened", "cute"]

# tuple (event, type, start, end)
MW = [("CS 147", "Annenberg", (13,15), (15,0)), ("CS 110", "Gates B2", (9,0), (10,0)), 
("CS 107", "Gates B2", (11,0),(12,15)), ("CS 103", "nVidia", (15,30),(16,45))]
TTh = [("Physical therapy","Vaden",(9,0),(9,30)),("CS 228", "online", (13,15),(15,0)), ("CS 231A", "nVidia", (11,0),(12,15))]
daily = [("feed cat", "home", (20,15),(20,45)),("exercise","gym",(8,0),(9,0))]

def getX(day, event, interval_time, j):
	start_time = j*interval_time+datetime.datetime(year,month,day,event[2][0],event[2][1])
	print start_time
	start_time_int = int(start_time.strftime('%s')+'000')
	final_time = j*interval_time+datetime.datetime(year,month,day,event[3][0],event[3][1])
	final_time_int = int(final_time.strftime('%s')+'000')

# code.interact(local=locals())
	
	if final_time < today:

		moodToday = choice(moodChoices)
		if moodToday > 0:
			commentToday = choice(happy_comments)
		elif moodToday < 0:
			commentToday = choice(sad_comments)
		else:
			commentToday = ""
	else:
		moodToday = 0
		commentToday = ""

	currUser = choice(userNames)

	x = {user: currUser, name: event[0], loc: event[1], start: start_time_int, 
	end: final_time_int, mood: moodToday, comment: commentToday, note:""}
	return x

x_list = []
for event in MW:
	for j in xrange(numWeeks):
		# mondays
		x = getX(day, event, oneweek, j)
		x_list.append(x)

		# Wednesdays
		x = getX(day+2, event, oneweek, j)
		x_list.append(x)

for event in TTh:
	for j in xrange(numWeeks):
		# Tuesdays
		x = getX(day+1, event, oneweek, j)
		x_list.append(x)

		# Thursdays
		x = getX(day+3, event, oneweek, j)
		x_list.append(x)

for event in daily:
	for j in xrange(numWeeks*7):
		# each day
		x = getX(day, event, oneday, j)
		x_list.append(x)

print json.dumps(x_list)
with open('data.json', 'w') as outfile:
  json.dump(x_list, outfile)

# print json.dumps([{name:"CS147", start:"blah"},{name:"CS147", start:"blah"}])