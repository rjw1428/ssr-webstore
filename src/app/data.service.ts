import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from './models/item';
import { Upload } from './models/upload';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  company = {
    name: "Alpine Custom Knives",
    id: "alpineKnives"
  }
  igLink = "https://www.instagram.com/alpine_custom_knives/"
  shoppingCart: Item[]=[]
  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) { }

  getBackendData(doc: string) {
    return this.afs.collection(this.company.id).doc(doc)
  }

  addToShoppingCart(item: Item) {
    this.shoppingCart.push(item)
    localStorage['shoppingCart']=JSON.stringify(this.shoppingCart)
  }

  clearShoppingCart() {
    localStorage['shoppingCart']=JSON.stringify([])
  }

  getShoppingCart() {
    if(localStorage['shoppingCart'])
      this.shoppingCart=JSON.parse(localStorage['shoppingCart'])
    return this.shoppingCart
  }

  uploadItemImage(upload: Upload, items: Item[], index: number) {
    this.pushUpload(upload, items, index, "shop")
  }

  uploadTempItemImage(upload: Upload, item: Item) {
    this.pushUpload(upload, [item], 0, "temp")
  }

  pushUpload(upload: Upload, items: Item[], itemIndex: number, dataLocation: string) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`inventory/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(upload.progress)
      },
      (error) => {
        console.log(error)
      },
      () => {
        console.log("UPLOAD COMPLETE")
        firebase.storage().ref(uploadTask.snapshot.ref.fullPath)
          .getDownloadURL().then(url => {
            upload.url = url
            upload.name = upload.file.name
            upload.rotation = 0
            delete upload.file
            this.saveFileData(upload, items, itemIndex, dataLocation)
            items[itemIndex].image.splice(items[itemIndex].image.findIndex(img => !img.name), 1)
          })
      }
    );
  }

  saveFileData(upload: Upload, items: Item[], index: number, dataLocation: string) {
    if (!items[index].image) {
      items[index].image = []
    }
    items[index].image.push(Object.assign({}, upload))

    let newItems=JSON.parse(JSON.stringify(items))

    this.saveToBackend(dataLocation, {
      inventory: newItems.map(item => {
        item.image = item.image.filter(img =>img.name)
        return item
      })
    })
  }

  saveToBackend(loc, obj) {
    this.getBackendData(loc)
      .update(obj)
      .then(resp => {
        this.snackBar.open("Changes successfully saved!", "OK", { duration: 2500 })
      })
      .catch(err => {
        console.log(err)
        this.snackBar.open("An Error occurred while trying to save", "OK", { duration: 5000 })
      })
  }
}

