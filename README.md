# SEPTA Checker: v2
Originally created in 2021, this is a Discord bot that fetches from the SEPTA API every 2 minutes and returns delays, last recorded location, and train consist information for user-inputted train numbers in a specified text channel. It also regularly updates users on alerts/advisories for regional rail lines.

This bot is designed to be used in one server per host, posting messages to a locked channel, so as it is the only user that can post in the channel. *Using this bot in a public channel or one that is unlocked to various people may be problematic.*

Version 2 consists of a complete overhaul and re-writing of the original bot's code owing to a recent overhaul of SEPTA's website and feeds. Version 1 of this project is now archived, no longer being worked on. [You can view the repostiory here](https://github.com/sbrugel/SEPTA-Checker).

## Features
**Ability to track train delay, location, and consist information live.** The bot allows you to add certain SEPTA train numbers to the tracker, using the `/addtrain` command. Trains can be removed from the tracker using the `/removetrain` and `/cleartrains` commands. These are added to a feed which is updated every two minutes.

![Delays window](https://i.imgur.com/A5wOYM6.png)

**Ability to track SEPTA regional rail alerts live.** Also updated every 2 minutes. You can track regional rail lines for advisories and alerts using the `/addalert` command. You can also remove lines from being tracked with `/removealert`.

![Alerts window](https://i.imgur.com/0X9GJnm.png)

**Other commands**

`/refresh` - Forces a refresh of the information board, even before the 2 minute interval is hit.

`/query` - Gets information about a train without adding it to the tracker.

`/toggleconsists` - Toggles whether consist information is displayed as car numbers or more generally (i.e. number of cars on the train).

`/viewtrains` - See a list of trains currently being tracked.

## Changes
Version 2 primarily consists of significant refactoring of code mainly due to SEPTA's 2022 website overhaul. The main changes include:

- Rewriting from the ground-up in TypeScript (v1 was written in JavaScript)
- Usage of `axios` for fetching instead of `cheerio`/`request-promise`
- Data relying solely on the SEPTA API as TrainView is now deprecated
- Refactoring of certain functions, including train lookup
- Alerts: Media/Elwyn replaced with Media/Wawa. Improved alert formatting, now using regex. Line parameter is now choices instead of a text box.
- Removal of station tracking due to the removal of TrainView. May or may not be reinstated later.

## Credits
This bot was created and is maintained by Simon Brugel.

I would like to thank the following people for their contributions to this project:

```
Ben Segal - Various pieces including saving user-entered data in the config
JD Wang - Discovery of the SEPTA API
Josh Lyon - Embeds
```
