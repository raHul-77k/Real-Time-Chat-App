const Chat = require('../models/Chat');
const User = require('../models/User');
const { Op } = require('sequelize');

const chatController = {
    sendMessage: async (req, res) => {
        try {
            const { message } = req.body;
            const userId = req.user.id;

            console.log('userId>>>>>>>', userId);

            const newChat = await Chat.create({ userId, message });

            res.status(201).json(newChat);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Error sending message' });
        }
    },

    getMessages: async (req, res) => {
        try {
            const chats = await Chat.findAll({
                include: [{ model: User, attributes: ['name'] }],
                order: [['createdAt', 'ASC']]
            });

            res.status(200).json(chats);
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({ error: 'Error retrieving messages' });
        }
    },

    // New method to fetch messages since a specific timestamp
    getMessagesSince: async (req, res) => {
        const timestamp = new Date(parseInt(req.params.timestamp));
        try {
            const newMessages = await Chat.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: timestamp
                    }
                },
                include: [{ model: User, attributes: ['name'] }],
                order: [['createdAt', 'ASC']]
            });
            res.status(200).json(newMessages);
        } catch (error) {
            console.error('Error fetching new messages:', error);
            res.status(500).json({ message: 'Error fetching new messages' });
        }
    }
};

module.exports = chatController;
