export class Upload {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date = new Date();
    rotation: number;
    scale: -1 | 1
  
    constructor(file: File) {
      this.file = file;
    }
  }