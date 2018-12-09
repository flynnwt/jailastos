//'use strict';
// NO! if using callbacks - i guess this applies...was losing variable access when doing callback....
// https://github.com/svaarala/duktape/issues/1243
// Note that if the script is declared strict ("use strict" on first line of file) then the above
//  won't work because the function declaration will be local to the file. In that case you would
//  need to find an alternate method to export it.

// ----------------------------------------------------------------------------

var common = new Common(); // print, settimeout, etc.

function print() {
   var i, s = '';

   for (i = 0; i < arguments.length; i++) {
      s = s + ' ' + arguments[i];
   }

   common.print(s);
}
var console = {};
console.log = print;

// ----------------------------------------------------------------------------

var config = new ShellConfig();

config.udpEnabled = true;
config.dataDir = './data';
config.logLevel = 4;
config.logFile = 'jailastos.log';

config.addNode('13.58.208.50', '33445', '89vny8MrKdDKs7Uta9RdVmspPjnRMdwMmaiEW27pZ7gh');
config.addNode('18.216.102.47', '33445', 'G5z8MqiNDFTadFUPfMdYsYtkUDbX5mNCMVHMZtsCnFeb');
config.addNode('18.216.6.197', '33445', 'H8sqhRrQuJZ6iLtP2wanxt4LzdNrN2NNFnpPdq1uJ9n2');
config.addNode('52.83.171.135', '33445', '5tuHgK1Q4CYf4K5PutsEPK5E3Z7cbtEBdx7LwmdzqXHL');
config.addNode('52.83.191.228', '33445', '3khtxZo89SBScAMaHhTvD68pPHiKxgZT6hTCSZZVgNEm');

print(config);
print();
print();

// ----------------------------------------------------------------------------

var cbIdle = function() {};
callbacks.set('idle', 'cbIdle');

var cbReady = function() {
   print('Connection ready.');
};
callbacks.set('ready', 'cbReady');

var cbConnection = function(status) {
   print('Connection status: ' + status);
};
callbacks.set('connection', 'cbConnection');

var cbFriendList = function(res) {
   if (!res.empty) {
      print('--- friend list ---');
      print(res.name + '(' + res.userid + ') status=' + res.status + ' presence=' + res.presence);
   }
};
callbacks.set('friendlist', 'cbFriendList');

var cbFriendsIterate = function(res) {
   if (!res.empty) {
      print('--- friends -------');
      print(res.name + '(' + res.userid + ') status=' + res.status + ' presence=' + res.presence);
   }
};
callbacks.set('friendsiterate', 'cbFriendsIterate');

var cbFriendConnection = function(userid, status) {
   print('friend connected: ' + userid + ' ' + status);
};
callbacks.set('friendconnection', 'cbFriendConnection');

var cbFriendPresence = function(userid, status) {
   print('friend presence: ' + userid + ' ' + status);
};
callbacks.set('friendpresence', 'cbFriendPresence');

var cbFriendAdded = function(f) {
   print('friend added!');
   printFriend(f);
};
callbacks.set('friendadded', 'cbFriendAdded');

var cbFriendRequest = function(f, userid, msg) {
   print('friend request! (' + userid + ') ' + msg);
   printFriend(f);
};
callbacks.set('friendrequest', 'cbFriendRequest');

var cbFriendRemoved = function(f, userid, msg) {
   print('friend removed! (' + userid + ') ' + msg);
   printFriend(f);
};
callbacks.set('friendremoved', 'cbFriendRemoved');

var cbFriendInfo = function(f) {
   print('friend updated');
   printFriend(f);
};
callbacks.set('friendinfo', 'cbFriendInfo');

var cbFriendMsg = function(userid, msg) {
   print('msg: (' + userid + ') ' + msg);
};
callbacks.set('friendmessage', 'cbFriendMsg');

var cbFriendInvite = function(userid, data) {
   print('invite: (' + userid + ') ' + data);
};
callbacks.set('friendinvite', 'cbFriendInvite');


// ----------------------------------------------------------------------------

var checkError = function() {
   state.error = ela.getError();
   if (state.error) {
      print('*** Error: ' + rc + ' ***');
   }
}

var pad = '          ';

var printUser = function(u) {
   if (!u.empty) {
      print(pad + 'User Info');
      print(pad + '  name: ' + u.name + ' (' + u.userid + ')');
      print(pad + ' phone: ' + u.phone + '  email: ' + u.email + '  region: ' + u.region);
      print(pad + 'gender: ' + u.gender + '  desc: ' + u.description);
   } else {
      print('empty user!');
   }
};

var printFriend = function(f) {
   if (!f.empty) {
      print(pad + 'Friend Info');
      printUser(f);
      print(pad + f.status + '  ' + f.presence + '  label: ' + f.label);
   } else {
      print('empty user!');
   }
};

// ----------------------------------------------------------------------------

var state = {
   error: 0,
   disconnected: true,
   address: null,
   nodeid: null,
   userid: null,
   quit: false,

   show: function() {
      print('address: ' + this.address);
      print('node id: ' + this.nodeid);
      print('user id: ' + this.userid);
      print();
   }
};

// ----------------------------------------------------------------------------
// do something

var prompt = new Prompt()
var cbPrompt = function(cmdline) {
   cmdline = cmdline.trim();
   if (cmdline === '') {
      return;
   }
   tokens = cmdline.split(' ');
   cmd = tokens[0];
   if (tokens.length > 1) {
      tokens = tokens.slice(1).join(' ').split(',');
   } else {
      tokens = [];
   }

   if (cmdline === 'quit') {
      state.quit = true
      ela.quit();
   } else if (cmd === 'add') {
      ela.addFriend(tokens[0], tokens[1])
   } else if (cmd === 'geterror') {
      print('Error: ' + ela.getError());
   } else if (cmd === 'msg') {
      ela.msgFriend(tokens[0], tokens[1]);
   } else if (cmd === 'friends') {
      ela.getFriends();
   } else if (cmd === 'userinfo') {
      self = ela.getSelf();
      if (tokens.length == 0) {
         printUser(self);
      } else {
         if (tokens.length < 2) {
            print('Need parm,value');
         } else {
            if (tokens[0] === 'name') {
               self.name = tokens[1];
            } else if (tokens[0] === 'gender') {
               self.gender = tokens[1];
            } else if (tokens[0] === 'region') {
               self.region = tokens[1];
            } else if (tokens[0] === 'email') {
               self.email = tokens[1];
            } else if (tokens[0] === 'phone') {
               self.phone = tokens[1];
            } else if (tokens[0] === 'desc') {
               self.description = tokens[1];
            } else {
               print('Need [name/gender/region/email/phone/desc]');
            }
            printUser(self);
            ela.setSelf(self);
            checkError();
         }
      }
   }
};
callbacks.set('prompt', 'cbPrompt');

var ela = new Ela();
var rc = ela.init(config);
if (!rc) {
   print('Failed to create carrier!');
   ela.quit();
}

state.address = ela.getAddress();
state.nodeid = ela.getNodeid();
state.userid = ela.getUserid();
state.error = ela.getError();

state.show();

var me = ela.getSelf();
printUser(me);
print();

// ----------------------------------------------------------------------------

// nonthreaded ela_run:
// prompt.readlineAsync();
// threaded ela_run:
ela.threading = true;

ela.run();

// can only do this if ela.run is threaded...
while (!state.quit) {
   cmdline = prompt.readlineTimeout(10);
   if (cmdline !== '') {
      cbPrompt(cmdline);
   }
}