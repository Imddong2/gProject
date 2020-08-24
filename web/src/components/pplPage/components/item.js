import React, { Component } from "react";
import styled from 'styled-components'
import Store from "../../../store";
 
 const Img = styled.img`
 float: left;
 width: 100px;
 height: 130px;
 margin-right: 10px;
 margin-bottom: 10px;
 border-right: 1px solid #ddd;
 `
 const PPLWrapper = styled.li`
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    margin: 10px 0;
    background-color : lightgray;
 `
 const PPLW = styled.div`   
    margin: 10px 10px 10px 10px;
 `
 const FormSubmit = styled.button `
        
        border: 1px solid rgba(0, 0, 0.06);
        padding: 3px 5px;
        background: #FFF;
        font-weight: 600;

`

class Item extends Component{
    constructor(props) {
        super(props);


        this.state = {

            store: new Store(this)
            
        }
    }
    _likePPL(){
        const {store} = this.state;
        const pId = this.props.pId;
        store.LIKE(pId);
    }
    render(){
        return <PPLWrapper>
        <PPLW>
            <Img src={this.props.pImg} alt="" />
            <p>
              <span>{this.props.pComment}</span>
            </p>
            <p>product name : {this.props.pName}</p>
            <p>price : {this.props.pPrice}</p>
            <a href={this.props.pLink} style={{textDecoration: 'none', color: 'blue'}} onclick="return false">{this.props.pLink}</a><br/>
            <p>Like : {this.props.pLike}  <FormSubmit onClick={(e) => {this._likePPL()}} type={"submit"}>LIKE</FormSubmit></p>
        </PPLW>
    </PPLWrapper>
    }
}
export default Item;
