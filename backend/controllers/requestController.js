const requestModel = require('../models/requestModel');

exports.createRequest = async (req, res) => {
    try {
        const data = {
            ...req.body,
            image_path: req.file?.path || null
        };
        const newRequest = await requestModel.create(data);
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await requestModel.getAll();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await requestModel.getById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const updated = await requestModel.updateStatus(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        await requestModel.delete(req.params.id);
        res.json({ message: 'Request deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
