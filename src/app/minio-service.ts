import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

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
  creationDate: Date | undefined;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class MinioService {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: 'ROOTNAME',
      secretAccessKey: 'CHANGEME123'
    });
    this.s3 = new AWS.S3({
      endpoint: `${window.location.protocol}//${window.location.hostname}:9000`,
      s3ForcePathStyle: true, // Необходимо для MinIO
      signatureVersion: 'v4',
      region: 'us-east-1'
    });
  }
  static fileAsString(file: Blob): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Проверка существования бакета
   */
  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      await this.s3.headBucket({ Bucket: bucketName }).promise();
      return true;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Создание бакета
   */
  async createBucket(bucketName: string): Promise<void> {
    await this.s3.createBucket({ Bucket: bucketName }).promise();
  }

  /**
   * Удаление бакета
   */
  async deleteBucket(bucketName: string): Promise<void> {
    await this.s3.deleteBucket({ Bucket: bucketName }).promise();
  }

  async ensureBucket(bucketName: string): Promise<void> {
    if (await this.bucketExists(bucketName)) return;
    await this.createBucket(bucketName);
  }

  /**
   * Получение списка бакетов
   */
  async listBuckets(): Promise<BucketItem[]> {
    const response = await this.s3.listBuckets().promise();
    return response.Buckets?.map(bucket => ({
      name: bucket.Name || '',
      creationDate: bucket.CreationDate
    }) as BucketItem) || [];
  }

  /**
   * Загрузка файла в MinIO
   */
  async uploadFile(
    bucketName: string,
    file: File,
    objectName?: string,
    options?: UploadOptions
  ): Promise<string> {
    await this.ensureBucket(bucketName);
    const fileName = objectName || file.name;
    const contentType = options?.contentType
      || file.type
      || 'application/octet-stream';

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
      Metadata: options?.metadata
    };

    const response = await this.s3.upload(params).promise();
    return response.ETag || '';
  }

  /**
   * Получение списка файлов в бакете
   */
  async listFiles(bucketName: string, prefix?: string, recursive: boolean = true): Promise<FileObject[]> {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: bucketName,
      Prefix: prefix || ''
    };

    const response = await this.s3.listObjectsV2(params).promise();

    if (!response.Contents) {
      return [];
    }

    return response.Contents.map(item => ({
      name: item.Key || '',
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
      etag: item.ETag || '',
      url: this.getPresignedUrl(bucketName, item.Key || '')
    }) as FileObject);
  }

  /**
   * Получение presigned URL для доступа к файлу
   */
  getPresignedUrl(bucketName: string, objectName: string, expires: number = 86400): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: objectName,
      Expires: expires
    });
  }

  /**
   * Получение presigned URL для загрузки файла
   */
  getPresignedPutUrl(bucketName: string, objectName: string, expires: number = 3600): Promise<string> {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: bucketName,
      Key: objectName,
      Expires: expires
    });
  }

  /**
   * Скачивание файла как Blob
   */
  async downloadFile(bucketName: string, objectName: string): Promise<Blob|undefined> {
    if (!await this.bucketExists(bucketName)) return undefined;
    try {
      const response = await this.s3.getObject({
        Bucket: bucketName,
        Key: objectName
      }).promise();

      if (!response?.Body) {
        return undefined;
      }

      // Преобразование Buffer в Blob
      return new Blob([response.Body as any], {
        type: response.ContentType || 'application/octet-stream'
      });
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Скачивание файла как ArrayBuffer
   */
  async downloadFileAsBuffer(bucketName: string, objectName: string): Promise<ArrayBuffer|undefined> {
    const blob = await this.downloadFile(bucketName, objectName);
    if (!blob) return undefined;
    return await blob.arrayBuffer();
  }

  /**
   * Удаление файла
   */
  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: bucketName,
      Key: objectName
    }).promise();
  }

  /**
   * Удаление нескольких файлов
   */
  async deleteFiles(bucketName: string, objectNames: string[]): Promise<void> {
    await this.s3.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects: objectNames.map(name => ({ Key: name }))
      }
    }).promise();
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
    await this.s3.copyObject({
      Bucket: targetBucket,
      Key: targetObject,
      CopySource: `/${sourceBucket}/${sourceObject}`
    }).promise();
  }

  /**
   * Получение метаданных файла
   */
  getFileMetadata(bucketName: string, objectName: string): Promise<AWS.S3.HeadObjectOutput> {
    return this.s3.headObject({
      Bucket: bucketName,
      Key: objectName
    }).promise();
  }

  /**
   * Получение политики бакета
   */
  async getBucketPolicy(bucketName: string): Promise<string> {
    const response = await this.s3.getBucketPolicy({
      Bucket: bucketName
    }).promise();

    return response.Policy || '';
  }

  /**
   * Установка политики бакета
   */
  async setBucketPolicy(bucketName: string, policy: string): Promise<void> {
    await this.s3.putBucketPolicy({
      Bucket: bucketName,
      Policy: policy
    }).promise();
  }

  /**
   * Получение URL для доступа к файлу (публичный доступ)
   */
  getObjectUrl(bucketName: string, objectName: string): string {
    return `${this.s3.endpoint.protocol}//${this.s3.endpoint.hostname}:${this.s3.endpoint.port}/${bucketName}/${encodeURIComponent(objectName)}`;
  }

  /**
   * Проверка подключения к MinIO
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listBuckets();
      return true;
    } catch (error) {
      console.error('Ошибка подключения к MinIO:', error);
      return false;
    }
  }

  /**
   * Получение информации об использовании хранилища
   */
  async getStorageInfo(): Promise<{ totalSize: number; objectCount: number }> {
    const buckets = await this.listBuckets();
    let totalSize = 0;
    let objectCount = 0;

    for (const bucket of buckets) {
      const files = await this.listFiles(bucket.name);
      objectCount += files.length;
      totalSize += files.reduce((sum, file) => sum + file.size, 0);
    }

    return { totalSize, objectCount };
  }

  /**
   * Создание папки (префикса)
   */
  async createFolder(bucketName: string, folderPath: string): Promise<string> {
    // В MinIO папки создаются путем загрузки пустого объекта с "/" в конце
    const folderName = folderPath.endsWith('/') ? folderPath : folderPath + '/';

    const response = await this.s3.putObject({
      Bucket: bucketName,
      Key: folderName,
      Body: '',
      ContentLength: 0
    }).promise();

    return response.ETag || '';
  }

  /**
   * Рекурсивное удаление папки
   */
  async deleteFolder(bucketName: string, folderPath: string): Promise<void> {
    const files = await this.listFiles(bucketName, folderPath);
    const fileNames = files.map(file => file.name);

    if (fileNames.length > 0) {
      await this.deleteFiles(bucketName, fileNames);
    }
  }
}
