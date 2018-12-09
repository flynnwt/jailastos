# jailastos
### Javascript for Elastos Carrier 

Uses duktape and carrier native SDK.  

Carrier can now run on main thread or separate thread.


<pre>
<b>wtf@ubuntu:~/shares/Shared/projects/jailastos/src/jailastos$ jailastos</b>
Registering jailastos interfaces.
Initializing...
Executing jailastos.js...
 {udpEnabled:true,logLevel:4,logFile:"jailastos.log",dataDir:"./data",bootstraps:[{ipv4:"13.58.208.50",ipv6:"",port:"33445",publicKey:"89vny8MrKdDKs7Uta9RdVmspPjnRMdwMmaiEW27pZ7gh"},{ipv4:"18.216.102.47",ipv6:"",port:"33445",publicKey:"G5z8MqiNDFTadFUPfMdYsYtkUDbX5mNCMVHMZtsCnFeb"},{ipv4:"18.216.6.197",ipv6:"",port:"33445",publicKey:"H8sqhRrQuJZ6iLtP2wanxt4LzdNrN2NNFnpPdq1uJ9n2"},{ipv4:"52.83.171.135",ipv6:"",port:"33445",publicKey:"5tuHgK1Q4CYf4K5PutsEPK5E3Z7cbtEBdx7LwmdzqXHL"},{ipv4:"52.83.191.228",ipv6:"",port:"33445",publicKey:"3khtxZo89SBScAMaHhTvD68pPHiKxgZT6hTCSZZVgNEm"}]}


opts->persistent_location: ./data
opts->udp_enabled: 1
opts->bootstraps_size: 5
sizeof(opts): 8
sizeof(*opts): 32
sizeof(opts->persistent_location): 8
2018-12-09 14:57:13 - INFO    : Carrier: Carrier node created.
 address: ShsVZN111111111111111111111111111111111111
 node id: ChJcAm222222222222222222222222222222222
 user id: ChJcAm222222222222222222222222222222222

           User Info
             name: wtf-jailastos (ChJcAm222222222222222222222222222222222)
            phone:   email:   region: US
           gender: Texas Hippie Coalition  desc: Mouth of Cemetery Gates

Running carrier in separate thread...
 --- friend list ---
 felicity-windoze(3333333333333333333333L1GuNtGkPAFFPk6TEoR7) status=disconnected presence=none
 --- friend list ---
 (44444444444444444444444444444hRGL) status=disconnected presence=none
 Connection ready.
 Connection status: connected
 friend connected: 44444444444444444444444444444hRGL connected
 friend updated
           Friend Info
           User Info
             name: wtf-chai (44444444444444444444444444444hRGL)
            phone:   email:   region: USA
           gender: metal  desc: chailastos testing
           connected  none  label: 
 friend connected: 3333333333333333333333L1GuNtGkPAFFPk6TEoR7 connected
 friend updated
           Friend Info
           User Info
             name: felicity-windoze (3333333333333333333333L1GuNtGkPAFFPk6TEoR7)
            phone: 8675309  email:   region: USA
           gender: strangiato  desc: you can start by buying me a drink
           connected  none  label: 
 msg: (3333333333333333333333L1GuNtGkPAFFPk6TEoR7) very well by reputation
<b>userinfo</b>
           User Info
             name: wtf-jailastos (ChJcAm222222222222222222222222222222222)
            phone:   email:   region: US
           gender: Texas Hippie Coalition  desc: Mouth of Cemetery Gates
 friend presence: 3333333333333333333333L1GuNtGkPAFFPk6TEoR7 away
 friend presence: 3333333333333333333333L1GuNtGkPAFFPk6TEoR7 none

</pre>
