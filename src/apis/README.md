vote_monitor APi
-----------------
### 调用格式
```sh
curl 127.0.0.1:port/api/apiname
```

### voter

获取投票人和其信息

```sh
curl 127.0.0.1:port/api/voter | json_pp
```

返回信息：
```json
{
   "result" : [
      {
         "lastchangeTxid" : "7eeff0afa395ce6349f6753a16d7c7f18801e327",
         "changeTimes" : 4,
         "updatedAt" : "2021-09-29T08:29:59.000Z",
         "voteGXCNumber" : 7642,
         "voteGXCNumberHourly" : 7642,
         "votingstate" : false,
         "userId" : "1.2.22",
         "userName" : "dev",
         "createdAt" : "2021-09-28T02:48:52.000Z"
      }
   ],
   "resultTrue" : [],
   "resultFalse" : [
      {
         "voteGXCNumberHourly" : 7642,
         "voteGXCNumber" : 7642,
         "lastchangeTxid" : "7eeff0afa395ce6349f6753a16d7c7f18801e327",
         "changeTimes" : 4,
         "updatedAt" : "2021-09-29T08:29:59.000Z",
         "userId" : "1.2.22",
         "votingstate" : false,
         "userName" : "dev",
         "createdAt" : "2021-09-28T02:48:52.000Z"
      }
   ]
}
```
- result:所有投票人的信息
- resultTrue:所有投True人的信息
- resultFalse：所有投False人的信息
  
--------------
- voteGXCNumberHourly:实时投票数，每小时更新一次
- voteGXCNumber: 投票数（快照读取后才有）
- lastchangeTxid: 上一次更改投票交易Txid
- changeTimes: 更改次数(前后两次一样算无更改)
- userId : 账户ID
- userName : 账户名字
- votingstate : 投票状态

### statistics（快照读取后才调用）
```sh 
curl 127.0.0.1:port/api/statistics | json_pp
```

返回信息:
```json
{
   "statistics" : {
      "totalVoteGXCNumberTrue" : 0,
      "createdAt" : "2021-09-29T08:29:59.000Z",
      "voteUserNumberTrue" : 0,
      "totalVoteGXCNumber" : 0,
      "id" : 1,
      "updatedAt" : "2021-09-29T08:29:59.000Z",
      "voteUserNumber" : 1,
      "voteUserNumberFalse" : 1,
      "totalVoteGXCNumberFalse" : 7642
   }
}
```

- voteUserNumber : 投票总人数
- voteUserNumberTrue : 投True总人数
- voteUserNumberFalse : 投False总人数
- totalVoteGXCNumber : 投票总数
- totalVoteGXCNumberTrue : 投True总票数
- totalVoteGXCNumberFalse : 投False总票数

### date
```sh
curl 127.0.0.1:port/api/date | json_pp
```

返回信息:```json
{
   "stopTime" : "2021-11-15T14:11:27.000Z",
   "startTime" : "2021-09-16T18:52:57.000Z"
}

- stopTime :截止时间
- startTime :开始时间
```