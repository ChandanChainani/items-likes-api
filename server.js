const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const { ItemModel, VoteModel } = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'secret',
  cookie: { maxAge: 60 * 60 * 24 }
}));
app.use(morgan('tiny'));
const port = 8000;

app.get('/items', async (req, res) => {
  // let data = await ItemModel.find({});
  let data = await ItemModel.aggregate([
    {
      // $lookup: {
      //   from: "votes",
      //   localField: "_id",
      //   foreignField: "item_id",
      //   as: "votes",
      // }
      $lookup: {
        "from": "votes",
        "let": { "item_id": "$_id" },
        "pipeline": [
          {
            "$match": {
              "$expr": { "$eq": [ "$item_id", "$$item_id" ] },
            }
          }
        ],
        "as": "votes"
      }
    },
    {
      '$project': {
        "votes": 1,
        'likes' : {
          $reduce: {
            input: "$votes",
            initialValue: 0,
            in: {
              $add: [ "$$value", { $cond: ["$$this.vote", 1, 0] }]
            },
            // '$cond': [{ $and: [{ "$size": "$votes"}, { "$eq": ["$votes.vote", true] }]}, 1, 0]
          }
        },
        dislikes: {
          $reduce: {
            input: "$votes",
            initialValue: 0,
            in: {
              $add: [ "$$value", { $cond: ["$$this.vote", 0, 1] }]
            },
            // '$cond': [{ $and: [{ "$size": "$votes"}, { "$eq": ["$votes.vote", true] }]}, 1, 0]
          }
          // $sum: {
          //   '$cond': [{ $and: [{ "$size": "$votes"}]}, 1, 0]
          // }
          // '$sum': {
          //   '$cond': [{'$eq': ['$votes.vote', 0]}, 1, 0]
          // }
        }
        // 'dislikes'   : {
        //   '$sum': {
        //     '$cond': [{ $and: [{
        //       $gt: [{ $size: "$votes"}, 0]
        //     }, [{ $eq: ["$votes.vote", 0] }]] }, 0, 1]
        //   }
        // },
      }
    },
    {
      $project: {
        'votes': 1,
        'likes': 1,
        'dislikes': 1,
      }
    }
  ]);
  res.send(data);
})

app.post('/items/vote', async (req, res) => {
  let status = { "status": "Success" };

  try {
    const query = { session_id: req.sessionID };
    const update = { $set: { session_id: req.sessionID, item_id: req.body.item_id, vote: req.body.vote }};
    const options = { upsert: true, runValidators: true };

    await VoteModel.updateOne(query, update, options);
  }
  catch (err) {
    console.log(err);
    if (err && err.errors) {
      status = { errors: Object.keys(err.errors).map(e => err.errors[e].message) };
    }
    else if (err.message) {
      status = { error: err.message };
    }
  }

  res.send(status);
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
