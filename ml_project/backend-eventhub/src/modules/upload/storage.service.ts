import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import AWS from 'aws-sdk';
import { config } from '../../config/env';
import { logger } from '../../config/logger';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

/**
 * Storage Service Interface
 */
export interface IStorageService {
  upload(file: Express.Multer.File, folder: string): Promise<string>;
  delete(url: string): Promise<void>;
}

/**
 * Local Storage Service
 */
class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.storage.local.uploadDir;
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      logger.error({ error }, 'Failed to create upload directory');
    }
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const folderPath = path.join(this.uploadDir, folder);
      await mkdir(folderPath, { recursive: true });

      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(folderPath, filename);

      await writeFile(filepath, file.buffer);

      // Return relative URL
      const url = `/${folder}/${filename}`;
      logger.info({ url }, 'File uploaded to local storage');

      return url;
    } catch (error) {
      logger.error({ error }, 'Local upload failed');
      throw new Error('File upload failed');
    }
  }

  async delete(url: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, url);
      await promisify(fs.unlink)(filepath);
      logger.info({ url }, 'File deleted from local storage');
    } catch (error) {
      logger.error({ error, url }, 'Failed to delete file from local storage');
    }
  }
}

/**
 * S3 Storage Service
 */
class S3StorageService implements IStorageService {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: config.storage.s3.accessKey,
      secretAccessKey: config.storage.s3.secretKey,
      region: config.storage.s3.region,
    });
    this.bucket = config.storage.s3.bucket || 'eventhub-uploads';
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const filename = `${folder}/${Date.now()}-${file.originalname}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      const result = await this.s3.upload(params).promise();
      logger.info({ url: result.Location }, 'File uploaded to S3');

      return result.Location;
    } catch (error) {
      logger.error({ error }, 'S3 upload failed');
      throw new Error('File upload failed');
    }
  }

  async delete(url: string): Promise<void> {
    try {
      const key = url.split('.com/')[1]; // Extract key from URL

      await this.s3
        .deleteObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();

      logger.info({ url }, 'File deleted from S3');
    } catch (error) {
      logger.error({ error, url }, 'Failed to delete file from S3');
    }
  }
}

/**
 * Storage Service Factory
 */
export class StorageService {
  private static instance: IStorageService;

  static getInstance(): IStorageService {
    if (!StorageService.instance) {
      if (config.storage.driver === 's3') {
        StorageService.instance = new S3StorageService();
      } else {
        StorageService.instance = new LocalStorageService();
      }
    }
    return StorageService.instance;
  }
}
