import {resource, Signal} from '@angular/core';
import {MinioService} from '../minio-service';
import {FileSignalHelper, FileSignalOptions} from './file-signal.helper';

export class ImageSignalHelper extends FileSignalHelper{
  constructor(bucketName: string, name: string|Signal<string>,
              fileService: MinioService, options?:FileSignalOptions) {
    super(bucketName, name, fileService, options);
  }
  readonly asString = resource<string|undefined, Blob|undefined>({
    params: () => this.file.value(),
    loader: async ({params}) => {
      if (!params) return undefined;
      const result = await MinioService.fileAsString(params);
      this.uploading.set(false);
      return result;
    }
  })
}
