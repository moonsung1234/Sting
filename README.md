
# Sting (Game Website)

-----

<br/>

```http://m.moonsung.o-r.kr```

<br/>

## String Game

Sting(찌르기) 에 맞는 1 vs 1 fighting 컨셉의 게임입니다. <br/>
펜싱에서 영감을 얻어 비슷한 컨셉으로 만들어보았습니다.

<br/>

-----

## MIT LICENSE

소스코드 혹은 이외의 파일을 수정, 삭제 할 수 있으며 <br/>
실무 혹은 상업적으로 사용이 가능합니다. <br/>
<br/>
그러나, 관련 소프트웨어에 대해 아무런 책임을 지지 않습니다.

<br/>

-----
## Guide

```shell
node app.js
```

위의 커맨드를 Sting 폴더 내의 shell 에서 입력하시면 <br/>
서버를 실행시킬 수 있습니다.
<br/><br/>

#### 추가해야할 몇가지 파일들

<br/>

```javascript
// config.json

"development": {
  "username": "root",
  "password": "your database password",
  "database": "Sting",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

<br/>

위의 json 코드를 config 폴더 안에 config.json 파일을 만든 후 작성

<br/><br/>

```env
COOKIE_KEY = your cookie key
```

<br/>

위의 내용을 app.js 파일과 같은 위치에 .env 파일을 만든 후 작성

<br/>
<br/>

### 주의

- 서버를 실행하려면 Node.js MySQL 이 컴퓨터에 깔려있어야 합니다.

-----