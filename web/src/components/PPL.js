//App.js
import React, { Component } from "react";
import Listpage from "./pplPage/lp";
import Store from "../store";

class PPL extends Component {
  // 제일 common한 state값 초기 셋팅
  state = {
    loading: false,
    ItemList: [] // 처음 Itemlist는 있는 상태로 기획 []
  };

  
  loadItem(){
    // Json Data 불러오기
      const PPLItem = new Store(this).loadPPLFromLocalStorage();
        this.setState({
          loading: true, // load되었으니 true,
          ItemList: PPLItem // 비어있던 Itemlist는 data에 Item객체를 찾아넣어준다. ( Item : json파일에 있는 항목)
        });
  };

  componentDidMount() {
    setInterval(()=>{
    this.loadItem();},1000)
  }

  // APP.js 컴포넌트의 최종 보여지는 render값 정의
  render() {
    const { ItemList } = this.state;
    return (
      <div>
        <Listpage Itemcard={ItemList} />
      </div>
    );
  }
}

export default PPL;