import { describe, expect, it } from 'vitest';
import { withBase } from './paths';

describe('withBase', () => {
  it('leaves paths alone at the site root', () => {
    expect(withBase('/lessons/a/', '/')).toBe('/lessons/a/');
  });
  it('prefixes a subfolder base, with or without a trailing slash', () => {
    expect(withBase('/lessons/a/', '/logicapps-course')).toBe('/logicapps-course/lessons/a/');
    expect(withBase('/lessons/a/', '/logicapps-course/')).toBe('/logicapps-course/lessons/a/');
  });
});
