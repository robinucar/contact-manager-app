const express = require('express');
const router = express.Router();

//@route     GET   api/contact
//@desc      Get all users contacts
//access     Private
router.get('/', (req, res) => {
  res.send('Get all contacts')
});

//@route     POST   api/contact
//@desc      Add new contact
//access     Private
router.post('/', (req, res) => {
  res.send('Add contact')
});

//@route     PUT   api/contact
//@desc      Update contacts
//access     Private
router.put('/:id', (req, res) => {
  res.send('Update contact')
});

//@route     DELETE   api/contact
//@desc      Delete contact
//access     Private
router.delete('/:id', (req, res) => {
  res.send('Delete contact')
});



module.exports=router;