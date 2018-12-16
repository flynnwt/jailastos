#include "jailastos.h"

using namespace std;

/********************************************************
 * callback proxies from elacarrier to mine
********************************************************/

void cbIdle(ElaCarrier *w, void *context) {
  callbacks->callIdle();
}

void cbConnection(ElaCarrier *w, ElaConnectionStatus status, void *context) {
  string res = stringConnection(status);
  callbacks->callConnection(res);
}

void cbReady(ElaCarrier *w, void *context) {
  callbacks->callReady();
}

bool cbFriendList(ElaCarrier *w, const ElaFriendInfo *f, void *context) {
  // can return null - return empty one if it does...
  if (f) {
    callbacks->callFriendList(FriendInfo(f));
  } else {
    callbacks->callFriendList(FriendInfo());
  }
  return true;
}

bool cbFriendsIterate(const ElaFriendInfo *f, void *context) {
  // can return null - return empty one if it does...
  if (f) {
    callbacks->callFriendsIterate(FriendInfo(f));
  } else {
    callbacks->callFriendsIterate(FriendInfo());
  }
  return true;
}

void cbFriendConnection(ElaCarrier *w, const char *userid, ElaConnectionStatus s, void *context) {
  string status = stringConnection(s);
  callbacks->callFriendConnection(string(userid), status);
}

void cbFriendPresence(ElaCarrier *w, const char *userid, ElaPresenceStatus s, void *context) {
  string status = stringPresence(s);
  callbacks->callFriendPresence(string(userid), status);
}

void cbFriendAdded(ElaCarrier *w, const ElaFriendInfo *f, void *context) {
  callbacks->callFriendAdded(FriendInfo(f));
}

void cbFriendRequest(ElaCarrier *w, const char *userid, const ElaUserInfo *u, const char *msg, void *context) {
  callbacks->callFriendRequest(UserInfo(u), userid, msg);
}

// probs ela mistake - should be char *msg
void cbFriendMessage(ElaCarrier *w, const char *userid, const void *msg, size_t len, void *context) {
  callbacks->callFriendMessage(string(userid), string((char *)msg));
}

void cbFriendInfo(ElaCarrier *w, const char *userid, const ElaFriendInfo *f, void *context) {
  callbacks->callFriendInfo(FriendInfo(f));
}

void cbFriendRemoved(ElaCarrier *w, const char *userid, void *context) {
  callbacks->callFriendRemoved(string(userid));
}

// would really need to send data as binary with length to process arbitrary data (char array for js)
void cbFriendInvite(ElaCarrier *w, const char *userid, const char *bundle, const void *data, size_t len, void *context) {
  callbacks->callFriendInvite(string(userid), string((char *)data));
}

void cbSelfInfo(ElaCarrier *w, const ElaUserInfo *u, void *context) {
  callbacks->callSelfInfo(UserInfo(u));
}

/********************************************************
 * sigint handlers
********************************************************/

void signal_handler(int signum) {
  cout << "Caught SIG...ending..." << endl;
  ela->quit();
  exit(-1);
}

void signal_handler_quit(int signum) {
  ela->quit();
  exit(0);
}

/********************************************************
 * do something
********************************************************/

int main(int argc, char *argv[]) {

  string fname = "jailastos.js";
  string script;

  signal(SIGINT, signal_handler);
  signal(SIGTERM, signal_handler_quit);
  signal(SIGSEGV, signal_handler);
#if !defined(_WIN32) && !defined(_WIN64)
  signal(SIGKILL, signal_handler);
  signal(SIGHUP, signal_handler);
#endif

  cout << "Initializing..." << endl;

  // shared classes
  duktape.registerClass<Result>();
  duktape.registerClass<Node>();
  duktape.registerClass<ShellConfig>();
  duktape.registerClass<UserInfo>();
  duktape.registerClass<FriendInfo>();

  // shared objects
  duktape.addGlobal("common", common);
  duktape.addGlobal("resultFriendInfo", resultFriendInfo);
  duktape.addGlobal("resultUserInfo", resultUserInfo);
  duktape.addGlobal("callbacks", callbacks);
  duktape.addGlobal("ela", ela);
  duktape.addGlobal("prompt", prompt);
  duktape.addGlobal("ev", evLoop);

  // set my proxy callbacks - js can set them to its funcs
  memset(&ela->elaCallbacks, 0, sizeof(ela->elaCallbacks));
  ela->elaCallbacks.idle = cbIdle;
  ela->elaCallbacks.connection_status = cbConnection;
  ela->elaCallbacks.ready = cbReady;
  ela->elaCallbacks.friend_list = cbFriendList;
  ela->elaCallbacks.friend_connection = cbFriendConnection;
  ela->elaCallbacks.friend_added = cbFriendAdded;
  ela->elaCallbacks.friend_presence = cbFriendPresence;
  ela->elaCallbacks.friend_message = cbFriendMessage;
  ela->elaCallbacks.friend_request = cbFriendRequest;
  ela->elaCallbacks.self_info = cbSelfInfo;
  ela->elaCallbacks.friend_info = cbFriendInfo;
  ela->elaCallbacks.friend_removed = cbFriendRemoved;
  ela->elaCallbacks.friend_invite = cbFriendInvite;

  ela->cbFriendsIterate = cbFriendsIterate; // for iterator

  prompt->callbacks = callbacks; // for prompt

  cout << "Executing " << fname << "..." << endl;

  // read script
  ifstream ifs(fname);
  script.assign((std::istreambuf_iterator<char>(ifs)), (std::istreambuf_iterator<char>()));

  evalCmd(script);

  cout << "javascript complete.  Terminating..." << endl;
  raise(SIGTERM);
}
