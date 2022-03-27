const Database = require('../db/config');

module.exports = {
  //create a new room
  async create(req, res) {
    const db = await Database();
    const pass = req.body.password;

    let roomId;
    let isRoom = true;

    while (isRoom) {
      //randomly generate a room-id
      for (let i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString());
      }

      // check if the room-id already exist
      const roomExistIds = await db.all(`SELECT id FROM rooms`);
      isRoom = roomExistIds.some(roomExistId => roomExistId === roomId);

      if (!isRoom) {
        // insert the data into database
        await db.run(`
        INSERT INTO rooms (id, pass)
        VALUES (${parseInt(roomId)}, ${pass})
      `);
      }
    }

    db.close();

    res.redirect(`/room/${roomId}`);
  },

  // check the questions in that room and show them as the actions specify (readed to delete / non-read to delete )
  async open(req, res) {
    const db = await Database();

    const roomId = req.params.room;
    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    );
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 1`
    );

    //check if there is questions in that room
    let isNoQuestions;

    if (questions.length == 0) {
      if (questionsRead == 0) {
        isNoQuestions = true;
      }
    }

    res.render('room', {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead,
      isNoQuestions: isNoQuestions,
    });
  },

  // enter a room that already exist
  enter(req, res) {
    const roomId = req.body.roomId;

    res.redirect(`/room/${roomId}`);
  },
};
