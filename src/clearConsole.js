function clearConsole() {
	
	if( !this.pause ) console.log('\033[2J');
	
};

clearConsole.pause = false;

module.exports = clearConsole;