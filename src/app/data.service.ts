import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from './models/item';
import { Upload } from './models/upload';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of, Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  companyId: string
  shoppingCart: Item[] = []
  onChangeCart = new Subject<number>()
  orderId: string;
  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.companyId = environment.company.id
  }

  getThumbnail(imageName: string) {
    let part = imageName.split(".")
    let name = part.filter((p, i) => {
      debugger
      return i != part.length - 1
    }).join(".")
    let ending = part[part.length - 1]
    console.log({ size: part.length, name, ending })
    let path = "/inventory/thumbnails/" + name + "_200x200." + ending
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

  getSiteImagesIcons(imageName: string) {
    let part = imageName.split(".")
    let name = part[0]
    let ending = part[1]
    let path = "/site/thumbnails/" + name + "_200x200." + ending
    return firebase.storage().ref(path).getDownloadURL()
  }

  getOrders() {
    return this.afs.collection(this.companyId).doc('orders')
      .collection("orders", ref => ref.where("active", "==", true).orderBy("dateCreated", "desc"))
      .valueChanges()
  }

  updateOrder(order, updateObj) {
    return this.afs.collection(this.companyId).doc('orders').collection("orders").doc(order.id).set(updateObj, { merge: true })
      .then(rep => {
        this.snackBar.open("Changes successfully saved!", "OK", { duration: 2500 })
      })
      .catch(err => {
        this.snackBar.open("An Error occurred while trying to save", "OK", { duration: 5000 })
      })
  }

  deleteOrder(orderId) {
    return this.afs.collection('alpineKnives').doc("orders").collection("orders").doc(orderId)
      .set({ active: false }, { merge: true })
  }

  getInventory(itemType) {
    return this.afs.collection(this.companyId).doc('inventory')
      .collection(itemType, ref => ref.where("active", "==", true))
  }

  addToShoppingCart(item: Item) {
    this.shoppingCart.push(item)
    localStorage['shoppingCart'] = JSON.stringify(this.shoppingCart)
    this.onChangeCart.next(this.shoppingCart.length)
  }

  removeShoppingCartItem(index: number) {
    this.shoppingCart.splice(index, 1)
    localStorage['shoppingCart'] = JSON.stringify(this.shoppingCart)
    this.onChangeCart.next(this.shoppingCart.length)
  }

  clearShoppingCart() {
    this.shoppingCart = []
    localStorage['shoppingCart'] = JSON.stringify(this.shoppingCart)
    this.onChangeCart.next(this.shoppingCart.length)
    return []
  }

  getShoppingCart(): Observable<Item[]> {
    if (localStorage['shoppingCart'])
      this.shoppingCart = JSON.parse(localStorage['shoppingCart'])
    //VALIDATE THAT THE SHOPPING CART ITEM IS VALID
    return this.getInventory('knives').valueChanges().pipe(
      map((resp: Item[]) => {
        let cart = this.shoppingCart.filter(knive => resp.map(knive => knive.id).includes(knive.id))
        this.onChangeCart.next(cart.length)
        this.shoppingCart = cart
        return cart
      }))
  }

  setOrderId(id: string) {
    this.orderId = id
  }

  uploadSiteImage(upload, id, imageArray?) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`site/${upload.file.name}`).put(upload.file);
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
            console.log(url)

            //Save newly uploaded image
            upload.url = url
            upload.name = upload.file.name
            upload.rotation = 0
            delete upload.file

            // Remove temp loading image
            imageArray[imageArray.findIndex(img => !img.name)] = JSON.parse(JSON.stringify(upload))

            if (id == "homepageBanner")
              this.saveToBackend('siteImages', { [id]: JSON.parse(JSON.stringify(imageArray)) })
            else
              this.saveToBackend('siteImages', { [id]: JSON.parse(JSON.stringify(upload)) })
          })
      })
  }

  uploadItemImage(upload: Upload, item: Item) {
    this.pushUpload(upload, item)
  }

  pushUpload(upload: Upload, item: Item) {
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
            upload.scale = 1
            delete upload.file
            this.saveFileData(upload, item)
          })
      });
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

  saveToBackend(loc, obj, hideAlert?) {
    this.getBackendData(loc)
      .update(obj)
      .then(resp => {
        if (hideAlert)
          this.snackBar.open("Changes successfully saved!", "OK", { duration: 2500 })
      })
      .catch(err => {
        console.log(err)
        this.snackBar.open("An Error occurred while trying to save", "OK", { duration: 5000 })
      })
  }

  getOrderById(id) {
    return this.afs.collection(this.companyId).doc('orders')
      .collection('orders').doc(id).valueChanges()
  }

  sendEmail(order, templateId) {
    this.getBackendData('emailTemplates').valueChanges().pipe(take(1)).subscribe(emailTemplates => {
      this.getCompanyInfo().pipe(take(1)).subscribe(companyInfo => {
        let outputMessage = emailTemplates[templateId]['body']
          .replace(/{{contactUs}}/g, "<a href='mailto:" + companyInfo['email'] + "'>Contact Us</a>")
          .replace(/{{userName}}/g, order.user.firstName)
          .replace(/{{orderNumber}}/g, order.trackingNumber)
          .replace(/{{instagram}}/g, "<a href='" + companyInfo['instagram'] + "'>Instagram</a>")
          .replace(/{{order}}/g, this.orderSummary(order))
        this.afs.collection(this.companyId).doc("customerInfo").collection("emails").add({
          to: [order.user.email],
          message: {
            subject: emailTemplates[templateId]['subject'],
            html: outputMessage,
            text: outputMessage,
          }
        }).then(resp => {
          if (templateId == "confirm") {
            this.afs.collection(this.companyId).doc('orders').collection("orders").doc(order.id).set({ status: "Confirmed" }, { merge: true })
            this.snackBar.open("Email has been triggered!", "OK", { duration: 2500 })
          }
          else if (templateId == "shipped") {
            this.afs.collection(this.companyId).doc('orders').collection("orders").doc(order.id).set({ status: "Shipped", trackingNumber: order.trackingNumber }, { merge: true })
            this.snackBar.open("Email has been triggered!", "OK", { duration: 2500 })
          }
        })
          .catch(err => {
            console.log(err)
            this.snackBar.open("An Error occurred while trying to save", "OK", { duration: 5000 })
          })
      })
    })
  }

  sendAlert(order) {
    this.getCompanyInfo().pipe(take(1)).subscribe(companyInfo => {
      this.afs.collection(this.companyId).doc("customerInfo").collection("emails").add({
        to: [companyInfo['email']],
        message: {
          subject: "💸 New Order",
          html: '<h3>New Order:' + order.id + '</h3>' + this.orderSummary(order) + '<br> ~Sent by Wilk with love ✌️',
          text: '<h3>New Order:' + order.id + '</h3>' + this.orderSummary(order) + '<br> ~Sent by Wilk with love ✌️',
        }
      })
    })
  }

  orderSummary(order): string {
    let output = "<br>"
    order.items.forEach(item => {
      output += "<img src='" + item.thumbnail + "'><p>" + item.description + "</p><br>"
    })
    let orderTotal = order.items
      .map(item => item.price)
      .reduce((acc, curr) => acc += curr)
    output += orderTotal ? "<strong>Total: $" + orderTotal.toFixed(2) + "</strong>" : ""
    return output
  }
}

