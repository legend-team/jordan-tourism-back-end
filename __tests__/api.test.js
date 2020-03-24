'use strict ';

const server = require('../lib/server.js');
const supergose = require('@code-fellows/supergoose');
const mockRequest = supergose(server);

describe('web server', () => {
    it('post a new category item', () => {
        // try {
            return mockRequest.get('/cities')
                .then(data => {
                    let record = data.body;
                    Object.keys(test).forEach(key => {
                        expect(record[key]).toEqual(test[key]);
                    })
                })
        // } catch{
        //     error => {
        //         error
        //     }
        // }
    })
})





