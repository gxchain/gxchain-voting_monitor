vote_monitor APi
-----------------
### 调用格式
```sh
curl 127.0.0.1:port/api/apiname
```

### findone
获取一个投票人的信息

```sh
 curl -s "127.0.0.1:3031/api/findone?name=dev"| json_pp
```

返回的信息

```json
{
   "updatedAt" : "2021-11-16T03:48:36.000Z",
   "changeTimes" : 1,
   "createdAt" : "2021-11-05T07:00:02.000Z",
   "userName" : "dev",
   "lastchangeTxid" : "d11634a208e72f6796e8bcea96584c1984a53a37",
   "voteGXCNumber" : 0,
   "voteGXCNumberHourly" : 3345505497809,
   "userId" : "1.2.22",
   "votingstate" : true
}

```

### voter

获取投票人和其信息

```sh
 curl "127.0.0.1:3031/api/voter?limit=1&offset=1" | json_pp
```

返回信息：
```json
{
   "resultsSum" : 2,
   "result" : [
      {
         "updatedAt" : "2021-11-15T10:43:47.000Z",
         "userName" : "gxc-relay",
         "voteGXCNumber" : 0,
         "voteGXCNumberHourly" : 24067506,
         "userId" : "1.2.4707",
         "createdAt" : "2021-11-05T07:09:14.000Z",
         "changeTimes" : 0,
         "lastchangeTxid" : "cc545fea87bee0361bf91056a0b8a80b3ea26ab9",
         "votingstate" : true
      }
   ]
}
```
- resultsSum:共有几条记录
- result:返回的记录
--------------
- voteGXCNumberHourly:实时投票数，每小时更新一次
- voteGXCNumber: 投票数（快照读取后才有）
- lastchangeTxid: 上一次更改投票交易Txid
- changeTimes: 更改次数(前后两次一样算无更改)
- userId : 账户ID
- userName : 账户名字
- votingstate : 投票状态


### voter_sum
获取投票总和

```sh 
curl 127.0.0.1:port/api/voter_sum | json_pp
```
返回信息:
```json
{
   "voterGXCTrueSum" : 3345529565315,
   "voterGXCFalseSum" : null,
   "voterGXCSum" : 3345529565315,
   "voterNum" : 2,
   "voterFalseNum" : 0,
   "voterTrueNum" : 2
}
```
- voterNum: 投票总人数
- voterTrueNum:投true的总人数
- voterFalseNum:投false的总人数
- voterGXCSum: 投票总gxc数
- voterGXCTrueSum:投票true总gxc数
- voterGXCFalseSum:投票false总gxc数



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