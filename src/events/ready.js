module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
    let activities = [ `Developed by howtoplay#2898`, `New project by howtoplay#2898`, `Spotify` ], i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: "LISTENING" }), 22000);
}};
