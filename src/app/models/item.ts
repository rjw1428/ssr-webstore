import { Option } from 'src/app/models/option';
import { Upload } from '../data.service';

export class Item {
    id: string;
    name: string;
    description: string[];
    price: number;
    image: Upload[];
    isSold: boolean;
    isFeatured: boolean;
    dateAdded: any;
    tags: { id: string, value: string }[]
    active: boolean;
    constructor(filterList?: Option[]) {
        this.id = "";
        this.name = "";
        this.description = [""];
        this.image = [];
        this.isSold = false;
        this.isFeatured = false;
        this.dateAdded = "";
        this.tags = filterList?filterList.map(filter=>({id: filter.id, value: ''})):[]
        this.active = true;
    }
}
