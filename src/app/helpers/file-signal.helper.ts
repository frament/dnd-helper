import {resource, signal, WritableSignal} from '@angular/core';
import {MinioService} from '../minio-service';

export class FileSignalHelper {
  protected constructor(bucketName: string, name: string|WritableSignal<string>, fileService: MinioService) {
    this._bucketName = bucketName;
    if (typeof name === 'string') {
      this.objectName.set(name);
    } else {
      this.objectName = name;
    }
    this._fileService = fileService;
  }

  protected _fileService: MinioService;
  private readonly _bucketName: string;
  protected objectName = signal<string>('');
  readonly uploading = signal<boolean>(false);

  readonly file = resource<Blob|undefined, string>({
    params: () => this.objectName(),
    loader: async ({params}) => {
      if (!params) return undefined;
      const file = await this._fileService.downloadFile(this._bucketName, params);
      this.uploading.set(false);
      return file;
    }
  });

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      this.uploading.set(true);
      await this._fileService.uploadFile(this._bucketName, file, this.objectName());
      this.file.reload();
    }
  }

  async remove() {
    await this._fileService.deleteFile(this._bucketName,this.objectName());
    this.file.reload();
  }
}
