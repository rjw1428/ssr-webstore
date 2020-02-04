import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from './models/item';
import { Upload } from './models/upload';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  companyId: string
  shoppingCart: Item[] = []
  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.companyId = environment.company.id
  }

  getThumbnail(imageName: string) {
    let part=imageName.split(".")
    let name = part[0]
    let ending = part[1]
    let path = "/inventory/thumbnails/"+name+"_200x200."+ending
    return firebase.storage().ref(path).getDownloadURL()
  }

  getCompanyInfo() {
    return this.afs.collection(environment.company.id).doc("companyInfo").valueChanges().pipe(
      map((companyInfo: {}) => {
        return { ...companyInfo, id: environment.company.id }
      }))
  }

  getBackendData(doc: string) {
    return this.afs.collection(this.companyId).doc(doc)
  }

  getOrders() {
    return this.afs.collection(this.companyId).doc('orders')
    .collection("orders", ref => ref.where("active","==",true).orderBy("dateCreated", "desc"))
    .valueChanges()
  }

  deleteOrder(orderId) {
    return this.afs.collection('alpineKnives').doc("orders").collection("orders").doc(orderId)
    .set({active: false}, {merge: true})
  }

  getInventory(itemType) {
    return this.afs.collection(this.companyId).doc('inventory')
      .collection(itemType, ref => ref.where("active", "==", true))
  }

  addToShoppingCart(item: Item) {
    this.shoppingCart.push(item)
    localStorage['shoppingCart'] = JSON.stringify(this.shoppingCart)
  }

  removeShoppingCartItem(index: number) {
    this.shoppingCart.splice(index, 1)
    localStorage['shoppingCart'] = JSON.stringify(this.shoppingCart)
  }

  clearShoppingCart() {
    localStorage['shoppingCart'] = JSON.stringify([])
    return []
  }

  getShoppingCart() {
    if (localStorage['shoppingCart'])
      this.shoppingCart = JSON.parse(localStorage['shoppingCart'])
    return this.shoppingCart
  }

  uploadItemImage(upload: Upload, item: Item) {
    this.pushUpload(upload, item)
  }

  pushUpload(upload: Upload, item: Item) {
    console.log(item)
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
            //Remove temp loading image
            item.image.splice(item.image.findIndex(img => !img.name), 1)

            //Save newly uploaded image
            upload.url = url
            upload.name = upload.file.name
            upload.rotation = 0
            delete upload.file
            this.saveFileData(upload, item)
          })
      }
    );
  }

  saveFileData(upload: Upload, item: Item) {
    if (!item.image) {
      item.image = []
    }
    item.image.push(Object.assign({}, upload))

    if (item.id)
      this.updateInventory("knives", item)
  }

  saveInventory(itemCategory: string, item: Item) {
    this.afs.collection(this.companyId).doc('inventory').collection(itemCategory).add(item)
      .then(resp => {
        console.log(resp)
        this.afs.collection(this.companyId).doc('inventory').collection(itemCategory).doc(resp.id).update({ id: resp.id })
        this.snackBar.open("Changes successfully saved!", "OK", { duration: 2500 })
      })
      .catch(err => {
        console.log(err)
        this.snackBar.open("An Error occurred while trying to save", "OK", { duration: 5000 })
      })
  }

  updateInventory(itemCategory: string, item: Item) {
    console.log(item)
    this.afs.collection(this.companyId).doc('inventory').collection(itemCategory).doc(item.id).set(item)
      .then(resp => {
        this.snackBar.open("Changes successfully saved!", "OK", { duration: 2500 })
      })
      .catch(err => {
        console.log(err)
        this.snackBar.open("An Error occurred while trying to save", "OK", { duration: 5000 })
      })
  }

  deleteInventoryItem(itemCategory, itemId) {
    this.afs.collection(this.companyId).doc('inventory').collection(itemCategory).doc(itemId)
      .set({ active: 'false' }, { merge: true })
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

