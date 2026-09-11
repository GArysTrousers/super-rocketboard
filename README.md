# Super Rocketboard

The sequal to Rocketboard.

Super Rocketboard is a standalone executable with a web based management interface, so no more php or network shares.

## Setup
Just launch the exe and open the webpage, if you don't have a config file, one will be created and the program will exit.

Complete the config (default will work fine) and relaunch the exe.

## Accounts
There is an Admin and User account, username and password are configured in the config file.

Admin can do everything. User can't delete devices.

## How to set up displays
There are 2 parts to a rocketboard - Device and Playlist.

### Devices
Create a Device for each physical display you have, it will be given an ID.

Set the display up to launch the webpage http://your_server/device/[device id] 

(Exact URL can be found on devices page by clicking the arrow button)

You should never need to change this.

### Playlists
Playlists are lists of images that you can assign to one or more device.

You could create playlists for future use such as events or evacuation instructions, then assign them to devices when they are relevent.