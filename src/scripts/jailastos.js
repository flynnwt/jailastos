'use strict';

var common = new Common();

function print(s) {
   common.print('' + s);
}

var config = new ShellConfig();

config.udpEnabled = true;
config.dataDir = './data';
config.logLevel = 5;
config.logFile = 'jailastos.log';

config.addNode('13.58.208.50', '33445', '89vny8MrKdDKs7Uta9RdVmspPjnRMdwMmaiEW27pZ7gh');
config.addNode('18.216.102.47', '33445', 'G5z8MqiNDFTadFUPfMdYsYtkUDbX5mNCMVHMZtsCnFeb');
config.addNode('18.216.6.197', '33445', 'H8sqhRrQuJZ6iLtP2wanxt4LzdNrN2NNFnpPdq1uJ9n2');
config.addNode('52.83.171.135', '33445', '5tuHgK1Q4CYf4K5PutsEPK5E3Z7cbtEBdx7LwmdzqXHL');
config.addNode('52.83.191.228', '33445', '3khtxZo89SBScAMaHhTvD68pPHiKxgZT6hTCSZZVgNEm');

print('logLevel: ' + config.logLevel);

var ela = new Ela();
var rc = ela.init(config);
if (!rc) {
   print('Failed to create carrier!');
   ela.quit();
}

print('address: ' + ela.getAddress());
print(' nodeid: ' + ela.getNodeid());
print(' userid: ' + ela.getUserid());
print('error=' + ela.getError());
ela.run();

while (true) {}