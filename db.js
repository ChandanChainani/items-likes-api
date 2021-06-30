const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to Database!!!');
});

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"]
  },
  description: {
    type: String,
    required: [true, "description is required"]
  }
}, {
  versionKey: false,
});

const voteSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "item_id is required"]
  },
  session_id: {
    type: String,
    required: [true, "session_id is required"]
  },
  vote: {
    type: Boolean,
    required: [true, "vote is required"]
  },
}, {
  versionKey: false,
});

const ItemModel = mongoose.model('Item', itemSchema);
const VoteModel = mongoose.model('Vote', voteSchema);

module.exports = db;
module.exports.ItemModel = ItemModel;
module.exports.VoteModel = VoteModel;
