import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, ModalFooter, ModalBody } from 'reactstrap';
import Typist from 'react-typist';
export default function Welcome() {
    const [ModalIsopen, setModalIsopen] = useState(true);
    return (
        <div>
            <Modal isOpen={ModalIsopen} onRequestClose={() => setModalIsopen(false)} 
                style={
                    {
                        overlay: {
                            backgroundColor: 'grey'
                        },
                    }
                }>
                <div className="modalbg">
                    <ModalBody>
                        <Typist cursor={{ show: false }}><h1 className="welcome">Welcome to TrailBlazer</h1></Typist>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn btn-success" onClick={() => setModalIsopen(false)}>Okay Let's Move on</Button>
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    );
}