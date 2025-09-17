import {TBaseEntity} from '../models/base-entity.model';
import {computed, effect, InputSignal, OutputEmitterRef, signal, WritableSignal} from '@angular/core';
import {deepClone} from '../helpers/clone-helper';
import {deepCompare} from '../helpers/obj-diff-helper';

export abstract class EntityEditorBase<T extends TBaseEntity>{
  abstract item: InputSignal<T>;
  abstract patch: OutputEmitterRef<Partial<T|null>>;
  _initial: T|undefined;
  _inited = signal<boolean>(false);
  sig: {[key: string]: WritableSignal<any>} = {};
  _item = computed<Partial<T>>(() => Object.fromEntries(
    Object.entries(this.sig).map(([key,sig]) => [key, sig()])
  ) as Partial<T>);
  private excludeKeys = new Set(['id','createdAt','updatedAt']);
  protected constructor() {
    effect(() => {
      this._inited.set(false);
      if (!this.item()) return;
      const item = deepClone(this.item());
      this._initial = item;
      for(const [key,val] of Object.entries(item)) {
        if (this.excludeKeys.has(key)) continue;
        this.sig[key] = signal(val);
      }
      this._inited.set(true)
    });
    effect(() => {
      const patch = deepCompare(this.item(), {...this._initial,...this._item()});
      this.patch.emit(patch);
    });
  }
}
