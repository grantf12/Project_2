const db = require("../models");
const { Op } = require("sequelize");
const passport = require("../config/passport");

module.exports = function(app, selectedCharacter) {
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });
  // app.get("/logout", (req, res) => {
  //   req.logout();
  //   res.redirect("/");
  // });
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        if: req.user.id
      });
    }
  });
  app.post("/api/select/character/:name", (req, res) => {
    db.Character.findOne({ where: { name: req.params.name } }).then(playable => {
        db.Character.findAll({
          where: { [Op.not]: [{ name: req.params.name }] }
        }).then(restOfCharacters => {
          selectedCharacter[0] = playable;
          selectedCharacter[1] =
            restOfCharacters[
              Math.floor(Math.random() * restOfCharacters.length)
            ];
          console.log(selectedCharacter);
        });
      }
    );
  });
};
