import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export interface StorageProvider {
  upload(key: string, data: Buffer | Readable, mimeType: string): Promise<string>;
  download(key: string): Promise<Readable>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  getSize(key: string): Promise<number>;
}

// Ensure the private storage directory exists
const STORAGE_ROOT = path.join(__dirname, '../../storage/private');
if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true });
}

export class LocalStorageProvider implements StorageProvider {
  private getPath(key: string): string {
    // Basic path traversal protection
    const safeKey = key.replace(/(\.\.[\/\\])+/g, '');
    return path.join(STORAGE_ROOT, safeKey);
  }

  async upload(key: string, data: Buffer | Readable, mimeType: string): Promise<string> {
    const filePath = this.getPath(key);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (Buffer.isBuffer(data)) {
      await fs.promises.writeFile(filePath, data);
    } else {
      const writeStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        data.pipe(writeStream)
          .on('finish', resolve)
          .on('error', reject);
      });
    }

    return key;
  }

  async download(key: string): Promise<Readable> {
    const filePath = this.getPath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    return fs.createReadStream(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getPath(key);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  async exists(key: string): Promise<boolean> {
    return fs.existsSync(this.getPath(key));
  }

  async getSize(key: string): Promise<number> {
    const filePath = this.getPath(key);
    if (!fs.existsSync(filePath)) {
      return 0;
    }
    const stat = await fs.promises.stat(filePath);
    return stat.size;
  }
}

// Use LocalStorageProvider for now. In a production app, we would inject based on env var:
// const provider = process.env.STORAGE_PROVIDER === 's3' ? new S3StorageProvider() : new LocalStorageProvider();
export const storageService: StorageProvider = new LocalStorageProvider();
