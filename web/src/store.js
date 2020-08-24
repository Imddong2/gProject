import Service from "./service";
import _ from 'lodash'

export default class Store {

    constructor(app) {

        this.app = app;
        this.service = new Service(this);
        this.token = this.loadTokenFromLocalStorage();
        this.PPL=this.loadPPLFromLocalStorage();
        this.like=this.loadLikeFromLocalStorage();
    }


    getCurrentUserTokenId() {

        return _.get(this.token, '_id');
    }

    getCurrentUser() {

        return _.get(this.token, 0);
    }
    logout(){
        
        localStorage.removeItem('token');
        localStorage.removeItem('PPL');
        localStorage.removeItem('like');
        return window.location.href = '/';
    }
    getPPLItem(){
        return _.get(this.PPL);
    }
    loadPPLFromLocalStorage(){
        const data = localStorage.getItem('PPL');

        let PPL = null;

        try {

            PPL = JSON.parse(data);
        } catch (err) {
            console.log("Unable decode token from local store with error:", err);
        }


        return PPL;

    }
    loadLikeFromLocalStorage(){
        const data = localStorage.getItem('like');

        let Like = null;

        try {

            Like = JSON.parse(data);
        } catch (err) {
            console.log("Unable decode token from local store with error:", err);
        }


        return Like;

    }
    

    loadTokenFromLocalStorage() {

        const data = localStorage.getItem('token');

        let token = null;

        try {

            token = JSON.parse(data);
        } catch (err) {
            console.log("Unable decode token from local store with error:", err);
        }


        return token;
    }

    saveUserTokenToLocalStorage(tokenObject) {

        this.token = tokenObject;

        const stringData = JSON.stringify(tokenObject);

        localStorage.setItem('token', stringData);

        // let update our component

        this.update();

    }
    savePPLStorage(PPLobject) {

        this.PPL = PPLobject;

        const stringData = JSON.stringify(PPLobject);
        localStorage.setItem('PPL', stringData);

        // let update our component
        this.update();

    }
    saveLikeStorage(Likeobject) {

        this.Like = Likeobject;

        const stringData = JSON.stringify(Likeobject);
        localStorage.setItem('like', stringData);

        // let update our component
        this.update();

    }

    createUserAccount(user, cb = () => {
    }) {

        this.service.post('/api/users', user).then((res) => {
            return cb(null, res.data);
        }).catch((err) => {

            console.log("Create new account with error:", err);

            return window.location.href = '/login';

        });
    }

    login(user, cb = () => {
    }) {

        this.service.post('/api/login', user).then((res) => {
            const token = _.get(res, 'data', null);
            this.saveUserTokenToLocalStorage(token);
            
            return window.location.href = '/';

        }).catch(err => {

            return cb(err, null);
        })
    }
    getPPL(pplTime,cb=()=>{
    }){
        this.service.post('/api/getPPL', {time: pplTime}).then((res)=>{
            console.log(res);
           const PPL = _.get(res,'data',null);
           this.savePPLStorage(PPL);
           return cb(null, res.data);
        }).catch(err=>{
            return cb(err,null);
        })
    }
    LIKE(pId,cb=()=>{
    }){
        const currentUser = this.getCurrentUser();
        const uId= _.get(currentUser, 'id', '');
        this.service.post('/api/like',{pId: pId, uId: uId}).then((res)=>{
        }).catch(err=>{
            return cb(err,null);
        })
    }
    getLikeItem(cb=()=>{
    }){
        const currentUser = this.getCurrentUser();
        const uId= _.get(currentUser, 'id', '');
        this.service.post('/api/getLikeItem',{uId: uId}).then((res)=>{ 
        const like = _.get(res,'data',null);
        this.saveLikeStorage(like);
        return cb(null, res.data);
     }).catch(err=>{
         return cb(err,null);
     })
 }
    update() {

        this.app.forceUpdate();
    }
}