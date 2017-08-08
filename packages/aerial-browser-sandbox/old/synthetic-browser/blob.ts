
export class FakeBlob {
  readonly type: string;
  constructor(readonly parts: any[], { type } : any) {
    this.type = type;
  }
}

export const Blob = typeof window !== "undefined" ? window.Blob : FakeBlob;

