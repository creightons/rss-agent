import React from 'react';
import { get } from '../utils';

export default function ListItem({ id, name }) {
    function clickHandler() {
        const url = `/rss/${id}`;
        get(url)
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }

    return (
        <li onClick={clickHandler}>{name}</li>
    );
}
