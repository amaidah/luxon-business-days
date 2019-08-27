import helloWorld from './index';

it('prints "Hello World"', () => {
  expect(helloWorld()).toEqual('Hello World');
});
