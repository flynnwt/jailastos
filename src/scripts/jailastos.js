//'use strict' // NO! if using callbacks that are eval'd
/* jshint strict:false */
// builtins:
/* global common,ev,prompt,ela,callbacks,ShellConfig,Result */

// ----------------------------------------------------------------------------

var threading = true;
common.setThreading(threading);

// bug in dukcpp?
// can set a cb in c from js, but if the var is then assigned from, it can't be called again;
//  works if called from c
//function j1() {
//   print('j1');
//}
//common.cbtest(j1);
//common.cbtest2();
//common.cbtest2();

function print() {
  var i, s = '';

  for (i = 0; i < arguments.length; i++) {
    s = s + arguments[i] + ' ';
  }

  common.print(s.substr(0, s.length - 1));
}

// it's defined, but can't call it
//var millis = common.millis;
//print(millis);
//print(millis());
function millis() {
  return common.millis();
}

var tick = function() {
  print('...tick...' + millis() + '...');
  ev.setTimeout('tick', 8000);
};

var tock = function() {
  print('...tock...' + millis() + '...');
};

ev.setTimeout('tick', 8000);
ev.setInterval('tock', 20000);

var configFile = 'config.json';
var config;
common.readFile(configFile, function(res, err) {
  if (err.code !== 0) {
    print('error!');
    print(err);
  } else {
    try {
      config = JSON.parse(res);
      print(JSON.stringify(config, null, 2));
    } catch (e) {
      print('Error converting config to JSON!');
      print(e);
    }
  }
});

/*
// returning Result doesn't work
res = common.readFileSync('config.json');
print(res);
if (res.code !== 0) {
   print('error!');
   print(res.code);
   print(res.err);
} else {
   print(res.res);
}
*/

// ----------------------------------------------------------------------------

var sconfig = new ShellConfig();
var i;

sconfig.udpEnabled = config.udpEnabled;
sconfig.dataDir = config.dataDir;
sconfig.logLevel = config.logLevel;
sconfig.logFile = config.logFile;

for (i = 0; i < config.bootstraps.length; i++) {
  sconfig.addNode(config.bootstraps[i].ipv4, config.bootstraps[i].port, config.bootstraps[i].publicKey);
}
/*
print('Writing config to ' + configFile);
common.writeFile(configFile, JSON.stringify(config, null, 2), function(err) {
   if (err.code !== 0) {
      print('Error writing ' + configFile);
      print(err);
   }
});
*/

// ----------------------------------------------------------------------------

var checkError = function() {
  state.error = ela.getError();
  if (state.error) {
    print('*** Error: ' + state.error + ' ***');
  }
};

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
  error : 0,
  disconnected : true,
  address : null,
  nodeid : null,
  userid : null,
  quit : false,

  show : function() {
    print('address: ' + this.address);
    print('node id: ' + this.nodeid);
    print('user id: ' + this.userid);
    print();
  }
};

// ----------------------------------------------------------------------------

var cbIdle = function() {
  print('Idle');
};
//callbacks.setIdle(null);

var cbReady = function() {
  print('Connection ready.');
};
callbacks.setReady(cbReady);

var cbConnection = function(status) {
  print('Connection status: ' + status);
};
callbacks.setConnection(cbConnection);

var cbConnection = function(status) {
  print('Connection status: ' + status);
};
callbacks.setConnection(cbConnection);

var cbFriendList = function(res) {
  if (!res) {
    print('hey i got nothing!');
  } else if (!res.empty) {
    print('--- friend list ---');
    print(res.name + '(' + res.userid + ') status=' + res.status + ' presence=' + res.presence);
  }
};
callbacks.setFriendList(cbFriendList);

var cbFriendsIterate = function(res) {
  if (!res.empty) {
    print('--- friends -------');
    print(res.name + '(' + res.userid + ') status=' + res.status + ' presence=' + res.presence);
  }
};
callbacks.setFriendsIterate(cbFriendsIterate);

var cbFriendConnection = function(userid, status) {
  print('friend connected: ' + userid + ' ' + status);
};
callbacks.setFriendConnection(cbFriendConnection);

var cbFriendPresence = function(userid, status) {
  print('friend presence: ' + userid + ' ' + status);
};
callbacks.setFriendPresence(cbFriendPresence);

var cbFriendAdded = function(f) {
  print('friend added!');
  printFriend(f);
};
callbacks.setFriendAdded(cbFriendAdded);

var cbFriendRequest = function(f, userid, msg) {
  print('friend request! (' + userid + ') ' + msg);
  printFriend(f);
};
callbacks.setFriendRequest(cbFriendRequest);

var cbFriendRemoved = function(f, userid, msg) {
  print('friend removed! (' + userid + ') ' + msg);
  printFriend(f);
};
callbacks.setFriendRemoved(cbFriendRemoved);

var cbFriendInfo = function(f) {
  print('friend updated');
  printFriend(f);
};
callbacks.setFriendInfo(cbFriendInfo);

var cbFriendMsg = function(userid, msg) {
  print('msg: (' + userid + ') ' + msg);
};
callbacks.setFriendMessage(cbFriendMsg);

var cbFriendInvite = function(userid, data) {
  print('invite: (' + userid + ') ' + data);
};
callbacks.setFriendInvite(cbFriendInvite);

// ----------------------------------------------------------------------------
// do something

var cbPrompt = function(cmdline) {
  var tokens, self, cmd;
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
    state.quit = true;
    if (!threading) {
      ela.quit();
    }
  } else if (cmd === 'add') {
    ela.addFriend(tokens[0], tokens[1]);
  } else if (cmd === 'presence') {
    ela.setPresence(tokens[0]);
  } else if (cmd === 'geterror') {
    print('Error: ' + ela.getError());
  } else if (cmd === 'msg') {
    ela.msgFriend(tokens[0], tokens[1]);
  } else if (cmd === 'friends') {
    ela.getFriends();
  } else if (cmd === 'userinfo') {
    self = ela.getSelf();
    if (tokens.length === 0) {
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
  } else {
    try {
      eval(cmdline);
    } catch (e) {
      print(e);
    }
  }
};
callbacks.setPrompt(cbPrompt);

var rc = ela.init(sconfig);
if (!rc) {

  print('Failed to create carrier!');

} else {

  state.address = ela.getAddress();
  state.nodeid = ela.getNodeid();
  state.userid = ela.getUserid();
  state.error = ela.getError();
  state.show();

  var me = ela.getSelf();
  printUser(me);
  print();

  if (!threading) {
    prompt.readlineAsync();
  }

  ela.run();

  if (threading) {
    var cmdline = '';
    while (!state.quit) {
      ev.process();
      cmdline = prompt.readlineTimeout(10);
      if (cmdline !== '') {
        cbPrompt(cmdline);
      }
    }
  }
}