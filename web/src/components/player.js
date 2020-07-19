import React,{Component} from 'react'
import styled from 'styled-components'
import Hls from 'hls.js'
import Store from "../store";

const PlayerWrapper = styled.div`
    position:relative; 
`
const PlayerInner = styled.div`

`
const VideoTitle = styled.h2 `
    font-size: 22px; 
    color: rgba(0, 0, 0 , 0.7);
    line-height: 25px;
    font-weight: 400;
    
`
const VideoLiveButtonTitle = styled.span `

    display: inline-block;
    border: 1px solid red;
    padding: 2px 10px;
    line-height: 25px;
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
`
const FormSubmit = styled.button `
        
        border: 1px solid rgba(0, 0, 0.06);
        display: inline-block;
        padding: 2px 10px;
        line-height: 25px;
        font-size: 14px;
        background: #FFF;
        margin-right: 10px;
        font-weight: 400;
`
export const Form = styled.form`
`

export default class player extends Component{


    constructor(props){
        super(props);
        this.state = {
            store: new Store(this)
            
        }
        this._onTouchInsidePlayer = this._onTouchInsidePlayer.bind(this)
        this._getTime = this._getTime.bind(this)
        this.toHHMMSS=this.toHHMMSS.bind(this)

    }
    componentDidMount(){
        const liveChannel = 'hjinny';
        this.setState({ video: document.getElementById('video-player') })
        if(Hls.isSupported() && this.player) {
            const streamURL = `http://localhost:3002/live/${liveChannel}/index.m3u8`;
            const video = this.player;


            video.addEventListener('contextmenu', (e) => {


                e.preventDefault();
                return false;
            })


            const hls = new Hls();
            hls.loadSource(streamURL);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }


    }
    _onTouchInsidePlayer(){

        if(this.player.paused){
            this.player.play();
        }else{
            this.player.pause();
        }
    }
    _getTime(){
        const {store} = this.state;
        const time= this.state.video.currentTime;
        const time2=Math.floor(time);
        const pplTime=this.toHHMMSS(time2);
        store.getPPL(pplTime);
    }
    toHHMMSS(seconds) {
        var hour = parseInt(seconds/3600);
        var min = parseInt((seconds%3600)/60);
        var sec = seconds%60;

        hour = (hour < 10) ? "0" + hour : hour;
        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;
        return hour+':'+min+':'+sec;
      }
    
    render(){
        const style = {
            width: 640,
            height: 360,
            background: '#000',
        }
        
        return <PlayerWrapper>
            <PlayerInner>
                <video id='video-player' controls={false} onClick={this._onTouchInsidePlayer} style={style} ref={(player) => this.player = player} autoPlay={true} />
            </PlayerInner>
            <VideoTitle><FormSubmit onClick={(e) => {this._getTime()}} type={"submit"}>getPPL</FormSubmit><VideoLiveButtonTitle>Live</VideoLiveButtonTitle>JTBC LIVE</VideoTitle>
            
        </PlayerWrapper>
    }
}