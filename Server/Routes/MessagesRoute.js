import express from 'express';
import { addMessage, getMessages } from '../Controllers/MessagesController.js';

const router = express.Router();

router.post('/', addMessage);

router.get('/:chatId', getMessages)

export default router;