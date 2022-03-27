const Database = require('../db/config');

module.exports = {
  // create a new question in the room specifyed
  async create(req, res) {
    const db = await Database();

    const question = req.body.question;
    const roomId = req.params.room;

    await db.run(`INSERT INTO questions(
      title,
      room,
      read
    )VALUES(
      "${question}",
      ${roomId},
      0
    )`);

    res.redirect(`/room/${roomId}`);
  },

  async index(req, res) {
    const db = await Database();

    const roomId = req.params.room;
    const questionId = req.params.question;
    const action = req.params.action;
    const password = req.body.password;

    // check if the password right to update the action, otherwise show an error alert
    const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`);
    if (verifyRoom.pass == password) {
      if (action == 'delete') {
        await db.run(`DELETE FROM questions WHERE id = ${questionId}`);
      } else if (action == 'check') {
        await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`);
      }

      res.redirect(`/room/${roomId}`);
    } else {
      res.render('passincorrect', { roomId: roomId });
    }
  },
};
