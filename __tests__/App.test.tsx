// Smoke test: App module exports a default component without throwing
import App from '../App';
test('App exports a component', () => {
  expect(typeof App).toBe('function');
});
