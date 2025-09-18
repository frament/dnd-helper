import { Injectable } from '@angular/core';
import * as Minio from 'minio';

export interface FileObject {
  name: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
  url?: string;
}

export interface BucketItem {
  name: string;
  creationDate: Date;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class MinioService {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: window.location.origin,
      port: 9000,
      useSSL: false,
      accessKey: 'ROOTNAME',
      secretKey: 'CHANGEME123',
      region: 'us-east-1'
    });
  }

  /**
   * Проверка существования бакета
   */
  bucketExists(bucketName: string): Promise<boolean> {
    return this.minioClient.bucketExists(bucketName);
  }

  /**
   * Создание бакета
   */
  async createBucket(bucketName: string): Promise<void> {
    await this.minioClient.makeBucket(bucketName);
  }

  /**
   * Удаление бакета
   */
  async deleteBucket(bucketName: string): Promise<void> {
    await this.minioClient.removeBucket(bucketName)
  }

  /**
   * Получение списка бакетов
   */
  async listBuckets(): Promise<BucketItem[]> {
    return (await this.minioClient.listBuckets()).map(bucket => ({
      name: bucket.name,
      creationDate: bucket.creationDate
    }));
  }

  /**
   * Загрузка файла в MinIO
   */
  uploadFile(
    bucketName: string,
    file: File,
    objectName?: string,
    options?: UploadOptions
  ): Promise<string> {
    const fileName = objectName || file.name;
    const contentType = options?.contentType || file.type || 'application/octet-stream';

    return new Promise<string>(async (resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const buffer = fileReader.result as ArrayBuffer;

        const {etag} = await this.minioClient.putObject(
          bucketName,
          fileName,
          Buffer.from(buffer),
          buffer.byteLength,
          {
            'Content-Type': contentType,
            ...options?.metadata
          }
        )
        resolve(etag);
      };

      fileReader.onerror = error => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
  }

  /**
   * Потоковая загрузка файла
   */
  uploadFileStream(
    bucketName: string,
    file: File,
    objectName?: string,
    options?: UploadOptions
  ): Promise<string> {
    const fileName = objectName || file.name;
    const contentType = options?.contentType || file.type || 'application/octet-stream';

    return new Promise<string>(async (resolve, reject) => {
      const stream = file.stream();
      const reader = stream.getReader();
      let buffer = new Uint8Array();

      const readChunk = async () => {
        const {value, done} = await reader.read();
        if (done) {
          // Завершение чтения, отправляем данные в MinIO
          const {etag} = await this.minioClient.putObject(
            bucketName,
            fileName,
            Buffer.from(buffer),
            buffer.length,
            {'Content-Type': contentType, ...options?.metadata}
          );
          resolve(etag);
        }
        if (!value) { await readChunk(); return }
        // Добавляем данные в буфер
        const newBuffer = new Uint8Array(buffer.length + value!.length);
        newBuffer.set(buffer);
        newBuffer.set(value!, buffer.length);
        buffer = newBuffer;
        await readChunk();
      }
      await readChunk();
    });
  }

  /**
   * Получение списка файлов в бакете
   */
  async listFiles(bucketName: string, prefix?: string, recursive: boolean = true): Promise<FileObject[]> {
    return new Promise<FileObject[]>((resolve, reject) => {
      const objects: FileObject[] = [];
      const stream = this.minioClient.listObjects(bucketName, prefix, recursive);

      stream.on('data', async (obj) => {
        if (obj.name && obj.size !== undefined) {
          objects.push({
            name: obj.name,
            size: obj.size,
            lastModified: obj.lastModified!,
            etag: obj.etag!,
            url: await this.getPresignedUrl(bucketName, obj.name)
          });
        }
      });

      stream.on('error', (error) => reject(error));
      stream.on('end', () => resolve(objects));
    });
  }

  /**
   * Получение presigned URL для доступа к файлу
   */
  getPresignedUrl(bucketName: string, objectName: string, expires: number = 86400): Promise<string> {
    return this.minioClient.presignedGetObject(bucketName, objectName, expires);
  }

  /**
   * Получение presigned URL для загрузки файла
   */
  getPresignedPutUrl(bucketName: string, objectName: string, expires: number = 3600): Promise<string> {
    return this.minioClient.presignedPutObject(bucketName, objectName, expires);
  }

  /**
   * Скачивание файла как Blob
   */
  async downloadFile(bucketName: string, objectName: string): Promise<Blob> {
    const stream = await this.minioClient.getObject(bucketName, objectName);

    return new Promise<Blob>(async (resolve, reject) => {
      const dataStream = await this.minioClient.getObject(bucketName, objectName);
      const chunks: Buffer[] = [];
      dataStream.on('data', (chunk:any) => chunks.push(chunk));
      dataStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer]);
        resolve(blob);
      });
      dataStream.on('error', (err:any) => reject(err));
    });
  }

  /**
   * Скачивание файла как ArrayBuffer
   */
  async downloadFileAsBuffer(bucketName: string, objectName: string): Promise<ArrayBuffer> {
    const blob = await this.downloadFile(bucketName, objectName);
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  /**
   * Удаление файла
   */
  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    await this.minioClient.removeObject(bucketName, objectName);
  }

  /**
   * Удаление нескольких файлов
   */
  async deleteFiles(bucketName: string, objectNames: string[]): Promise<void> {
    await this.minioClient.removeObjects(bucketName, objectNames)
  }

  /**
   * Копирование файла
   */
  async copyFile(
    sourceBucket: string,
    sourceObject: string,
    targetBucket: string,
    targetObject: string
  ): Promise<void> {
    const sourcePath = `${sourceBucket}/${sourceObject}`;
    const conditions = new Minio.CopyConditions();
    await this.minioClient.copyObject(targetBucket, targetObject, sourcePath, conditions)
  }

  /**
   * Получение метаданных файла
   */
  getFileMetadata(bucketName: string, objectName: string): Promise<Minio.BucketItemStat> {
    return this.minioClient.statObject(bucketName, objectName);
  }

  /**
   * Получение политики бакета
   */
  getBucketPolicy(bucketName: string): Promise<string> {
    return this.minioClient.getBucketPolicy(bucketName);
  }

  /**
   * Установка политики бакета
   */
  setBucketPolicy(bucketName: string, policy: string): Promise<void> {
    return this.minioClient.setBucketPolicy(bucketName, policy);
  }

  /**
   * Получение URL для доступа к файлу (публичный доступ)
   */
  getObjectUrl(bucketName: string, objectName: string): string {
    return window.location.protocol + '//' +
      window.location.host + ':' +
      9000 + '/' +
      bucketName + '/' +
      encodeURIComponent(objectName);
  }

  /**
   * Проверка подключения к MinIO
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.minioClient.listBuckets();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Получение информации об использовании хранилища
   */
  getStorageInfo(): Promise<Minio.BucketItemFromList[]> {
    return this.minioClient.listBuckets();
  }

  /**
   * Создание папки (префикса)
   */
  async createFolder(bucketName: string, folderPath: string): Promise<string> {
    // В MinIO папки создаются путем загрузки пустого объекта с "/" в конце
    const folderName = folderPath.endsWith('/') ? folderPath : folderPath + '/';
    const {etag} = await this.minioClient.putObject(bucketName, folderName, Buffer.from(''), 0);
    return etag;
  }

  /**
   * Рекурсивное удаление папки
   */
  async deleteFolder(bucketName: string, folderPath: string): Promise<void> {
    const files = await this.listFiles(bucketName, folderPath, true);
    const fileNames = files.map(file => file.name);
    if (fileNames.length === 0) { return; }
    await this.deleteFiles(bucketName, fileNames);
  }
}
