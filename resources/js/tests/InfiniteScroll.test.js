import 'regenerator-runtime/runtime';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitFor, render, screen} from '@testing-library/react';
import InfiniteScroll from '../components/InfiniteScroll.js';
import fetchMock from 'jest-fetch-mock';

function eager (tags, key) {
    return <p key={key}>eager</p>;
}

function lazy (tags, key) {
    return <span key={key}>lazy</span>;
}

beforeAll(() => {
    fetchMock.enableMocks();
});

afterEach(() => {
    global.fetch.mockReset();
});


test('eager loaded element in scrolling', () => {
    document.body.innerHTML = 
        '<div id="elements" data-container-id="1">'
        +'<div class="element-container"></div>'
        +'</div>';
    const {container, getByText}= render(<InfiniteScroll containerName="container" elementName="element"
        eagerLoad={eager} lazyLoad={lazy}/>);
    
    expect(getByText('eager')).toBeInTheDocument();
});

//NOTE: Commented out because waitFor causes an error when waiting for the scroll event.
/*test('lazy loaded element in scrolling', async () => {
    document.body.innerHTML = 
        '<div id="elements" data-container-id="1">'
        +'</div>';
    const {container, getByText}= render(<InfiniteScroll containerName="container" elementName="element"
        eagerLoad={eager} lazyLoad={lazy}/>);

    fetch.mockResponseOnce(JSON.stringify({
        element: "test element"
    }));
    fireEvent.scroll(window, {target: {scrollY: 300}});

    expect(fetch).toHaveBeenCalledTimes(1);
    //TODO get waitFor to work right with scroll event
    await waitFor(() => {
        expect(getByText('test element')).toBeInTheDocument()
    });
});*/
