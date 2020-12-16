import React, { Component } from 'react';
import '../App.css';
export default class Node extends Component {
    render() {
        const {
            col,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
            className
        } = this.props;

        return (
            <div
                id={`node-${row}-${col}`}
                className={className}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}></div>
        );
    }
}