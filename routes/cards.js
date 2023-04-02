const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const {
  Card,
  validateCard,
  generateBusinessNumber,
  validateParamsId,
} = require("../model/cards");

router.post("/", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
    bizNumber: await generateBusinessNumber(),
    user_id: req.user._id,
  }).save();

  res.send(card);
});

router.put("/:id", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await Card.findOneAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body,
    { new: true }
  );

  if (!card) {
    res.status(404).send("the card with the given ID can not be found");
    return;
  }
  res.send(card);
});

router.delete("/:id", authMW, async (req, res) => {
  const { error } = validateParamsId(req.params);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await Card.findOneAndReplace({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("the card with the given ID can not be found");
    return;
  }
  res.send(card);
});

router.get("/:id", authMW, async (req, res) => {
  const { error } = validateParamsId(req.params);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("the card with the given ID can not be found");
    return;
  }
  res.send(card);
});

module.exports = router;
