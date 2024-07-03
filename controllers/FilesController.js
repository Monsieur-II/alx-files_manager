const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const { saveFileToDisk } = require('../utils/helpers');

const FOLDER_PATH = process.env.FOLDER_PATH || '/Users/monsieur/files_manager';

class FileUploadRequest {
  constructor(name, type, data, parentId = 0, isPublic = false) {
    this.name = name;
    this.type = type;
    this.data = data;
    this.parentId = parentId;
    this.isPublic = isPublic;
  }

  static fromRequestBody(body) {
    const { name, type, data, parentId = 0, isPublic = false } = body;
    return new FileUploadRequest(name, type, data, parentId, isPublic);
  }
}

class FilesController {
  static async postUpload(req, res) {
    const request = FileUploadRequest.fromRequestBody(req.body);
    if (!request.name) {
      res.status(400).json({ error: 'Missing name' });
      res.end();
      return;
    }
    if (!['folder', 'file', 'image'].includes(request.type)) {
      res.status(400).json({ error: 'Missing type' });
      res.end();
      return;
    }

    if (!request.data && request.type !== 'folder') {
      res.status(400).json({ error: 'Missing data' });
      res.end();
      return;
    }

    if (request.parentId !== 0) {
      const file = await dbClient.getFileById(request.parentId);
      if (!file) {
        res.status(400).json({ error: 'Parent not found' });
        res.end();
        return;
      }

      if (file.type !== 'folder') {
        res.status(400).json({ error: 'Parent is not a folder' });
        res.end();
        return;
      }
    }

    const { user } = req;
    const fileDocument = {
      userId: user._id,
      name: request.name,
      type: request.type,
      parentId: request.parentId || 0,
      isPublic: request.isPublic || false,
    };

    if (request.type === 'folder') {
      const addedFolderResult = await dbClient.addFile(fileDocument);
      const addedFolder = addedFolderResult.ops[0];

      const id = `${addedFolderResult.insertedId}`;
      res.status(201).json({
        id,
        userId: addedFolder.userId,
        name: addedFolder.name,
        type: addedFolder.type,
        isPublic: addedFolder.isPublic,
        parentId: addedFolder.parentId,
      });
      res.end();
    }
    fileDocument.localPath = `${FOLDER_PATH}/${uuidv4()}`;
    // save file to disk
    const isSaved = saveFileToDisk(fileDocument.localPath, request.data);
    if (!isSaved) {
      res.status(500).json({ error: 'Cannot write to disk' });
      res.end();
      return;
    }

    const addFileResult = await dbClient.addFile(fileDocument);
    const addedFile = addFileResult.ops[0];
    const fileId = `${addFileResult.insertedId}`;
    res.status(201).json({
      id: fileId,
      userId: addedFile.userId,
      name: addedFile.name,
      type: addedFile.type,
      isPublic: addedFile.isPublic,
      parentId: addedFile.parentId,
    });
  }
}

module.exports = FilesController;
