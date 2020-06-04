# Bayonet

`BayonetOpener.bat` runs `BayonetStart.js` that will spawn the detached child process `Bayonet.js`.
This allows the cmd window opened by `BayonetOpener.bat` to close with just the background node process running `Bayonet.js` being left.

## Usage

For development, edit `Bayonet.js` as needed (point the watcher to a different folder.) then run the script.
For a persistent production process, triggered on windows start up, do the following:

1. `Win + r`
2. Type `shell:startup`
3. Copy a shortcut of `BayonetOpener.bat` into the folder.
