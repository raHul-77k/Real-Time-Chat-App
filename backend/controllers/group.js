const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const User = require('../models/User');

exports.createGroup = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const group = await Group.create({ name, description });
        res.status(201).json({ group });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addUserToGroup = async (req, res, next) => {
    const { name, groupId } = req.body;
    try {
        const group = await Group.findByPk(groupId);
        const user = await User.findByPk(name);
        await group.addUser(user);
        res.status(200).json({ message: 'User added to group' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendGroupMessage = async (req, res, next) => {
    const { userId, groupId, message } = req.body;
    try {
        const groupMessage = await GroupMessage.create({ userId, groupId, message });
        res.status(201).json({ groupMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllGroups = async (req, res, next) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json( groups );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGroupMessages = async (req, res, next) => {
    const { groupId } = req.params;
    try {
        const messages = await GroupMessage.findAll({ where: { groupId } });
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
