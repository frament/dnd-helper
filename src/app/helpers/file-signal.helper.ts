import {resource, Signal, signal} from '@angular/core';
import {MinioService} from '../minio-service';

export type FileSignalOptions = {maxSize?:number, allowedFileTypes?:string[]};

export class FileSignalHelper {
  protected constructor(bucketName: string, name: string|Signal<string>,
                        fileService: MinioService, options?:FileSignalOptions) {
    this._bucketName = bucketName;
    this.objectName = typeof name === 'string' ? signal<string>(name) : name;
    this._fileService = fileService;
    this.options = options;
  }

  protected _fileService: MinioService;
  private readonly _bucketName: string;
  protected options: FileSignalOptions|undefined;
  protected objectName: Signal<string>;
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
      if (this.options?.maxSize && file.size > this.options.maxSize) {
        return;
      }
      if (this.options?.allowedFileTypes?.length
        && !this.options?.allowedFileTypes.includes(file.type)) {
        return
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
