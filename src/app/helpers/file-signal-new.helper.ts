import {resource, Signal, signal} from '@angular/core';
import {MinioService} from '../minio-service';
import {Database} from '../database';
import {Surreal} from 'surrealdb';

export type FileSignalOptions = {maxSize?:number, allowedFileTypes?:string[]};

export class FileSignalHelperNew {
  constructor(bucketName: string, name: string|Signal<string>,
                        db: Database, options?:FileSignalOptions) {
    this._bucketName = bucketName;
    this.objectName = typeof name === 'string' ? signal<string>(name) : name;
    this._db = db.db;
    this.options = options;
  }

  protected _db: Surreal;
  private readonly _bucketName: string;
  protected options: FileSignalOptions|undefined;
  protected objectName: Signal<string>;
  readonly uploading = signal<boolean>(false);

  readonly file = resource<Blob|undefined, string>({
    params: () => this.objectName(),
    loader: async ({params}) => {
      if (!params) return undefined;
      const [arrBuffer] = await this._db.query<[Blob]>(`f"my_bucket:/${params}".get()`);
      const file = new Blob( [ arrBuffer ], { type: 'image/jpeg' } );
      this.uploading.set(false);
      return file;
    }
  });

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (this.options?.maxSize && file.size > this.options.maxSize) {
        return;
      }
      if (this.options?.allowedFileTypes?.length
        && !this.options?.allowedFileTypes.includes(file.type)) {
        return
      }
      this.uploading.set(true);
      const bytes = await this.blobToByteArray(file);
      console.log(bytes);
      console.log(`f"my_bucket:/${this.objectName()}".put("${bytes}")`);
      await this._db.query<[Blob]>(`f"my_bucket:/${this.objectName()}".put(<bytes>[${bytes}])`);
      this.file.reload();
    }
  }

  async blobToByteArray(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    return byteArray
  }

  async remove() {
    await this._db.query(`f"my_bucket:/${this.objectName()}".delete()`);
    this.file.reload();
  }

  fileAsString(file: Blob): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  readonly asString = resource<string|undefined, Blob|undefined>({
    params: () => this.file.value(),
    loader: async ({params}) => {
      if (!params) return undefined;
      const result = await this.fileAsString(params);
      this.uploading.set(false);
      return result;
    }
  })
}
