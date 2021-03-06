import React, { useState } from 'react';
import  tb from '../shared/tb.jpeg';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    Button,
    NavbarBrand
} from 'reactstrap';
const Example = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const disabled = props.disabled;
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="dark" light expand="md">
                <NavbarBrand className="text-white"><img src={tb} alt="logo" width="40" height="40"></img>Trailblazer</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Dijkstra(); }}>Dijkstra</Button>
                        </NavItem>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Dfs(); }}>Depth First Search</Button>
                        </NavItem>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Bfs(); }}>Breadth First Search</Button>
                        </NavItem>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Astar("Euclidean"); }}>Astar Euclidean</Button>
                        </NavItem>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Astar("Manhattan"); }}>Astar Manhattan</Button>
                        </NavItem>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Astar("Diagonal"); }}>Astar Diagonal</Button>
                        </NavItem>
                        <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => props.Reset()}>Reset Grid</Button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>   
        </div>
    );
}

export default Example;