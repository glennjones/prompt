const utilities = require('../src/models/utils/utilities.js');

describe('clone function', () => {
    test('returns a deep copy of an object', () => {
        const original = {
            name: 'John',
            age: 30,
            address: {
                street: '123 Main St',
                city: 'Anytown',
                state: 'CA'
            }
        };
        const copy = utilities.clone(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
        expect(copy.address).toEqual(original.address);
        expect(copy.address).not.toBe(original.address);
    });

    test('returns null if input is null', () => {
        const result = utilities.clone(null);
        expect(result).toBeNull();
    });

});
