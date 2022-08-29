# SEPTA Checker: v2
This is a Discord bot that fetches from the SEPTA API every 2 minutes and returns delays, last recorded location, and train consist information for user-inputted train numbers in a specified text channel. It also regularly updates users on alerts/advisories for regional rail lines.

This bot is designed to be used in one server per host, posting messages to a locked channel, so as it is the only user that can post in the channel. *Using this bot in a public channel or one that is unlocked to various people may be problematic.*

## Changes
Version 2 primarily consists of significant refactoring of code mainly due to SEPTA's 2022 website overhaul. The main changes include:

- Rewriting from the ground-up in TypeScript (v1 was written in JavaScript)
- Usage of `axios` for fetching instead of `cheerio`/`request-promise`
- Data relying solely on the SEPTA API as TrainView is now deprecated
- Refactoring of certain functions, including train lookup
- Alerts: Media/Elwyn replaced with Media/Wawa
- Removal of station tracking due to the removal of TrainView

v1 of this project is archived and available [here](https://github.com/sbrugel/SEPTA-Checker).

## Credits
This bot was created and is maintained by Simon Brugel.

I would like to thank the following people for their contributions to this project:

Ben Segal - Various bits including saving user-entered data in the config
JD Wang - Discovery of the SEPTA API
Josh Lyon - Embeds