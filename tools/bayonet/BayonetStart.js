const child = require("child_process");

child
	.spawn("node", ["./Bayonet.js"], { detached: true, windowsHide: true })
	.unref();

process.exit(0);