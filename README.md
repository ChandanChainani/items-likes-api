1) Create a web application using framework and connect with mongoDB
- I have used yarn for managing dependency
- application is created using express framework and mongoose library to connect to mongo database

2) Create one model to store the list of item with basic details like title, description etc.
and build the up voting and down voting features
Ex: https://hoblist.com/list/vinay/people/best-bollywood-actors
- the app uses 2 collection
- items
- votes

3) Allow the one up voting / down voting for one request from the browser, and restrict
for the above one
- voting is restrict through session, where each user can up or down vote per session
- request include session cookie, item_id for which user want to up or down vote, and vote true/false

### Without session request using curl
- curl -X POST http://localhost:8000/items/vote -H "Content-Type: application/json" -d '{"vote":false, "item_id": "60dc1aac26188a41d6cf5a0c" }'

### With session request using curl
- curl -X POST http://localhost:8000/items/vote -H "Cookie: connect.sid=s%3A4h1nAy1DTXPEN_osz1teCmwq5_8j_WI0.AU7gU%2B3DwxB%2FbIrYIoXEvLzuIY0Z%2FmYwO6Dc6cCZY0I; Path=/; Expires=Wed, 30 Jun 2021 09:14:22 GMT; HttpOnly" -H "Content-Type: application/json" -d '{"vote":false, "item_id": "60dc1aac26188a41d6cf5a0c" }'

4) Create one api to list all item with voting.
  - curl -s http://localhost:8000/items | python -m json.tool
