const express= require("express");
const router = express.Router()
const authControllers = require("../controllers/auth-controller");
const { authenticatToken } = require("../utilities");

router.route("/").get(authControllers.home);

router.route("/create-account").post(authControllers.createAccount);

router.route("/login").post(authControllers.login);

router.route("/get-user").get(authenticatToken, authControllers.getUser);

router.route("/add-note").post(authenticatToken, authControllers.addNote);

router.route("/edit-note/:noteId").put(authenticatToken, authControllers.editNote);

router.route("/get-all-notes/").get(authenticatToken, authControllers.getAllNotes);

router.route("/delete-note/:noteId").delete(authenticatToken, authControllers.deleteNotes);

router.route("/update-note-pinned/:noteId").put(authenticatToken, authControllers.updateNoteIsPinned);

router.route("/search-notes/").get(authenticatToken, authControllers.searchNotes)

module.exports = router;