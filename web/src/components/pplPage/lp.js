import React, { Component } from "react";
import Item from "./components/item";

class Listpage extends Component {
  id = 1;
  state = {};

  render() {
    const { Itemcard =[]} = this.props;
    return (
      <ul>
        {Itemcard &&
          Itemcard.map((itemdata, insertIndex) => {
            return (
              <Item
                ImageURL={itemdata.pImg}
                pId={itemdata.pId}
                pImg={itemdata.pImg}
                pComment={itemdata.pComment}
                pName={itemdata.pName}
                pPrice={itemdata.pPrice}
                pLink={itemdata.pLink}
                pLike={itemdata.pLike}
              />
            );
          })}
      </ul>
    );
  }
}
export default Listpage;