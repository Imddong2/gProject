import React from 'react'
import styled from 'styled-components'
import {borderColor, headerHeight, containerMaxWidth} from "./theme";
import userAvatar from './images/avatar.png'
import Watch from './pages/watch'
import Home from "./pages/home";
import {Route, Switch, Link} from 'react-router-dom'
import Register from "./pages/user/register";
import Login from "./pages/user/login";
import Mypage from "./pages/user/mypage";
import Store from "../store";
import _ from 'lodash'


const AppWrapper = styled.div `
   
`;
const Container = styled.div `
    max-width: ${containerMaxWidth}px;
    margin: 0 auto;
`
const Form = styled.div `
font-size: 14px;
font-weight: 700;
line-height: ${headerHeight}px;
padding-right: 10px;
`
const MenuItemBox = styled.div `
font-size: 14px;
font-weight: 700;
line-height: ${headerHeight}px;
padding-right: 10px;
`
const Header = styled.div `
      
        height: ${headerHeight}px;
        border-bottom: 1px solid ${borderColor};
`

const Main = styled.div `
    padding: 20px 0;
    
`

const Footer = styled.div `
    border-top: 1px solid ${borderColor};
    padding: 10px 0;
`
const Copyright = styled.p`
    font-size: 12px;
    text-align: center;
`
const HeaderTitle = styled.div `
    font-size: 35px;
    font-weight: 800;
    line-height: ${headerHeight}px;
    flex-grow: 1;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
`
const HeaderUserMenu = styled.div `
    width: 50px;
    display: flex;
    align-items: center;
`
const HeaderWrapper = styled.div `
    display: flex;
    
`
const HeaderUserAvatar = styled.img `
    border-radius: 50%;
    width: 30px;
    height: 30px;
`

const UserTitle = styled.div `
    font-size: 14px;
    font-weight: 700;
    line-height: ${headerHeight}px;
    padding-right: 10px;
`
const FormSubmit = styled.button `
        
        border: 1px solid rgba(0, 0, 0.06);
        padding: 5px 5px;
        background: #FFF;
        font-weight: 600;
        

`
export default class App extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            store: new Store(this)
            
        }
    }
    


    render() {

        const {store} = this.state;

        const currentUser = store.getCurrentUser();

        return <AppWrapper>
            <Header>
                <HeaderWrapper>
                    <HeaderTitle><Link to='/' style={{ textDecoration: 'none', color: 'black' }}>PPL LIVE</Link></HeaderTitle>
                    <MenuItemBox>
                    {currentUser ?  null :<Link to='/login'  style={{ textDecoration: 'none', color: 'black'}}>로그인 &nbsp; </Link>}
                    {currentUser ?  null : <Link to='/register' style={{ textDecoration: 'none', color: 'black' }}>회원가입</Link>}
                    {currentUser ? <Link to='/watch/live' style={{ textDecoration: 'none', color: 'black' }}>LIVE  </Link> : null}
                    {currentUser ? <Link to='/mypage' style={{ textDecoration: 'none', color: 'black' }}>| MYPAGE  </Link> : null}
                    </MenuItemBox>
                    {currentUser ? <UserTitle>{_.get(currentUser, 'name', '')}</UserTitle> : null}
                    <Form>
                    {currentUser ? <FormSubmit onClick={(e) => {store.logout()}} type={"submit"}>Logout</FormSubmit>: null}
                    </Form>
                </HeaderWrapper>
            </Header>
            <Main>
                <Container>
                    <Switch>
                        <Route exact path={'/login'} render={(routeProps) => <Login {...routeProps} store={store}/>}/>
                        <Route exact path={'/mypage'} render={(routeProps) => <Mypage {...routeProps} store={store}/>}/>
                        <Route exact path={'/register'}
                               render={(routeProps) => <Register {...routeProps} store={store}/>}/>
                        <Route exact path={'/watch/:id'}
                               render={(routeProps) => <Watch {...routeProps} store={store}/>}/>
                        <Route exact path={'/'} render={(routeProps) => <Home {...routeProps} store={store}/>}/>
                    </Switch>
                </Container>
            </Main>
            <Footer>
                <Container>
                    <Copyright>® 2020 Division of Computer Engineering, Dongseo University Hyeon-Jin Im.</Copyright>
                </Container>
            </Footer>
        </AppWrapper>
    }

}