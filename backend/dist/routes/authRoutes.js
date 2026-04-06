"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// /api/auth/register (Utilisé typiquement pour créer le premier admin ou par un admin déjà connecté)
// @ts-ignore
router.post('/register', authController_1.register);
// /api/auth/login
// @ts-ignore
router.post('/login', authController_1.login);
exports.default = router;
