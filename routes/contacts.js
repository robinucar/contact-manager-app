const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

//@route     GET   api/contact
//@desc      Get all users contacts
//access     Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).send("Server Error...");
  }
});

//@route     POST   api/contact
//@desc      Add new contact
//access     Private
router.post(
  "/",
  [auth, [check("name", "Name is required...").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        surname,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route     PUT   api/contact
//@desc      Update contacts
//access     Private
router.put("/:id", auth, async (req, res) => {
  const { name, surname, email, phone, type } = req.body;

  //build a contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (surname) contactFields.surname = surname;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not Found..." });

    //Make sure user pwns contact first
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized... " });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route     DELETE   api/contact
//@desc      Delete contact
//access     Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not Found..." });

    //Make sure user pwns contact first
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized... " });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact Removed..." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
