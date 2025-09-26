import {resource, WritableSignal} from '@angular/core';
import {MinioService} from '../minio-service';
import {FileSignalHelper} from './file-signal.helper';

export class ImageSignalHelper extends FileSignalHelper{
  constructor(bucketName: string, name: string|WritableSignal<string>, fileService: MinioService) {
    super(bucketName, name, fileService);
  }
  readonly image = resource<string|undefined, Blob|undefined>({
    params: () => this.file.value(),
    loader: async ({params}) => {
      if (!params) return undefined;
      const result = await MinioService.fileAsString(params);
      this.uploading.set(false);
      return result;
    }
  })
}
