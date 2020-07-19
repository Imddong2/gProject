import React,{Component} from 'react'
import styled  from 'styled-components'
import Player from "../player";
import PPL from "../PPL";

const LiveWrapper = styled.div `
width: 100%;
height: 400px;

`

const LiveVideo = styled.div ` 
    width: 50%;
    float: left;

`

const LivePPL = styled.div `
width: 40%;
float: right;    

`
export default class Watch extends Component{

    render(){

        return <LiveWrapper>
            <LiveVideo>
                <Player />
            </LiveVideo>
            <LivePPL>
                <PPL/>
            </LivePPL>
        </LiveWrapper>
    }
}