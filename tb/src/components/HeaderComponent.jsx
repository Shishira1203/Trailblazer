import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Button
} from 'reactstrap';
const Example = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const disabled = props.disabled;
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="dark" light expand="md">
                <NavbarBrand href="/" className="text-white">Trailblazer Alpha</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                            <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Dijkstra();}}>Dijkstra</Button>
                            </NavItem>
                            <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Dfs();}}>Depth First Search</Button>
                            </NavItem>
                            <NavItem>
                            <Button disabled={disabled} className="btn bg-transparent  text-white" onClick={() => { props.Bfs();}}>Breadth First Search</Button>
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